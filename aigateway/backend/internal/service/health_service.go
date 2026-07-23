package service

import (
	"context"

	appErrors "aigateway/backend/internal/errors"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type HealthService struct {
	repo repository.HealthRepository
}

func NewHealthService(repo repository.HealthRepository) *HealthService {
	return &HealthService{repo: repo}
}

func (s *HealthService) Check(ctx context.Context) (entity.ServiceHealth, error) {
	health, err := s.repo.Check(ctx)
	if err != nil {
		return entity.ServiceHealth{}, appErrors.New("GATEWAY001", "health check failed", err)
	}

	return health, nil
}
