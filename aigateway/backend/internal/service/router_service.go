package service

import (
	"bytes"
	"context"
	"crypto/sha256"
	"crypto/tls"
	"encoding/hex"
	"log/slog"
	"net/http"
	"sort"
	"strings"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type ProviderTarget struct {
	ProviderID     int64
	ProviderName   string
	BaseURL        string
	ProviderAPIKey string
	APIPath        string
	ModelID        int64
	ModelCode      string
}

type RouterService struct {
	modelRepo    repository.ModelRepository
	bindingRepo  repository.ModelBindingRepository
	providerRepo repository.ProviderRepository
	keyRepo      repository.ApiKeyRepository
	httpClient   *http.Client
	logger       *slog.Logger
}

func NewRouterService(
	modelRepo repository.ModelRepository,
	bindingRepo repository.ModelBindingRepository,
	providerRepo repository.ProviderRepository,
	keyRepo repository.ApiKeyRepository,
	logger *slog.Logger,
) *RouterService {
	// Custom transport to disable HTTP/2 which can sometimes cause TLS issues with certain proxies/gateways
	transport := &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: false,
		},
		ForceAttemptHTTP2: false,
		DisableKeepAlives: true, // Disable keep-alives to ensure fresh TLS session for debugging
	}

	return &RouterService{
		modelRepo:    modelRepo,
		bindingRepo:  bindingRepo,
		providerRepo: providerRepo,
		keyRepo:      keyRepo,
		httpClient:   &http.Client{Timeout: 120 * time.Second, Transport: transport},
		logger:       logger,
	}
}

func (s *RouterService) ValidateApiKey(ctx context.Context, rawKey string) (userID int64, apiKeyID int64, err error) {
	if !strings.HasPrefix(rawKey, "sk-") {
		return 0, 0, ErrInvalidApiKey
	}

	prefix := rawKey
	if len(rawKey) > 12 {
		prefix = rawKey[:12]
	}

	key, err := s.keyRepo.GetByPrefix(ctx, prefix)
	if err != nil {
		return 0, 0, ErrInvalidApiKey
	}

	if key.KeyStatus != "active" {
		return 0, 0, ErrApiKeyDisabled
	}

	hash := sha256.Sum256([]byte(rawKey))
	if hex.EncodeToString(hash[:]) != key.KeyHash {
		return 0, 0, ErrInvalidApiKey
	}

	return key.UserID, key.ID, nil
}

func (s *RouterService) SelectProvider(ctx context.Context, modelCode string) (*ProviderTarget, error) {
	model, err := s.modelRepo.GetByCode(ctx, modelCode)
	if err != nil {
		return nil, ErrModelNotFound
	}

	if model.ModelStatus != "active" {
		return nil, ErrModelDisabled
	}

	bindings, err := s.bindingRepo.ListByModelID(ctx, model.ID)
	if err != nil {
		return nil, ErrInternal
	}
	if len(bindings) == 0 {
		return nil, ErrNoProviderBound
	}

	var activeBindings []*entity.ModelProviderBinding
	for _, b := range bindings {
		if b.BindingStatus == "active" {
			activeBindings = append(activeBindings, b)
		}
	}
	if len(activeBindings) == 0 {
		return nil, ErrNoProviderBound
	}

	// Pre-fetch all relevant providers to avoid N+1 queries during sort
	providerCache := make(map[int64]*entity.Provider, len(activeBindings))
	for _, binding := range activeBindings {
		p, err := s.providerRepo.GetByID(ctx, binding.ProviderID)
		if err == nil {
			providerCache[binding.ProviderID] = p
		}
	}

	// Sort by priority (lower = higher priority), then by weight descending
	sort.SliceStable(activeBindings, func(i, j int) bool {
		pi := providerCache[activeBindings[i].ProviderID]
		pj := providerCache[activeBindings[j].ProviderID]

		if pi == nil || pj == nil {
			return activeBindings[i].Weight > activeBindings[j].Weight
		}

		if pi.Priority != pj.Priority {
			return pi.Priority < pj.Priority
		}
		return activeBindings[i].Weight > activeBindings[j].Weight
	})

	for _, binding := range activeBindings {
		provider, exists := providerCache[binding.ProviderID]
		if !exists || !provider.IsEnabledFlag {
			continue
		}

		apiPath := provider.APIPath
		if apiPath == "" {
			apiPath = "/v1/chat/completions"
		}
		return &ProviderTarget{
			ProviderID:     provider.ID,
			ProviderName:   provider.ProviderName,
			BaseURL:        strings.TrimRight(provider.BaseURL, "/"),
			ProviderAPIKey: provider.APIKeyRef,
			APIPath:        apiPath,
			ModelID:        model.ID,
			ModelCode:      model.ModelCode,
		}, nil
	}

	return nil, ErrNoProviderAvailable
}

