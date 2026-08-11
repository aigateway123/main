package controller

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/provider"
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

var errMissingAuth = errors.New("missing authorization")

type chatRequest struct {
	Model       string          `json:"model"`
	Messages    json.RawMessage `json:"messages"`
	Temperature float64         `json:"temperature"`
	Stream      bool            `json:"stream"`
}

// authenticateAPIKey 兼容两种 API Key 认证方式：
// Authorization: Bearer <key>（OpenAI SDK）与 x-api-key: <key>（Anthropic SDK）。
func (c *ChatController) authenticateAPIKey(r *http.Request) (userID int64, apiKeyID int64, err error) {
	apiKey := ""
	if authHeader := r.Header.Get("Authorization"); authHeader != "" {
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && strings.EqualFold(parts[0], "bearer") {
			apiKey = parts[1]
		}
	}
	if apiKey == "" {
		apiKey = r.Header.Get("x-api-key")
	}
	if apiKey == "" {
		return 0, 0, errMissingAuth
	}
	return c.routerSvc.ValidateApiKey(r.Context(), apiKey)
}

// writeChatError 按入站协议输出错误响应（Anthropic 端点返回 Anthropic 错误格式）。
func writeChatError(w http.ResponseWriter, inbound provider.ChatProtocol, status int, code, msg string) {
	if inbound == provider.ProtocolAnthropic {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		json.NewEncoder(w).Encode(map[string]any{
			"type": "error",
			"error": map[string]any{
				"type":    code,
				"message": msg,
			},
		})
		return
	}
	writeError(w, status, code, msg)
}

// HandleChatCompletions 对外提供 OpenAI 兼容推理端点（POST /v1/chat/completions）。
func (c *ChatController) HandleChatCompletions(w http.ResponseWriter, r *http.Request) {
	c.handleInbound(w, r, provider.ProtocolOpenAI, func(body []byte) (string, bool, error) {
		var chatReq chatRequest
		if err := json.Unmarshal(body, &chatReq); err != nil {
			return "", false, errors.New("invalid request body")
		}
		if chatReq.Model == "" {
			return "", false, errors.New("model is required")
		}
		return chatReq.Model, chatReq.Stream, nil
	})
}

// HandleMessages 对外提供 Anthropic 兼容推理端点（POST /v1/messages）。
func (c *ChatController) HandleMessages(w http.ResponseWriter, r *http.Request) {
	c.handleInbound(w, r, provider.ProtocolAnthropic, func(body []byte) (string, bool, error) {
		var req struct {
			Model     string            `json:"model"`
			MaxTokens *int              `json:"max_tokens"`
			Messages  []json.RawMessage `json:"messages"`
			Stream    bool              `json:"stream"`
		}
		if err := json.Unmarshal(body, &req); err != nil {
			return "", false, errors.New("invalid request body")
		}
		if req.Model == "" {
			return "", false, errors.New("model is required")
		}
		if req.MaxTokens == nil {
			return "", false, errors.New("max_tokens is required")
		}
		if len(req.Messages) == 0 {
			return "", false, errors.New("messages is required")
		}
		return req.Model, req.Stream, nil
	})
}

