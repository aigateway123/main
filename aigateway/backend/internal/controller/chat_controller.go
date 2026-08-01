package controller

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/service"
)

type ChatController struct {
	routerSvc  *service.RouterService
	usageSvc   *service.UsageService
	modelSvc   *service.ModelService
	billingSvc *service.BillingService
	policySvc  *service.PolicyService
	logger     *slog.Logger
}

func NewChatController(routerSvc *service.RouterService, usageSvc *service.UsageService, modelSvc *service.ModelService, billingSvc *service.BillingService, policySvc *service.PolicyService, logger *slog.Logger) *ChatController {
	return &ChatController{routerSvc: routerSvc, usageSvc: usageSvc, modelSvc: modelSvc, billingSvc: billingSvc, policySvc: policySvc, logger: logger}
}

type chatRequest struct {
	Model       string          `json:"model"`
	Messages    json.RawMessage `json:"messages"`
	Temperature float64         `json:"temperature"`
	Stream      bool            `json:"stream"`
}

func (c *ChatController) HandleChatCompletions(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	// Extract and validate API Key
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authorization header")
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
		writeError(w, http.StatusUnauthorized, "AUTH002", "invalid authorization format")
		return
	}

	userID, apiKeyID, err := c.routerSvc.ValidateApiKey(r.Context(), parts[1])
	if err != nil {
		c.logger.Error("api key validation failed", "error", err)
		switch {
		case errors.Is(err, service.ErrInvalidApiKey):
			writeError(w, http.StatusUnauthorized, "AUTH002", "invalid api key")
		case errors.Is(err, service.ErrApiKeyDisabled):
			writeError(w, http.StatusForbidden, "AUTH004", "api key is disabled")
		default:
			writeError(w, http.StatusUnauthorized, "AUTH002", "authentication failed")
		}
		return
	}

	// Billing checks (skip for admin users - admin can be determined by role)
	if c.billingSvc != nil {
		if err := c.billingSvc.EnsureQuotaAvailable(r.Context(), userID); err != nil {
			c.logger.Warn("quota check failed", "userID", userID, "error", err)
			writeError(w, http.StatusPaymentRequired, "QUOTA_EXCEEDED", "quota balance is insufficient")
			return
		}
	}

	// Parse request body (with 10MB limit)
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "request body too large")
		return
	}

	var chatReq chatRequest
	if err := json.Unmarshal(bodyBytes, &chatReq); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if chatReq.Model == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "model is required")
		return
	}

	// Look up model for billing check (need modelID)
	var chatModelID int64
	if c.billingSvc != nil {
		models, listErr := c.modelSvc.List(r.Context(), "")
		if listErr == nil {
			for _, m := range models {
				if m.ModelCode == chatReq.Model {
					chatModelID = m.ID
					break
				}
			}
		}
		if chatModelID > 0 {
			if err := c.billingSvc.CheckModelAccess(r.Context(), userID, chatModelID); err != nil {
				c.logger.Warn("model access check failed", "userID", userID, "modelID", chatModelID, "error", err)
				writeError(w, http.StatusForbidden, "MODEL_FORBIDDEN", "model is not authorized for this user")
				return
			}
		}
	}

	// Policy Engine: Check quota for the requested model
	if c.policySvc != nil {
		if err := c.policySvc.CheckQuota(r.Context(), userID, chatReq.Model); err != nil {
			if errors.Is(err, service.ErrQuotaExceeded) {
				c.logger.Warn("policy quota exceeded", "userID", userID, "model", chatReq.Model)
				writeError(w, http.StatusForbidden, "QUOTA_EXCEEDED", "quota exceeded for this model")
				return
			}
			c.logger.Error("policy quota check failed", "error", err)
		}
	}

	// Select provider and call with fallback
	resp, target, err := c.routerSvc.CallWithFallback(r.Context(), chatReq.Model, bodyBytes)
	latencyMs := int(time.Since(startTime).Milliseconds())

	// Handle error from fallback
	if err != nil {
		c.logger.Error("provider call failed", "error", err)
		switch {
		case errors.Is(err, service.ErrModelNotFound):
			writeError(w, http.StatusNotFound, "VALID001", "model not found: "+chatReq.Model)
		case errors.Is(err, service.ErrModelDisabled):
			writeError(w, http.StatusForbidden, "AUTH004", "model is disabled")
		case errors.Is(err, service.ErrNoProviderBound):
			writeError(w, http.StatusServiceUnavailable, "ROUTER001", "no provider bound to model")
		case errors.Is(err, service.ErrNoProviderAvailable):
			writeError(w, http.StatusServiceUnavailable, "ROUTER001", "no available provider for model")
		default:
			writeError(w, http.StatusBadGateway, "GATEWAY001", "provider request failed")
		}
		return
	}
	defer resp.Body.Close()

	// Handle provider error status
	if resp.StatusCode >= 400 {
		providerBody, _ := io.ReadAll(resp.Body)
		c.logger.Error("provider returned error", "provider", target.ProviderName, "status", resp.StatusCode)
		w.WriteHeader(resp.StatusCode)
		w.Write(providerBody)

		// Record failed log
		c.usageSvc.RecordLog(r.Context(), &entity.RequestLog{
			UserID:        userID,
			ApiKeyID:      apiKeyID,
			ModelID:       target.ModelID,
			ProviderID:    target.ProviderID,
			ModelCode:     target.ModelCode,
			ProviderName:  target.ProviderName,
			LatencyMs:     latencyMs,
			RequestStatus: "failed",
		})
		return
	}

	// Success: forward the provider's response back to the client
	if chatReq.Stream {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")
		w.WriteHeader(resp.StatusCode)

		flusher, ok := w.(http.Flusher)

		// Capture streaming content for token usage parsing
		var streamBuf bytes.Buffer
		teeReader := io.TeeReader(resp.Body, &streamBuf)
		_, proxyErr := io.Copy(w, teeReader)
		if proxyErr != nil {
			c.logger.Warn("stream proxy interrupted", "error", proxyErr)
		}
		if ok {
			flusher.Flush()
		}

		// Parse token usage from the last SSE chunk
		inputTokens, outputTokens := parseStreamUsage(streamBuf.Bytes())

		// Policy Engine: Calculate cost
		costAmount := 0.0
		if c.policySvc != nil {
			costAmount = c.policySvc.CalculateCost(r.Context(), target.ProviderID, target.ModelCode, inputTokens, outputTokens)
			// Consume quota
			if consumeErr := c.policySvc.ConsumeQuota(r.Context(), userID, chatReq.Model, inputTokens+outputTokens); consumeErr != nil {
				c.logger.Error("quota consumption failed", "error", consumeErr)
			}
		}

		// Billing for streaming (same logic as non-streaming)
		logEntry := &entity.RequestLog{
			UserID:        userID,
			ApiKeyID:      apiKeyID,
			ModelID:       target.ModelID,
			ProviderID:    target.ProviderID,
			ModelCode:     target.ModelCode,
			ProviderName:  target.ProviderName,
			InputTokens:   inputTokens,
			OutputTokens:  outputTokens,
			CostAmount:    costAmount,
			LatencyMs:     latencyMs,
			RequestStatus: "success",
		}

		if c.billingSvc != nil && target.ModelID > 0 {
			cost, costErr := c.billingSvc.ComputeCost(r.Context(), target.ModelID, inputTokens, outputTokens, startTime)
			if costErr == nil {
				if deductErr := c.billingSvc.DeductAndRecord(r.Context(), logEntry, cost); deductErr != nil {
					c.logger.Error("cost deduction failed", "error", deductErr)
				}
			} else {
				c.logger.Warn("cost computation failed", "error", costErr)
				c.usageSvc.RecordLog(r.Context(), logEntry)
			}
		} else {
			c.usageSvc.RecordLog(r.Context(), logEntry)
		}
		return
	}

	// Non-streaming success
	providerBody, err := io.ReadAll(resp.Body)
	if err != nil {
		writeError(w, http.StatusBadGateway, "GATEWAY001", "failed to read provider response")
		return
	}

	// Parse token usage
	inputTokens, outputTokens := parseTokenUsage(providerBody)

	// Policy Engine: Calculate cost
	costAmount := 0.0
	if c.policySvc != nil {
		costAmount = c.policySvc.CalculateCost(r.Context(), target.ProviderID, target.ModelCode, inputTokens, outputTokens)
		// Consume quota
		if consumeErr := c.policySvc.ConsumeQuota(r.Context(), userID, chatReq.Model, inputTokens+outputTokens); consumeErr != nil {
			c.logger.Error("quota consumption failed", "error", consumeErr)
		}
	}

	// Compute cost and deduct (with billing)
	logEntry := &entity.RequestLog{
		UserID:        userID,
		ApiKeyID:      apiKeyID,
		ModelID:       target.ModelID,
		ProviderID:    target.ProviderID,
		ModelCode:     target.ModelCode,
		ProviderName:  target.ProviderName,
		InputTokens:   inputTokens,
		OutputTokens:  outputTokens,
		CostAmount:    costAmount,
		LatencyMs:     latencyMs,
		RequestStatus: "success",
	}

	if c.billingSvc != nil && target.ModelID > 0 {
		cost, costErr := c.billingSvc.ComputeCost(r.Context(), target.ModelID, inputTokens, outputTokens, startTime)
		if costErr == nil {
			if deductErr := c.billingSvc.DeductAndRecord(r.Context(), logEntry, cost); deductErr != nil {
				c.logger.Error("cost deduction failed", "error", deductErr)
			}
		} else {
			c.logger.Warn("cost computation failed", "error", costErr)
			// Fall back to simple log recording
			c.usageSvc.RecordLog(r.Context(), logEntry)
		}
	} else {
		c.usageSvc.RecordLog(r.Context(), logEntry)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(providerBody)
}

