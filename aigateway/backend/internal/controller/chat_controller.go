package controller

import (
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
	routerSvc *service.RouterService
	usageSvc  *service.UsageService
	logger    *slog.Logger
}

func NewChatController(routerSvc *service.RouterService, usageSvc *service.UsageService, logger *slog.Logger) *ChatController {
	return &ChatController{routerSvc: routerSvc, usageSvc: usageSvc, logger: logger}
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
		
		// Buffer for token parsing (optional, but good for logs)
		// For now, we just proxy the stream
		_, proxyErr := io.Copy(w, resp.Body)
		if proxyErr != nil {
			c.logger.Warn("stream proxy interrupted", "error", proxyErr)
		}
		if ok {
			flusher.Flush()
		}

		// Record log (stream usage counting is hard, set to 0 for now)
		c.usageSvc.RecordLog(r.Context(), &entity.RequestLog{
			UserID:        userID,
			ApiKeyID:      apiKeyID,
			ModelID:       target.ModelID,
			ProviderID:    target.ProviderID,
			ModelCode:     target.ModelCode,
			ProviderName:  target.ProviderName,
			InputTokens:   0, // TODO: parse from stream
			OutputTokens:  0, // TODO: parse from stream
			LatencyMs:     latencyMs,
			RequestStatus: "success",
		})
		return
	}

	// Non-streaming success
	providerBody, err := io.ReadAll(resp.Body)
	if err != nil {
		writeError(w, http.StatusBadGateway, "GATEWAY001", "failed to read provider response")
		return
	}

	// Parse token usage
	type providerResponse struct {
		Usage *struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
		} `json:"usage"`
	}
	inputTokens := 0
	outputTokens := 0
	var providerResp providerResponse
	if parseErr := json.Unmarshal(providerBody, &providerResp); parseErr == nil && providerResp.Usage != nil {
		inputTokens = providerResp.Usage.PromptTokens
		outputTokens = providerResp.Usage.CompletionTokens
	}

	// Record success log
	c.usageSvc.RecordLog(r.Context(), &entity.RequestLog{
		UserID:        userID,
		ApiKeyID:      apiKeyID,
		ModelID:       target.ModelID,
		ProviderID:    target.ProviderID,
		ModelCode:     target.ModelCode,
		ProviderName:  target.ProviderName,
		InputTokens:   inputTokens,
		OutputTokens:  outputTokens,
		LatencyMs:     latencyMs,
		RequestStatus: "success",
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(providerBody)
}