// handleInbound 双协议共用的请求链路：认证 → 配额 → 模型授权 → Policy → 路由转发 → 计费 → 日志。
func (c *ChatController) handleInbound(w http.ResponseWriter, r *http.Request, inbound provider.ChatProtocol, extract func(body []byte) (string, bool, error)) {
	startTime := time.Now()

	userID, apiKeyID, err := c.authenticateAPIKey(r)
	if err != nil {
		if errors.Is(err, errMissingAuth) {
			writeChatError(w, inbound, http.StatusUnauthorized, "AUTH001", "missing authorization header")
			return
		}
		if errors.Is(err, service.ErrApiKeyDisabled) {
			writeChatError(w, inbound, http.StatusForbidden, "AUTH004", "api key is disabled")
			return
		}
		writeChatError(w, inbound, http.StatusUnauthorized, "AUTH002", "invalid api key")
		return
	}

	// Billing checks (skip for admin users - admin can be determined by role)
	if c.billingSvc != nil {
		if err := c.billingSvc.EnsureQuotaAvailable(r.Context(), userID); err != nil {
			c.logger.Warn("quota check failed", "userID", userID, "error", err)
			writeChatError(w, inbound, http.StatusPaymentRequired, "QUOTA_EXCEEDED", "quota balance is insufficient")
			return
		}
	}

	// Parse request body (with 10MB limit)
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		writeChatError(w, inbound, http.StatusBadRequest, "VALID001", "request body too large")
		return
	}

	model, stream, err := extract(bodyBytes)
	if err != nil {
		writeChatError(w, inbound, http.StatusBadRequest, "VALID001", err.Error())
		return
	}

	// Look up model for billing check (need modelID)
	var chatModelID int64
	if c.billingSvc != nil {
		models, listErr := c.modelSvc.List(r.Context(), "")
		if listErr == nil {
			for _, m := range models {
				if m.ModelCode == model {
					chatModelID = m.ID
					break
				}
			}
		}
		if chatModelID > 0 {
			if err := c.billingSvc.CheckModelAccess(r.Context(), userID, chatModelID); err != nil {
				c.logger.Warn("model access check failed", "userID", userID, "modelID", chatModelID, "error", err)
				writeChatError(w, inbound, http.StatusForbidden, "MODEL_FORBIDDEN", "model is not authorized for this user")
				return
			}
		}
	}

	// Policy Engine: Check quota for the requested model
	if c.policySvc != nil {
		if err := c.policySvc.CheckQuota(r.Context(), userID, model); err != nil {
			if errors.Is(err, service.ErrQuotaExceeded) {
				c.logger.Warn("policy quota exceeded", "userID", userID, "model", model)
				writeChatError(w, inbound, http.StatusForbidden, "QUOTA_EXCEEDED", "quota exceeded for this model")
				return
			}
			c.logger.Error("policy quota check failed", "error", err)
		}
	}

	// Select provider and call with fallback（请求体按各 Provider 出站协议自动转换）
	resp, target, err := c.routerSvc.CallWithFallback(r.Context(), model, bodyBytes, inbound)
	latencyMs := int(time.Since(startTime).Milliseconds())

	if err != nil {
		c.logger.Error("provider call failed", "error", err)
		status, code, msg := http.StatusBadGateway, "GATEWAY001", "provider request failed"
		switch {
		case errors.Is(err, service.ErrModelNotFound):
			status, code, msg = http.StatusNotFound, "VALID001", "model not found: "+model
		case errors.Is(err, service.ErrModelDisabled):
			status, code, msg = http.StatusForbidden, "AUTH004", "model is disabled"
		case errors.Is(err, service.ErrNoProviderBound):
			status, code, msg = http.StatusServiceUnavailable, "ROUTER001", "no provider bound to model"
		case errors.Is(err, service.ErrNoProviderAvailable):
			status, code, msg = http.StatusServiceUnavailable, "ROUTER001", "no available provider for model"
		}
		writeChatError(w, inbound, status, code, msg)
		return
	}
	defer resp.Body.Close()

	// Handle provider error status
	if resp.StatusCode >= 400 {
		providerBody, _ := io.ReadAll(resp.Body)
		c.logger.Error("provider returned error", "provider", target.ProviderName, "status", resp.StatusCode)

		// 按入站协议转换错误体（跨协议时避免客户端解析失败）；转换失败降级原样透传
		outBody := providerBody
		if converted := provider.ConvertErrorBody(inbound, target.ProtocolType, providerBody); len(converted) > 0 {
			outBody = converted
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(resp.StatusCode)
		w.Write(outBody)

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

	if stream {
		c.proxyStream(w, r.Context(), resp, target, inbound, userID, apiKeyID, model, latencyMs, startTime)
		return
	}
	c.proxyNonStream(w, r.Context(), resp, target, inbound, userID, apiKeyID, model, latencyMs, startTime)
}

// proxyNonStream 转发非流式响应：按入站协议转换并完成计费。
func (c *ChatController) proxyNonStream(w http.ResponseWriter, ctx context.Context, resp *http.Response, target *service.ProviderTarget, inbound provider.ChatProtocol, userID, apiKeyID int64, model string, latencyMs int, startTime time.Time) {
	providerBody, err := io.ReadAll(resp.Body)
	if err != nil {
		writeChatError(w, inbound, http.StatusBadGateway, "GATEWAY001", "failed to read provider response")
		return
	}

	// 计费按 Provider 出站协议解析 token
	inputTokens, outputTokens := provider.ParseUsage(target.ProtocolType, providerBody)

	// 响应转换（Provider 协议 → 入站协议）
	outBody, convErr := provider.BuildInboundResponse(inbound, target.ProtocolType, providerBody)
	if convErr != nil {
		c.logger.Warn("response conversion failed, returning raw", "provider", target.ProviderName, "error", convErr)
		outBody = providerBody
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(outBody)

	c.finishBilling(ctx, userID, apiKeyID, target, model, inputTokens, outputTokens, latencyMs, startTime)
}

// proxyStream 转发流式响应：逐行做 SSE 协议转换（含末尾 usage 注入）并完成计费。
func (c *ChatController) proxyStream(w http.ResponseWriter, ctx context.Context, resp *http.Response, target *service.ProviderTarget, inbound provider.ChatProtocol, userID, apiKeyID int64, model string, latencyMs int, startTime time.Time) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.WriteHeader(resp.StatusCode)

	flusher, _ := w.(http.Flusher)
	transformer := provider.NewStreamTransformer(inbound, target.ProtocolType)
	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	// 记录转换后的流（即入站协议格式），用于计费解析
	var streamBuf bytes.Buffer
	writeEvent := func(line string) {
		streamBuf.WriteString(line)
		streamBuf.WriteString("\n")
		_, _ = io.WriteString(w, line+"\n")
	}

	for scanner.Scan() {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)
		if !strings.HasPrefix(trimmed, "data:") {
			writeEvent(trimmed)
			continue
		}
		eventData := strings.TrimSpace(strings.TrimPrefix(trimmed, "data:"))
		for _, o := range transformer.Transform(eventData) {
			writeEvent("data: " + o)
		}
		if flusher != nil {
			flusher.Flush()
		}
	}

	// 扫描中断（超长行 / 网络中断）时记录日志，避免静默截断
	if scanErr := scanner.Err(); scanErr != nil {
		c.logger.Warn("stream scan interrupted", "provider", target.ProviderName, "error", scanErr)
	}

	// 流结束收尾事件（如 [DONE] / message_stop）
	for _, o := range transformer.Finish() {
		writeEvent("data: " + o)
	}
	if flusher != nil {
		flusher.Flush()
	}

	// 按入站协议从转换后流中解析 token 计费
	inputTokens, outputTokens := provider.ParseStreamUsage(inbound, streamBuf.Bytes())
	c.finishBilling(ctx, userID, apiKeyID, target, model, inputTokens, outputTokens, latencyMs, startTime)
}

