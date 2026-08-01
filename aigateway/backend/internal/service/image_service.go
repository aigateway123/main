package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/provider"
	"aigateway/backend/internal/repository"
)

// ImageGenerationRequest represents an image generation API request.
type ImageGenerationRequest struct {
	Model          string
	Prompt         string
	N              int
	Size           string
	ResponseFormat string
	User           string
}

// ImageGenerationResponse represents the unified image generation API response.
type ImageGenerationResponse struct {
	Created int64                 `json:"created"`
	Data    []ImageResponseData   `json:"data"`
	Usage   *ImageResponseUsage   `json:"usage,omitempty"`
}

// ImageResponseData represents a single image in the response.
type ImageResponseData struct {
	URL           string `json:"url,omitempty"`
	B64JSON       string `json:"b64_json,omitempty"`
	RevisedPrompt string `json:"revised_prompt,omitempty"`
}

// ImageResponseUsage contains usage information for the response.
type ImageResponseUsage struct {
	PromptTokens int `json:"prompt_tokens"`
	TotalTokens  int `json:"total_tokens"`
	ImageCount   int `json:"image_count"`
}

// ImageService handles image generation business logic.
type ImageService struct {
	modelRepo        repository.ModelRepository
	bindingRepo      repository.ModelBindingRepository
	providerRepo     repository.ProviderRepository
	routerSvc        *RouterService
	billingSvc       *BillingService
	policySvc        *PolicyService
	usageSvc         *UsageService
	logRepo          repository.RequestLogRepository
	providerAdapters map[string]provider.ImageProviderAdapter // key: provider_name
	httpClient       *HTTPClient
	logger           *slog.Logger
}

// NewImageService creates a new ImageService.
func NewImageService(
	modelRepo repository.ModelRepository,
	bindingRepo repository.ModelBindingRepository,
	providerRepo repository.ProviderRepository,
	routerSvc *RouterService,
	billingSvc *BillingService,
	policySvc *PolicyService,
	usageSvc *UsageService,
	logRepo repository.RequestLogRepository,
	httpClient *HTTPClient,
	logger *slog.Logger,
) *ImageService {
	// Build default provider adapters (OpenAI-compatible as default)
	defaultAdapter := provider.NewOpenAICompatibleAdapter(&httpClient.Client)
	adapters := map[string]provider.ImageProviderAdapter{
		"default": defaultAdapter,
	}

	return &ImageService{
		modelRepo:        modelRepo,
		bindingRepo:      bindingRepo,
		providerRepo:     providerRepo,
		routerSvc:        routerSvc,
		billingSvc:       billingSvc,
		policySvc:        policySvc,
		usageSvc:         usageSvc,
		logRepo:          logRepo,
		providerAdapters: adapters,
		httpClient:       httpClient,
		logger:           logger,
	}
}

// RegisterProviderAdapter registers a custom provider adapter for a specific provider name.
func (s *ImageService) RegisterProviderAdapter(providerName string, adapter provider.ImageProviderAdapter) {
	s.providerAdapters[providerName] = adapter
}

// GenerateImage performs the full image generation flow.
func (s *ImageService) GenerateImage(ctx context.Context, req *ImageGenerationRequest, userID, apiKeyID int64) (*ImageGenerationResponse, error) {
	startTime := time.Now()

	model, target, adapter, err := s.resolveModelAndBinding(ctx, req.Model)
	if err != nil {
		return nil, err
	}

	providerResp, err := s.doGenerate(ctx, target, adapter, req)
	if err != nil {
		s.logger.Error("image provider call failed", "provider", target.ProviderName, "error", err)
		return nil, fmt.Errorf("provider call failed: %w", err)
	}

	latencyMs, costAmount, imageCount := s.processBilling(ctx, userID, apiKeyID, model, target, providerResp, startTime)

	return s.buildResponse(providerResp, latencyMs, costAmount, imageCount)
}

// resolveModelAndBinding looks up the model, resolves bindings, and builds the provider target.
func (s *ImageService) resolveModelAndBinding(ctx context.Context, modelCode string) (*entity.Model, *ProviderTarget, provider.ImageProviderAdapter, error) {
	model, err := s.modelRepo.GetByCode(ctx, modelCode)
	if err != nil {
		return nil, nil, nil, ErrModelNotFound
	}
	if model.ModelType != "image" {
		return nil, nil, nil, ErrModelNotFound
	}
	if model.ModelStatus != "active" {
		return nil, nil, nil, ErrModelDisabled
	}

	bindings, err := s.bindingRepo.ListByModelID(ctx, model.ID)
	if err != nil {
		return nil, nil, nil, ErrInternal
	}
	if len(bindings) == 0 {
		return nil, nil, nil, ErrNoProviderBound
	}

	var activeBinding *entity.ModelProviderBinding
	for _, b := range bindings {
		if b.BindingStatus == "active" {
			activeBinding = b
			break
		}
	}
	if activeBinding == nil {
		return nil, nil, nil, ErrNoProviderBound
	}

	providerEntity, err := s.providerRepo.GetByID(ctx, activeBinding.ProviderID)
	if err != nil {
		return nil, nil, nil, ErrNoProviderAvailable
	}
	if !providerEntity.IsEnabledFlag {
		return nil, nil, nil, ErrNoProviderAvailable
	}

	apiPath := providerEntity.APIPath
	if activeBinding.APIPathOverride != nil && *activeBinding.APIPathOverride != "" {
		apiPath = *activeBinding.APIPathOverride
	}
	if apiPath == "" {
		apiPath = "/v1/images/generations"
	}

	target := &ProviderTarget{
		ProviderID:     providerEntity.ID,
		ProviderName:   providerEntity.ProviderName,
		BaseURL:        providerEntity.BaseURL,
		ProviderAPIKey: providerEntity.APIKeyRef,
		APIPath:        apiPath,
		ModelID:        model.ID,
		ModelCode:      model.ModelCode,
	}

	adapter, ok := s.providerAdapters[providerEntity.ProviderName]
	if !ok {
		adapter = s.providerAdapters["default"]
	}

	return model, target, adapter, nil
}