func (s *RouterService) CallProvider(ctx context.Context, target *ProviderTarget, requestBody []byte) (*http.Response, error) {
	chatURL := target.BaseURL + target.APIPath

	req, err := http.NewRequestWithContext(ctx, "POST", chatURL, bytes.NewReader(requestBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+target.ProviderAPIKey)

	return s.httpClient.Do(req)
}

// CallWithFallback selects a provider and calls it, with automatic fallback to the next available provider on failure.
// It returns the successful http response along with the target that was used.
func (s *RouterService) CallWithFallback(ctx context.Context, modelCode string, requestBody []byte) (resp *http.Response, target *ProviderTarget, err error) {
	model, err := s.modelRepo.GetByCode(ctx, modelCode)
	if err != nil {
		return nil, nil, ErrModelNotFound
	}

	if model.ModelStatus != "active" {
		return nil, nil, ErrModelDisabled
	}

	bindings, err := s.bindingRepo.ListByModelID(ctx, model.ID)
	if err != nil {
		return nil, nil, ErrInternal
	}
	if len(bindings) == 0 {
		return nil, nil, ErrNoProviderBound
	}

	var activeBindings []*entity.ModelProviderBinding
	for _, b := range bindings {
		if b.BindingStatus == "active" {
			activeBindings = append(activeBindings, b)
		}
	}
	if len(activeBindings) == 0 {
		return nil, nil, ErrNoProviderBound
	}

	// Pre-fetch all relevant providers
	type candidate struct {
		provider *entity.Provider
		binding  *entity.ModelProviderBinding
	}

	var candidates []candidate
	for _, binding := range activeBindings {
		p, err := s.providerRepo.GetByID(ctx, binding.ProviderID)
		if err == nil && p.IsEnabledFlag {
			candidates = append(candidates, candidate{provider: p, binding: binding})
		}
	}
	if len(candidates) == 0 {
		return nil, nil, ErrNoProviderAvailable
	}

	// Sort by priority (lower = higher priority), then by weight descending
	sort.SliceStable(candidates, func(i, j int) bool {
		if candidates[i].provider.Priority != candidates[j].provider.Priority {
			return candidates[i].provider.Priority < candidates[j].provider.Priority
		}
		return candidates[i].binding.Weight > candidates[j].binding.Weight
	})

	// Try each candidate in order
	var lastErr error
	for _, c := range candidates {
		apiPath := c.provider.APIPath
		if apiPath == "" {
			apiPath = "/v1/chat/completions"
		}
		t := &ProviderTarget{
			ProviderID:     c.provider.ID,
			ProviderName:   c.provider.ProviderName,
			BaseURL:        strings.TrimRight(c.provider.BaseURL, "/"),
			ProviderAPIKey: c.provider.APIKeyRef,
			APIPath:        apiPath,
			ModelID:        model.ID,
			ModelCode:      model.ModelCode,
		}

		providerResp, callErr := s.CallProvider(ctx, t, requestBody)
		if callErr == nil && providerResp.StatusCode < 500 {
			return providerResp, t, nil
		}

		if providerResp != nil {
			providerResp.Body.Close()
		}

		lastErr = callErr
		statusCode := 0
		if providerResp != nil {
			statusCode = providerResp.StatusCode
		}
		s.logger.Warn("provider call failed, trying next",
			"provider", c.provider.ProviderName,
			"statusCode", statusCode,
			"error", callErr,
		)
	}

	if lastErr != nil {
		return nil, nil, lastErr
	}
	return nil, nil, ErrNoProviderAvailable
}
