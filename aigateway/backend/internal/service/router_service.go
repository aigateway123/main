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
	"aigateway/backend/internal/provider"
	"aigateway/backend/internal/repository"
)

type ProviderTarget struct {
	ProviderID     int64
	ProviderName   string
	BaseURL        string
	ProviderAPIKey string
	APIPath        string
	ProtocolType   provider.ChatProtocol
	AuthType       string
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

// endpointForProtocol 返回 Provider 针对指定协议的原生端点配置；未配置该协议端点时 ok=false。
// base_url 系列列 = OpenAI 端点；anthropic_* 列 = Anthropic 端点。
func endpointForProtocol(p *entity.Provider, protocol provider.ChatProtocol) (baseURL, apiPath, apiKey, authType string, ok bool) {
	switch protocol {
	case provider.ProtocolAnthropic:
		if strings.TrimSpace(p.AnthropicBaseURL) == "" {
			return "", "", "", "", false
		}
		authType = p.AnthropicAuthType
		if authType == "" {
			authType = "api_key"
		}
		apiPath = p.AnthropicAPIPath
		if apiPath == "" {
			apiPath = "/v1/messages"
		}
		return strings.TrimRight(p.AnthropicBaseURL, "/"), apiPath, p.AnthropicAPIKeyRef, authType, true
	default: // openai
		if strings.TrimSpace(p.BaseURL) == "" {
			return "", "", "", "", false
		}
		apiPath = p.APIPath
		if apiPath == "" {
			apiPath = "/v1/chat/completions"
		}
		return strings.TrimRight(p.BaseURL, "/"), apiPath, p.APIKeyRef, "bearer", true
	}
}

// SelectProvider 按入站协议选择首个可用的 Provider 原生端点。
func (s *RouterService) SelectProvider(ctx context.Context, modelCode string, protocol provider.ChatProtocol) (*ProviderTarget, error) {
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

	enabledCount := 0
	for _, binding := range activeBindings {
		p, exists := providerCache[binding.ProviderID]
		if !exists || !p.IsEnabledFlag {
			continue
		}
		enabledCount++
		baseURL, apiPath, apiKey, authType, ok := endpointForProtocol(p, protocol)
		if !ok {
			continue
		}
		if binding.APIPathOverride != nil && *binding.APIPathOverride != "" {
			apiPath = *binding.APIPathOverride
		}
		return &ProviderTarget{
			ProviderID:     p.ID,
			ProviderName:   p.ProviderName,
			BaseURL:        baseURL,
			ProviderAPIKey: apiKey,
			APIPath:        apiPath,
			ProtocolType:   protocol,
			AuthType:       authType,
			ModelID:        model.ID,
			ModelCode:      model.ModelCode,
		}, nil
	}

	if enabledCount == 0 {
		return nil, ErrNoProviderAvailable
	}
	return nil, ErrNoProviderForProtocol
}

func (s *RouterService) CallProvider(ctx context.Context, target *ProviderTarget, requestBody []byte) (*http.Response, error) {
	chatURL := target.BaseURL + target.APIPath

	req, err := http.NewRequestWithContext(ctx, "POST", chatURL, bytes.NewReader(requestBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	switch target.ProtocolType {
	case provider.ProtocolAnthropic:
		if target.AuthType == "bearer" {
			req.Header.Set("Authorization", "Bearer "+target.ProviderAPIKey)
		} else {
			req.Header.Set("x-api-key", target.ProviderAPIKey)
		}
		for k, v := range provider.AnthropicHeaders() {
			req.Header.Set(k, v)
		}
	default:
		req.Header.Set("Authorization", "Bearer "+target.ProviderAPIKey)
	}

	return s.httpClient.Do(req)
}

// CallWithFallback 按入站协议选择 Provider 的原生端点并调用，失败自动切换下一个可用 Provider。
// 请求体按入站协议原样透传（原生直连，不做跨协议转换）；无任何 Provider 配置该协议端点时返回
// ErrNoProviderForProtocol。
func (s *RouterService) CallWithFallback(ctx context.Context, modelCode string, requestBody []byte, inbound provider.ChatProtocol) (resp *http.Response, target *ProviderTarget, err error) {
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

	var activeBindings []*entity.ModelProviderBinding
	for _, b := range bindings {
		if b.BindingStatus == "active" {
			activeBindings = append(activeBindings, b)
		}
	}
	if len(activeBindings) == 0 {
		return nil, nil, ErrNoProviderBound
	}

	// Pre-fetch all relevant providers and keep only those natively supporting inbound protocol
	type candidate struct {
		provider *entity.Provider
		binding  *entity.ModelProviderBinding
	}

	var candidates []candidate
	enabledCount := 0
	for _, binding := range activeBindings {
		p, err := s.providerRepo.GetByID(ctx, binding.ProviderID)
		if err != nil || !p.IsEnabledFlag {
			continue
		}
		enabledCount++
		if _, _, _, _, ok := endpointForProtocol(p, inbound); ok {
			candidates = append(candidates, candidate{provider: p, binding: binding})
		}
	}
	if len(candidates) == 0 {
		if enabledCount == 0 {
			return nil, nil, ErrNoProviderAvailable
		}
		return nil, nil, ErrNoProviderForProtocol
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
		baseURL, apiPath, apiKey, authType, _ := endpointForProtocol(c.provider, inbound)
		// api_path_override 语义为 OpenAI 路径覆盖；Anthropic 端点固定使用 anthropic_api_path
		if inbound != provider.ProtocolAnthropic && c.binding.APIPathOverride != nil && *c.binding.APIPathOverride != "" {
			apiPath = *c.binding.APIPathOverride
		}
		t := &ProviderTarget{
			ProviderID:     c.provider.ID,
			ProviderName:   c.provider.ProviderName,
			BaseURL:        baseURL,
			ProviderAPIKey: apiKey,
			APIPath:        apiPath,
			ProtocolType:   inbound,
			AuthType:       authType,
			ModelID:        model.ID,
			ModelCode:      model.ModelCode,
		}

		// 原生直连：请求体按入站协议原样透传，不做跨协议转换
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
