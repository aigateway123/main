package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type RequestLogRepository interface {
	Create(ctx context.Context, log *entity.RequestLog) error
	List(ctx context.Context, userID int64, offset, limit int) ([]*entity.RequestLog, int, error)
	CountByUserID(ctx context.Context, userID int64) (int, error)
	Stats(ctx context.Context, userID int64) (*UsageStats, error)
	Recent(ctx context.Context, userID int64, limit int) ([]*entity.RequestLog, error)
}

type UsageStats struct {
	TodayRequests  int     `json:"todayRequests"`
	TodayTokens    int     `json:"todayTokens"`
	TodayCost      float64 `json:"todayCost"`
	TotalRequests  int     `json:"totalRequests"`
	TotalTokens    int     `json:"totalTokens"`
	TotalCost      float64 `json:"totalCost"`
	AverageLatency float64 `json:"averageLatency"`
}

type InMemoryRequestLogRepository struct {
	mu      sync.RWMutex
	logs    []*entity.RequestLog
	nextID  int64
}

func NewInMemoryRequestLogRepository() *InMemoryRequestLogRepository {
	return &InMemoryRequestLogRepository{
		logs:   make([]*entity.RequestLog, 0),
		nextID: 1,
	}
}

func (r *InMemoryRequestLogRepository) Create(_ context.Context, log *entity.RequestLog) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	log.ID = r.nextID
	r.nextID++
	log.CreatedAt = time.Now()

	r.logs = append(r.logs, log)
	return nil
}

func (r *InMemoryRequestLogRepository) List(_ context.Context, userID int64, offset, limit int) ([]*entity.RequestLog, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var filtered []*entity.RequestLog
	for _, log := range r.logs {
		if log.UserID == userID {
			filtered = append(filtered, log)
		}
	}

	total := len(filtered)

	if offset >= total {
		return []*entity.RequestLog{}, total, nil
	}

	end := offset + limit
	if end > total {
		end = total
	}

	result := make([]*entity.RequestLog, end-offset)
	copy(result, filtered[offset:end])

	// Reverse to show newest first
	for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
		result[i], result[j] = result[j], result[i]
	}

	return result, total, nil
}

func (r *InMemoryRequestLogRepository) CountByUserID(_ context.Context, userID int64) (int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	count := 0
	for _, log := range r.logs {
		if log.UserID == userID {
			count++
		}
	}
	return count, nil
}

func (r *InMemoryRequestLogRepository) Stats(_ context.Context, userID int64) (*UsageStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	stats := &UsageStats{}
	today := time.Now().Truncate(24 * time.Hour)

	for _, log := range r.logs {
		if log.UserID != userID {
			continue
		}

		stats.TotalRequests++
		stats.TotalTokens += log.InputTokens + log.OutputTokens
		stats.TotalCost += log.CostAmount
		stats.AverageLatency += float64(log.LatencyMs)

		if log.CreatedAt.After(today) {
			stats.TodayRequests++
			stats.TodayTokens += log.InputTokens + log.OutputTokens
			stats.TodayCost += log.CostAmount
		}
	}

	if stats.TotalRequests > 0 {
		stats.AverageLatency /= float64(stats.TotalRequests)
	}

	return stats, nil
}

func (r *InMemoryRequestLogRepository) Recent(_ context.Context, userID int64, limit int) ([]*entity.RequestLog, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var filtered []*entity.RequestLog
	for _, log := range r.logs {
		if log.UserID == userID {
			filtered = append(filtered, log)
		}
	}

	// Reverse to newest first
	for i, j := 0, len(filtered)-1; i < j; i, j = i+1, j-1 {
		filtered[i], filtered[j] = filtered[j], filtered[i]
	}

	if len(filtered) > limit {
		filtered = filtered[:limit]
	}

	return filtered, nil
}
