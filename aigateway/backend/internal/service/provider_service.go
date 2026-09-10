package service

import (
	"context"
	"errors"
	"log/slog"
	"strings"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type ProviderService struct {
	repo   repository.ProviderRepository
	logger *slog.Logger
}

func NewProviderService(repo repository.ProviderRepository, logger *slog.Logger) *ProviderService {
	return &ProviderService{repo: repo, logger: logger}
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
		p.AuthType = "api_key"
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