// doGenerate builds the provider request and calls the provider adapter.
func (s *ImageService) doGenerate(ctx context.Context, target *ProviderTarget, adapter provider.ImageProviderAdapter, req *ImageGenerationRequest) (*provider.ImageGenerateResponse, error) {
	n := req.N
	if n < 1 {
		n = 1
	}
	size := req.Size
	if size == "" {
		size = "1024x1024"
	}
	responseFormat := req.ResponseFormat
	if responseFormat == "" {
		responseFormat = "url"
	}

	providerReq := &provider.ImageGenerateRequest{
		Model:          target.ModelCode,
		Prompt:         req.Prompt,
		N:              n,
		Size:           size,
		ResponseFormat: responseFormat,
		User:           req.User,
	}

	return adapter.Generate(ctx, &entity.Provider{
		BaseURL:      target.BaseURL,
		APIKeyRef:    target.ProviderAPIKey,
		APIPath:      target.APIPath,
		ProviderName: target.ProviderName,
	}, providerReq)
}

// processBilling handles cost calculation, policy enforcement, and billing deduction.
func (s *ImageService) processBilling(ctx context.Context, userID, apiKeyID int64, model *entity.Model, target *ProviderTarget, providerResp *provider.ImageGenerateResponse, startTime time.Time) (latencyMs int, costAmount float64, imageCount int) {
	latencyMs = int(time.Since(startTime).Milliseconds())

	imageCount = 0
	if providerResp.Usage != nil {
		imageCount = providerResp.Usage.ImageCount
	}

	costAmount = 0.0
	if s.billingSvc != nil && model.ID > 0 {
		cost, costErr := s.billingSvc.ComputeImageCost(ctx, model.ID, imageCount, reqSizeOrDefault(providerResp), startTime)
		if costErr == nil {
			costAmount = cost
		} else {
			s.logger.Warn("image cost computation failed", "error", costErr)
		}
	}

	if s.policySvc != nil {
		policyCost := s.policySvc.CalculateCost(ctx, target.ProviderID, target.ModelCode, 0, 0)
		if policyCost > 0 && costAmount == 0 {
			costAmount = policyCost
		}
		if consumeErr := s.policySvc.ConsumeQuota(ctx, userID, model.ModelCode, imageCount); consumeErr != nil {
			s.logger.Error("quota consumption failed", "error", consumeErr)
		}
	}

	logEntry := &entity.RequestLog{
		UserID:        userID,
		ApiKeyID:      apiKeyID,
		ModelID:       target.ModelID,
		ProviderID:    target.ProviderID,
		ModelCode:     target.ModelCode,
		ProviderName:  target.ProviderName,
		InputTokens:   0,
		OutputTokens:  0,
		CostAmount:    costAmount,
		LatencyMs:     latencyMs,
		RequestStatus: "success",
		ModelType:     "image",
		UsageUnit:     "image_count",
		UsageAmount:   imageCount,
	}

	if s.billingSvc != nil && target.ModelID > 0 {
		if deductErr := s.billingSvc.DeductAndRecord(ctx, logEntry, costAmount); deductErr != nil {
			s.logger.Error("cost deduction failed", "error", deductErr)
			if errors.Is(deductErr, ErrQuotaExceeded) {
				return latencyMs, costAmount, imageCount
			}
		}
	} else {
		s.usageSvc.RecordLog(ctx, logEntry)
	}

	return latencyMs, costAmount, imageCount
}

// buildResponse constructs the API response from the provider response.
func (s *ImageService) buildResponse(providerResp *provider.ImageGenerateResponse, latencyMs int, costAmount float64, imageCount int) (*ImageGenerationResponse, error) {
	created := time.Now().Unix()
	resp := &ImageGenerationResponse{
		Created: created,
		Data:    make([]ImageResponseData, len(providerResp.Data)),
	}

	for i, img := range providerResp.Data {
		resp.Data[i] = ImageResponseData{
			URL:           img.URL,
			B64JSON:       img.B64JSON,
			RevisedPrompt: img.RevisedPrompt,
		}
	}

	if providerResp.Usage != nil {
		resp.Usage = &ImageResponseUsage{
			PromptTokens: providerResp.Usage.PromptTokens,
			TotalTokens:  providerResp.Usage.TotalTokens,
			ImageCount:   providerResp.Usage.ImageCount,
		}
	}

	return resp, nil
}

// reqSizeOrDefault returns the size from provider response usage or a default value.
// This is a best-effort helper; the actual size used for billing is determined upstream.
func reqSizeOrDefault(resp *provider.ImageGenerateResponse) string {
	return "1024x1024"
}

// HTTPClient wraps http.Client for use in ImageService.
type HTTPClient struct {
	Client http.Client
}
