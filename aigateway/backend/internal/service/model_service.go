package service

import (
	"context"
	"errors"
	"log/slog"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type ModelService struct {
	modelRepo   repository.ModelRepository
	bindingRepo repository.ModelBindingRepository
	providerRepo repository.ProviderRepository
	logger      *slog.Logger
}

func NewModelService(
	modelRepo repository.ModelRepository,
	bindingRepo repository.ModelBindingRepository,
	providerRepo repository.ProviderRepository,
	logger *slog.Logger,
) *ModelService {
	return &ModelService{
		modelRepo:   modelRepo,
		bindingRepo: bindingRepo,
		providerRepo: providerRepo,
		logger:      logger,
	}
}

func (s *ModelService) Create(ctx context.Context, req *dto.CreateModelRequest) (*dto.ModelResponse, error) {
	m := &entity.Model{
		ModelName:   req.ModelName,
		ModelCode:   req.ModelCode,
		ModelStatus: "active",
	}

	if err := s.modelRepo.Create(ctx, m); err != nil {
		if errors.Is(err, repository.ErrDuplicateModelCode) {
			return nil, ErrDuplicateModelCode
		}
		return nil, ErrInternal
	}

	return toModelResponse(m), nil
}

func (s *ModelService) GetByID(ctx context.Context, id int64) (*dto.ModelDetailResponse, error) {
	m, err := s.modelRepo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrModelNotFound
	}

	bindings, err := s.bindingRepo.ListByModelID(ctx, id)
	if err != nil {
		return nil, ErrInternal
	}

	var providers []*dto.ProviderResponse
	for _, b := range bindings {
		p, err := s.providerRepo.GetByID(ctx, b.ProviderID)
		if err != nil {
			continue
		}
		providers = append(providers, toProviderResponse(p))
	}

	return &dto.ModelDetailResponse{
		Model:     *toModelResponse(m),
		Providers: providers,
	}, nil
}

func (s *ModelService) List(ctx context.Context) ([]*dto.ModelResponse, error) {
	items, err := s.modelRepo.List(ctx)
	if err != nil {
		return nil, ErrInternal
	}

	result := make([]*dto.ModelResponse, 0, len(items))
	for _, m := range items {
		result = append(result, toModelResponse(m))
	}
	return result, nil
}

func (s *ModelService) Delete(ctx context.Context, id int64) error {
	if err := s.modelRepo.Delete(ctx, id); err != nil {
		if errors.Is(err, repository.ErrModelNotFound) {
			return ErrModelNotFound
		}
		return ErrInternal
	}
	return nil
}

func (s *ModelService) Update(ctx context.Context, id int64, req *dto.UpdateModelRequest) (*dto.ModelResponse, error) {
	m := &entity.Model{
		ID:          id,
		ModelName:   req.ModelName,
		ModelCode:   req.ModelCode,
		ModelStatus: req.ModelStatus,
	}

	if err := s.modelRepo.Update(ctx, m); err != nil {
		if errors.Is(err, repository.ErrModelNotFound) {
			return nil, ErrModelNotFound
		}
		if errors.Is(err, repository.ErrDuplicateModelCode) {
			return nil, ErrDuplicateModelCode
		}
		return nil, ErrInternal
	}

	return toModelResponse(m), nil
}

func (s *ModelService) BindProvider(ctx context.Context, modelID int64, req *dto.BindProviderRequest) error {
	// Verify resources exist
	if _, err := s.modelRepo.GetByID(ctx, modelID); err != nil {
		return ErrModelNotFound
	}
	if _, err := s.providerRepo.GetByID(ctx, req.ProviderID); err != nil {
		return ErrProviderNotFound
	}

	binding := &entity.ModelProviderBinding{
		ModelID:       modelID,
		ProviderID:    req.ProviderID,
		Weight:        req.Weight,
		BindingStatus: "active",
	}

	return s.bindingRepo.Create(ctx, binding)
}

func (s *ModelService) UnbindProvider(ctx context.Context, bindingID int64) error {
	return s.bindingRepo.DeleteByID(ctx, bindingID)
}

func toModelResponse(m *entity.Model) *dto.ModelResponse {
	return &dto.ModelResponse{
		ID:          m.ID,
		ModelName:   m.ModelName,
		ModelCode:   m.ModelCode,
		ModelStatus: m.ModelStatus,
		CreatedAt:   m.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:   m.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}
}
