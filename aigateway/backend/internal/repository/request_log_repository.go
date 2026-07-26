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
	ListByUserIDFiltered(ctx context.Context, userID int64, offset, limit int, startDate, endDate, modelCode string) ([]*entity.RequestLog, int, error)
	AdminStats(ctx context.Context) (*AdminUsageStats, error)
	AdminList(ctx context.Context, offset, limit int, filterUserID int64, startDate, endDate, status string) ([]*entity.RequestLog, int, error)
}

type AdminUsageStats struct {
	TotalUsers    int     `json:"totalUsers"`
	ActiveUsers   int     `json:"activeUsers"`
	TotalRequests int     `json:"totalRequests"`
	TodayRequests int     `json:"todayRequests"`
	TodayCost     float64 `json:"todayCost"`
	TotalCost     float64 `json:"totalCost"`
	TotalTokens   int     `json:"totalTokens"`
	TodayTokens   int     `json:"todayTokens"`
	CostByModel   []CostByModelItem `json:"costByModel"`
}

type CostByModelItem struct {
	ModelCode     string  `json:"modelCode"`
	TotalCost     float64 `json:"totalCost"`
	TotalRequests int     `json:"totalRequests"`
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

// Logs returns a copy of all logs for use by other in-memory repositories.
func (r *InMemoryRequestLogRepository) Logs() []*entity.RequestLog {
	r.mu.RLock()
	defer r.mu.RUnlock()
	result := make([]*entity.RequestLog, len(r.logs))
	copy(result, r.logs)
	return result
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

func (r *InMemoryRequestLogRepository) ListByUserIDFiltered(_ context.Context, userID int64, offset, limit int, startDate, endDate, modelCode string) ([]*entity.RequestLog, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var filtered []*entity.RequestLog
	for _, log := range r.logs {
		if log.UserID != userID {
			continue
		}
		if modelCode != "" && log.ModelCode != modelCode {
			continue
		}
		if startDate != "" {
			t, err := time.Parse("2006-01-02", startDate[:10])
			if err == nil && log.CreatedAt.Before(t) {
				continue
			}
		}
		if endDate != "" {
			t, err := time.Parse("2006-01-02", endDate[:10])
			if err == nil && log.CreatedAt.After(t.Add(24*time.Hour)) {
				continue
			}
		}
		filtered = append(filtered, log)
	}

	total := len(filtered)
	// Reverse to newest first
	for i, j := 0, len(filtered)-1; i < j; i, j = i+1, j-1 {
		filtered[i], filtered[j] = filtered[j], filtered[i]
	}

	if offset >= total {
		return []*entity.RequestLog{}, total, nil
	}
	end := offset + limit
	if end > total {
		end = total
	}
	result := make([]*entity.RequestLog, end-offset)
	copy(result, filtered[offset:end])
	return result, total, nil
}

func (r *InMemoryRequestLogRepository) AdminStats(_ context.Context) (*AdminUsageStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	stats := &AdminUsageStats{}
	today := time.Now().Truncate(24 * time.Hour)
	users := make(map[int64]struct{})
	activeUsers := make(map[int64]struct{})
	costByModel := make(map[string]*CostByModelItem)

	for _, log := range r.logs {
		users[log.UserID] = struct{}{}
		if log.CreatedAt.After(today) {
			activeUsers[log.UserID] = struct{}{}
			stats.TodayRequests++
			stats.TodayTokens += log.InputTokens + log.OutputTokens
			stats.TodayCost += log.CostAmount
		}
		stats.TotalRequests++
		stats.TotalTokens += log.InputTokens + log.OutputTokens
		stats.TotalCost += log.CostAmount

		if item, ok := costByModel[log.ModelCode]; ok {
			item.TotalCost += log.CostAmount
			item.TotalRequests++
		} else {
			costByModel[log.ModelCode] = &CostByModelItem{
				ModelCode:     log.ModelCode,
				TotalCost:     log.CostAmount,
				TotalRequests: 1,
			}
		}
	}

	stats.TotalUsers = len(users)
	stats.ActiveUsers = len(activeUsers)
	stats.CostByModel = make([]CostByModelItem, 0, len(costByModel))
	for _, item := range costByModel {
		stats.CostByModel = append(stats.CostByModel, *item)
	}

	return stats, nil
}

func (r *InMemoryRequestLogRepository) AdminList(_ context.Context, offset, limit int, filterUserID int64, startDate, endDate, status string) ([]*entity.RequestLog, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var filtered []*entity.RequestLog
	for _, log := range r.logs {
		if filterUserID > 0 && log.UserID != filterUserID {
			continue
		}
		if status != "" && log.RequestStatus != status {
			continue
		}
		if startDate != "" {
			t, err := time.Parse("2006-01-02", startDate[:10])
			if err == nil && log.CreatedAt.Before(t) {
				continue
			}
		}
		if endDate != "" {
			t, err := time.Parse("2006-01-02", endDate[:10])
			if err == nil && log.CreatedAt.After(t.Add(24*time.Hour)) {
				continue
			}
		}
		filtered = append(filtered, log)
	}

	total := len(filtered)
	for i, j := 0, len(filtered)-1; i < j; i, j = i+1, j-1 {
		filtered[i], filtered[j] = filtered[j], filtered[i]
	}

	if offset >= total {
		return []*entity.RequestLog{}, total, nil
	}
	end := offset + limit
	if end > total {
		end = total
	}
	result := make([]*entity.RequestLog, end-offset)
	copy(result, filtered[offset:end])
	return result, total, nil
}
