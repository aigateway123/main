package service

import (
	"context"
	"errors"
	"log/slog"

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
		ProviderName:  req.ProviderName,
		BaseURL:       req.BaseURL,
		APIKeyRef:     req.APIKeyRef,
		APIPath:       req.APIPath,
		ProtocolType:  req.ProtocolType,
		AuthType:      req.AuthType,
		Priority:      req.Priority,
		Weight:        req.Weight,
		IsEnabledFlag: req.IsEnabledFlag,
	}

	if p.ProtocolType == "" {
		p.ProtocolType = "openai"
	}
	if p.AuthType == "" {
		p.AuthType = "api_key"
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
	// 读取现有记录，未传的协议/认证字段保留原值，防止部分更新覆盖 anthropic 配置
	existing, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrProviderNotFound
	}

	p := &entity.Provider{
		ID:            id,
		ProviderName:  req.ProviderName,
		BaseURL:       req.BaseURL,
		APIKeyRef:     req.APIKeyRef,
		APIPath:       req.APIPath,
		ProtocolType:  req.ProtocolType,
		AuthType:      req.AuthType,
		Priority:      req.Priority,
		Weight:        req.Weight,
		IsEnabledFlag: req.IsEnabledFlag,
	}

	if p.ProtocolType == "" {
		p.ProtocolType = existing.ProtocolType
	}
	if p.AuthType == "" {
		p.AuthType = existing.AuthType
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

func toProviderResponse(p *entity.Provider) *dto.ProviderResponse {
	return &dto.ProviderResponse{
		ID:            p.ID,
		ProviderName:  p.ProviderName,
		BaseURL:       p.BaseURL,
		APIKeyRef:     p.APIKeyRef,
		APIPath:       p.APIPath,
		ProtocolType:  p.ProtocolType,
		AuthType:      p.AuthType,
		Priority:      p.Priority,
		Weight:        p.Weight,
		IsEnabledFlag: p.IsEnabledFlag,
		CreatedAt:     p.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:     p.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
