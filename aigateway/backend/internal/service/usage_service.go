package service

import (
	"context"
	"log/slog"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type UsageService struct {
	logRepo    repository.RequestLogRepository
	keyRepo    repository.ApiKeyRepository
	providerRepo repository.ProviderRepository
	logger     *slog.Logger
}

func NewUsageService(
	logRepo repository.RequestLogRepository,
	keyRepo repository.ApiKeyRepository,
	providerRepo repository.ProviderRepository,
	logger *slog.Logger,
) *UsageService {
	return &UsageService{
		logRepo:    logRepo,
		keyRepo:    keyRepo,
		providerRepo: providerRepo,
		logger:     logger,
	}
}

func (s *UsageService) Dashboard(ctx context.Context, userID int64) (*dto.DashboardStatsResponse, error) {
	stats, err := s.logRepo.Stats(ctx, userID)
	if err != nil {
		return nil, ErrInternal
	}

	keys, err := s.keyRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, ErrInternal
	}

	activeKeys := 0
	for _, k := range keys {
		if k.KeyStatus == "active" {
			activeKeys++
		}
	}

	providers, err := s.providerRepo.List(ctx)
	if err != nil {
		return nil, ErrInternal
	}

	activeProviders := 0
	for _, p := range providers {
		if p.IsEnabledFlag {
			activeProviders++
		}
	}

	stats.TotalCost = float64(int(stats.TotalCost*100)) / 100

	return &dto.DashboardStatsResponse{
		TodayRequests:   stats.TodayRequests,
		TodayTokens:     stats.TodayTokens,
		TodayCost:       stats.TodayCost,
		TotalRequests:   stats.TotalRequests,
		TotalTokens:     stats.TotalTokens,
		TotalCost:       stats.TotalCost,
		AverageLatency:  float64(int(stats.AverageLatency*100)) / 100,
		ActiveApiKeys:   activeKeys,
		ActiveProviders: activeProviders,
	}, nil
}

func (s *UsageService) RecentLogs(ctx context.Context, userID int64, limit int) ([]*dto.RequestLogResponse, error) {
	logs, err := s.logRepo.Recent(ctx, userID, limit)
	if err != nil {
		return nil, ErrInternal
	}

	result := make([]*dto.RequestLogResponse, 0, len(logs))
	for _, l := range logs {
		result = append(result, toLogResponse(l))
	}
	return result, nil
}

func (s *UsageService) ListLogs(ctx context.Context, userID int64, page, pageSize int) ([]*dto.RequestLogResponse, int, error) {
	offset := (page - 1) * pageSize
	logs, total, err := s.logRepo.List(ctx, userID, offset, pageSize)
	if err != nil {
		return nil, 0, ErrInternal
	}

	result := make([]*dto.RequestLogResponse, 0, len(logs))
	for _, l := range logs {
		result = append(result, toLogResponse(l))
	}
	return result, total, nil
}

func (s *UsageService) RecordLog(ctx context.Context, log *entity.RequestLog) error {
	return s.logRepo.Create(ctx, log)
}

func toLogResponse(l *entity.RequestLog) *dto.RequestLogResponse {
	return &dto.RequestLogResponse{
		ID:            l.ID,
		ModelCode:     l.ModelCode,
		ProviderName:  l.ProviderName,
		InputTokens:   l.InputTokens,
		OutputTokens:  l.OutputTokens,
		LatencyMs:     l.LatencyMs,
		CostAmount:    float64(int(l.CostAmount*10000)) / 10000,
		RequestStatus: l.RequestStatus,
		CreatedAt:     l.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}
}