// openAIModel represents a model in OpenAI's API format
type openAIModel struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	OwnedBy string `json:"owned_by"`
}

type openAIModelList struct {
	Object string         `json:"object"`
	Data   []openAIModel `json:"data"`
}

// HandleListOpenAIModels returns the model list in OpenAI-compatible format (API Key auth)
func (c *ChatController) HandleListOpenAIModels(w http.ResponseWriter, r *http.Request) {
	// Validate API Key (same as chat completions)
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authorization header")
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
		writeError(w, http.StatusUnauthorized, "AUTH002", "invalid authorization format")
		return
	}

	_, _, err := c.routerSvc.ValidateApiKey(r.Context(), parts[1])
	if err != nil {
		writeError(w, http.StatusUnauthorized, "AUTH002", "invalid api key")
		return
	}

	// List models
	models, err := c.modelSvc.List(r.Context(), "")
	if err != nil {
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "failed to list models")
		return
	}

	result := openAIModelList{
		Object: "list",
		Data:   make([]openAIModel, 0, len(models)),
	}
	for _, m := range models {
		result.Data = append(result.Data, openAIModel{
			ID:      m.ModelCode,
			Object:  "model",
			Created: m.CreatedTime,
			OwnedBy: "system",
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

// parseTokenUsage extracts token usage from a non-streaming provider response body.
func parseTokenUsage(body []byte) (inputTokens, outputTokens int) {
	type providerResponse struct {
		Usage *struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
		} `json:"usage"`
	}
	var resp providerResponse
	if err := json.Unmarshal(body, &resp); err == nil && resp.Usage != nil {
		return resp.Usage.PromptTokens, resp.Usage.CompletionTokens
	}
	return 0, 0
}

// parseStreamUsage extracts token usage from the last SSE data chunk.
// Streaming responses end with a chunk containing usage info, e.g.:
//
//	data: {"id":"...","object":"chat.completion.chunk","choices":[],"usage":{"prompt_tokens":10,"completion_tokens":20}}
func parseStreamUsage(data []byte) (inputTokens, outputTokens int) {
	lines := strings.Split(string(data), "\n")
	for i := len(lines) - 1; i >= 0; i-- {
		line := strings.TrimSpace(lines[i])
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		jsonStr := strings.TrimPrefix(line, "data: ")
		if jsonStr == "[DONE]" {
			continue
		}
		var chunk struct {
			Usage *struct {
				PromptTokens     int `json:"prompt_tokens"`
				CompletionTokens int `json:"completion_tokens"`
			} `json:"usage"`
		}
		if err := json.Unmarshal([]byte(jsonStr), &chunk); err == nil && chunk.Usage != nil {
			return chunk.Usage.PromptTokens, chunk.Usage.CompletionTokens
		}
	}
	return 0, 0
}
