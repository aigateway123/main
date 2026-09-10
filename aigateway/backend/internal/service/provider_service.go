package service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/provider"
	"aigateway/backend/internal/repository"
)

type ProviderService struct {
	repo       repository.ProviderRepository
	logger     *slog.Logger
	httpClient *http.Client
}

func NewProviderService(repo repository.ProviderRepository, logger *slog.Logger) *ProviderService {
	return &ProviderService{
		repo:       repo,
		logger:     logger,
		httpClient: &http.Client{Timeout: 6 * time.Second},
	}
}

func (s *ProviderService) Create(ctx context.Context, req *dto.CreateProviderRequest) (*dto.ProviderResponse, error) {
	p := &entity.Provider{
		ProviderName:       req.ProviderName,
		BaseURL:            req.BaseURL,
		APIKeyRef:          req.APIKeyRef,
		APIPath:            req.APIPath,
		ProtocolType:       req.ProtocolType,
		AuthType:           req.AuthType,
		AnthropicBaseURL:   req.AnthropicBaseURL,
		AnthropicAPIPath:   req.AnthropicAPIPath,
		AnthropicAPIKeyRef: req.AnthropicAPIKeyRef,
		AnthropicAuthType:  req.AnthropicAuthType,
		Priority:           req.Priority,
		Weight:             req.Weight,
		IsEnabledFlag:      req.IsEnabledFlag,
	}

	if err := normalizeProviderEndpoints(p); err != nil {
		return nil, err
	}

	if err := s.repo.Create(ctx, p); err != nil {
		if errors.Is(err, repository.ErrDuplicateName) {
			return nil, ErrDuplicateName
		}
		return nil, ErrInternal
	}

	return toProviderResponse(p), nil
}

func (s *ProviderService) GetByID(ctx context.Context, id int64) (*dto.ProviderResponse, error) {
	p, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrProviderNotFound
	}
	return toProviderResponse(p), nil
}

func (s *ProviderService) List(ctx context.Context) ([]*dto.ProviderResponse, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, ErrInternal
	}

	result := make([]*dto.ProviderResponse, 0, len(items))
	for _, p := range items {
		result = append(result, toProviderResponse(p))
	}
	return result, nil
}

func (s *ProviderService) Delete(ctx context.Context, id int64) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		if errors.Is(err, repository.ErrProviderNotFound) {
			return ErrProviderNotFound
		}
		return ErrInternal
	}
	return nil
}

func (s *ProviderService) Update(ctx context.Context, id int64, req *dto.UpdateProviderRequest) (*dto.ProviderResponse, error) {
	// 读取现有记录，确认存在（端点字段为整字段替换语义）
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return nil, ErrProviderNotFound
	}

	p := &entity.Provider{
		ID:                 id,
		ProviderName:       req.ProviderName,
		BaseURL:            req.BaseURL,
		APIKeyRef:          req.APIKeyRef,
		APIPath:            req.APIPath,
		ProtocolType:       req.ProtocolType,
		AuthType:           req.AuthType,
		AnthropicBaseURL:   req.AnthropicBaseURL,
		AnthropicAPIPath:   req.AnthropicAPIPath,
		AnthropicAPIKeyRef: req.AnthropicAPIKeyRef,
		AnthropicAuthType:  req.AnthropicAuthType,
		Priority:           req.Priority,
		Weight:             req.Weight,
		IsEnabledFlag:      req.IsEnabledFlag,
	}

	if err := normalizeProviderEndpoints(p); err != nil {
		return nil, err
	}

	if err := s.repo.Update(ctx, p); err != nil {
		if errors.Is(err, repository.ErrProviderNotFound) {
			return nil, ErrProviderNotFound
		}
		if errors.Is(err, repository.ErrDuplicateName) {
			return nil, ErrDuplicateName
		}
		return nil, ErrInternal
	}

	return toProviderResponse(p), nil
}

