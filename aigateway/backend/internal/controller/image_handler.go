package controller

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/service"
)

// ImageHandler handles image generation API requests.
type ImageHandler struct {
	imageSvc *service.ImageService
	routerSvc *service.RouterService
	usageSvc  *service.UsageService
	modelSvc  *service.ModelService
	billingSvc *service.BillingService
	policySvc *service.PolicyService
	logger    *slog.Logger
}

// NewImageHandler creates a new ImageHandler.
func NewImageHandler(
	imageSvc *service.ImageService,
	routerSvc *service.RouterService,
	usageSvc *service.UsageService,
	modelSvc *service.ModelService,
	billingSvc *service.BillingService,
	policySvc *service.PolicyService,
	logger *slog.Logger,
) *ImageHandler {
	return &ImageHandler{
		imageSvc:   imageSvc,
		routerSvc:  routerSvc,
		usageSvc:   usageSvc,
		modelSvc:   modelSvc,
		billingSvc: billingSvc,
		policySvc:  policySvc,
		logger:     logger,
	}
}

// ImageGenerationRequest is the OpenAI-compatible image generation request body.
type ImageGenerationRequest struct {
	Model          string `json:"model" binding:"required"`
	Prompt         string `json:"prompt" binding:"required"`
	N              *int   `json:"n,omitempty"`
	Size           *string `json:"size,omitempty"`
	ResponseFormat *string `json:"response_format,omitempty"`
	User           *string `json:"user,omitempty"`
}

// ImageGenerationResponse is the OpenAI-compatible image generation response.
type ImageGenerationResponse struct {
	Created int64              `json:"created"`
	Data    []ImageData        `json:"data"`
	Usage   *ImageUsage        `json:"usage,omitempty"`
}

// ImageData represents a single generated image in the response.
type ImageData struct {
	URL           *string `json:"url,omitempty"`
	B64JSON       *string `json:"b64_json,omitempty"`
	RevisedPrompt *string `json:"revised_prompt,omitempty"`
}

// ImageUsage contains usage information for the API response.
type ImageUsage struct {
	PromptTokens int `json:"prompt_tokens"`
	TotalTokens  int `json:"total_tokens"`
	ImageCount   int `json:"image_count"`
}

// HandleGenerations handles POST /v1/images/generations
func (h *ImageHandler) HandleGenerations(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	// 1. Authenticate via API Key
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

	userID, apiKeyID, err := h.routerSvc.ValidateApiKey(r.Context(), parts[1])
	if err != nil {
		h.logger.Error("api key validation failed", "error", err)
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

	// 2. Parse request body (with 10MB limit)
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)
	var req ImageGenerationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	// 3. Validate required fields
	if req.Model == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "model is required")
		return
	}
	if req.Prompt == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "prompt is required")
		return
	}

	// 4. Check billing quota
	if h.billingSvc != nil {
		if err := h.billingSvc.EnsureQuotaAvailable(r.Context(), userID); err != nil {
			h.logger.Warn("quota check failed", "userID", userID, "error", err)
			writeError(w, http.StatusPaymentRequired, "QUOTA_EXCEEDED", "quota balance is insufficient")
			return
		}
	}

	// 5. Check model access (authorization-based)
	if h.billingSvc != nil {
		models, listErr := h.modelSvc.List(r.Context(), "")
		if listErr == nil {
			for _, m := range models {
				if m.ModelCode == req.Model {
					if err := h.billingSvc.CheckModelAccess(r.Context(), userID, m.ID); err != nil {
						h.logger.Warn("model access check failed", "userID", userID, "modelID", m.ID, "error", err)
						writeError(w, http.StatusForbidden, "MODEL_FORBIDDEN", "model is not authorized for this user")
						return
					}
					break
				}
			}
		}
	}

	// 6. Set defaults
	n := 1
	if req.N != nil && *req.N > 0 && *req.N <= 10 {
		n = *req.N
	}
	size := "1024x1024"
	if req.Size != nil && *req.Size != "" {
		size = *req.Size
	}
	responseFormat := "url"
	if req.ResponseFormat != nil && *req.ResponseFormat != "" {
		responseFormat = *req.ResponseFormat
	}
	user := ""
	if req.User != nil {
		user = *req.User
	}

	// 6. Call ImageService
	svcReq := &service.ImageGenerationRequest{
		Model:          req.Model,
		Prompt:         req.Prompt,
		N:              n,
		Size:           size,
		ResponseFormat: responseFormat,
		User:           user,
	}

	result, err := h.imageSvc.GenerateImage(r.Context(), svcReq, userID, apiKeyID)
	latencyMs := int(time.Since(startTime).Milliseconds())

	if err != nil {
		h.logger.Error("image generation failed", "error", err)
		switch {
		case errors.Is(err, service.ErrModelNotFound):
			writeError(w, http.StatusNotFound, "VALID001", "model not found: "+req.Model)
		case errors.Is(err, service.ErrModelDisabled):
			writeError(w, http.StatusForbidden, "AUTH004", "model is disabled")
		case errors.Is(err, service.ErrNoProviderBound):
			writeError(w, http.StatusServiceUnavailable, "ROUTER001", "no provider bound to model")
		case errors.Is(err, service.ErrNoProviderAvailable):
			writeError(w, http.StatusServiceUnavailable, "ROUTER001", "no available provider for model")
		case errors.Is(err, service.ErrQuotaExceeded):
			writeError(w, http.StatusPaymentRequired, "QUOTA_EXCEEDED", "quota balance is insufficient")
		default:
			writeError(w, http.StatusBadGateway, "GATEWAY001", "image generation failed")
		}
		// Record failed log
		_ = h.usageSvc.RecordLog(r.Context(), &entity.RequestLog{
			UserID:        userID,
			ApiKeyID:      apiKeyID,
			ModelCode:     req.Model,
			LatencyMs:     latencyMs,
			RequestStatus: "failed",
			ModelType:     "image",
			UsageUnit:     "image_count",
			UsageAmount:   0,
		})
		return
	}

	// 7. Build API response
	apiResp := ImageGenerationResponse{
		Created: result.Created,
		Data:    make([]ImageData, len(result.Data)),
	}

	for i, img := range result.Data {
		apiResp.Data[i] = ImageData{
			URL:           strPtr(img.URL),
			B64JSON:       strPtr(img.B64JSON),
			RevisedPrompt: strPtr(img.RevisedPrompt),
		}
		// Only set fields that are non-empty
		if img.URL == "" {
			apiResp.Data[i].URL = nil
		}
		if img.B64JSON == "" {
			apiResp.Data[i].B64JSON = nil
		}
		if img.RevisedPrompt == "" {
			apiResp.Data[i].RevisedPrompt = nil
		}
	}

	if result.Usage != nil {
		apiResp.Usage = &ImageUsage{
			PromptTokens: result.Usage.PromptTokens,
			TotalTokens:  result.Usage.TotalTokens,
			ImageCount:   result.Usage.ImageCount,
		}
	}

	writeJSON(w, http.StatusOK, apiResp)
}

func strPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