// finishBilling 计费、额度扣减与请求日志（流式与非流式共用）。
func (c *ChatController) finishBilling(ctx context.Context, userID, apiKeyID int64, target *service.ProviderTarget, model string, inputTokens, outputTokens int, latencyMs int, startTime time.Time) {
	costAmount := 0.0
	if c.policySvc != nil {
		costAmount = c.policySvc.CalculateCost(ctx, target.ProviderID, target.ModelCode, inputTokens, outputTokens)
		if consumeErr := c.policySvc.ConsumeQuota(ctx, userID, model, inputTokens+outputTokens); consumeErr != nil {
			c.logger.Error("quota consumption failed", "error", consumeErr)
		}
	}

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
		cost, costErr := c.billingSvc.ComputeCost(ctx, target.ModelID, inputTokens, outputTokens, startTime)
		if costErr == nil {
			if deductErr := c.billingSvc.DeductAndRecord(ctx, logEntry, cost); deductErr != nil {
				c.logger.Error("cost deduction failed", "error", deductErr)
			}
		} else {
			c.logger.Warn("cost computation failed", "error", costErr)
			c.usageSvc.RecordLog(ctx, logEntry)
		}
	} else {
		c.usageSvc.RecordLog(ctx, logEntry)
	}
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
	_, _, err := c.authenticateAPIKey(r)
	if err != nil {
		writeChatError(w, provider.ProtocolOpenAI, http.StatusUnauthorized, "AUTH002", "invalid api key")
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