// TestEndpoint 对指定端点发起一次轻量探测（GET，无请求体，不消耗 token），
// 用于确认网络可达性与认证是否被接受；不落库。
// 判定规则：网络错误/超时 → reachable=false；HTTP 401/403 → reachable=true 且 authOK=false；
// 其他任意状态码 → reachable=true 且 authOK=true。
func (s *ProviderService) TestEndpoint(ctx context.Context, req *dto.TestEndpointRequest) (*dto.TestEndpointResponse, error) {
	baseURL := strings.TrimSpace(req.BaseURL)
	if baseURL == "" {
		return nil, &ValidationError{Message: "base url is required"}
	}
	if !strings.HasPrefix(baseURL, "http://") && !strings.HasPrefix(baseURL, "https://") {
		return nil, &ValidationError{Message: "base url must start with http:// or https://"}
	}

	isAnthropic := strings.EqualFold(strings.TrimSpace(req.Protocol), string(provider.ProtocolAnthropic))

	apiPath := strings.TrimSpace(req.APIPath)
	if apiPath == "" {
		if isAnthropic {
			apiPath = "/v1/messages"
		} else {
			apiPath = "/v1/chat/completions"
		}
	}

	authType := strings.TrimSpace(req.AuthType)
	if authType == "" {
		if isAnthropic {
			authType = "api_key"
		} else {
			authType = "bearer"
		}
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimRight(baseURL, "/")+apiPath, nil)
	if err != nil {
		return &dto.TestEndpointResponse{Reachable: false, AuthOK: false, Message: err.Error()}, nil
	}

	apiKey := strings.TrimSpace(req.APIKeyRef)
	if authType == "api_key" {
		httpReq.Header.Set("x-api-key", apiKey)
	} else {
		httpReq.Header.Set("Authorization", "Bearer "+apiKey)
	}
	if isAnthropic {
		for k, v := range provider.AnthropicHeaders() {
			httpReq.Header.Set(k, v)
		}
	}

	start := time.Now()
	resp, err := s.httpClient.Do(httpReq)
	latencyMs := time.Since(start).Milliseconds()
	if err != nil {
		return &dto.TestEndpointResponse{
			Reachable: false,
			AuthOK:    false,
			LatencyMs: latencyMs,
			Message:   err.Error(),
		}, nil
	}
	defer resp.Body.Close()
	_, _ = io.Copy(io.Discard, resp.Body)

	if resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusForbidden {
		return &dto.TestEndpointResponse{
			Reachable:  true,
			AuthOK:     false,
			StatusCode: resp.StatusCode,
			LatencyMs:  latencyMs,
			Message:    fmt.Sprintf("认证失败（HTTP %d），请检查 API Key 与认证方式", resp.StatusCode),
		}, nil
	}

	return &dto.TestEndpointResponse{
		Reachable:  true,
		AuthOK:     true,
		StatusCode: resp.StatusCode,
		LatencyMs:  latencyMs,
		Message:    fmt.Sprintf("端点可达（HTTP %d）", resp.StatusCode),
	}, nil
}

// normalizeProviderEndpoints 归一化双协议端点配置：
// base_url 系列列 = OpenAI 端点；anthropic_* = Anthropic 端点。
// protocol_type 仅作主协议标识，由端点是否存在自动推导，不再驱动路由。
func normalizeProviderEndpoints(p *entity.Provider) error {
	p.BaseURL = strings.TrimSpace(p.BaseURL)
	p.APIPath = strings.TrimSpace(p.APIPath)
	p.APIKeyRef = strings.TrimSpace(p.APIKeyRef)
	p.AnthropicBaseURL = strings.TrimSpace(p.AnthropicBaseURL)
	p.AnthropicAPIPath = strings.TrimSpace(p.AnthropicAPIPath)
	p.AnthropicAPIKeyRef = strings.TrimSpace(p.AnthropicAPIKeyRef)
	p.AnthropicAuthType = strings.TrimSpace(p.AnthropicAuthType)
	p.AuthType = strings.TrimSpace(p.AuthType)

	if p.BaseURL == "" && p.AnthropicBaseURL == "" {
		return &ValidationError{Message: "at least one protocol endpoint (OpenAI or Anthropic) is required"}
	}

	if p.BaseURL != "" && p.APIPath == "" {
		p.APIPath = "/v1/chat/completions"
	}
	if p.AnthropicBaseURL != "" {
		if p.AnthropicAPIPath == "" {
			p.AnthropicAPIPath = "/v1/messages"
		}
		if p.AnthropicAuthType == "" {
			p.AnthropicAuthType = "api_key"
		}
	}
	if p.AuthType == "" {
		if p.BaseURL != "" {
			p.AuthType = "bearer" // OpenAI 兼容端点默认 Bearer
		} else {
			p.AuthType = "api_key"
		}
	}

	if p.BaseURL != "" {
		p.ProtocolType = "openai"
	} else {
		p.ProtocolType = "anthropic"
	}
	return nil
}

func toProviderResponse(p *entity.Provider) *dto.ProviderResponse {
	return &dto.ProviderResponse{
		ID:                 p.ID,
		ProviderName:       p.ProviderName,
		BaseURL:            p.BaseURL,
		APIKeyRef:          p.APIKeyRef,
		APIPath:            p.APIPath,
		ProtocolType:       p.ProtocolType,
		AuthType:           p.AuthType,
		AnthropicBaseURL:   p.AnthropicBaseURL,
		AnthropicAPIPath:   p.AnthropicAPIPath,
		AnthropicAPIKeyRef: p.AnthropicAPIKeyRef,
		AnthropicAuthType:  p.AnthropicAuthType,
		Priority:           p.Priority,
		Weight:             p.Weight,
		IsEnabledFlag:      p.IsEnabledFlag,
		CreatedAt:          p.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:          p.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
