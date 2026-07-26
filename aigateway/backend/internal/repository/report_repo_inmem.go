package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

// InMemoryReportRepository implements ReportRepository with in-memory storage.
type InMemoryReportRepository struct {
	mu       sync.RWMutex
	stats    []*entity.BillingDailyStats
	logRepo  *InMemoryRequestLogRepository
	userRepo *InMemoryUserRepository
	nextID   int64
}

func NewInMemoryReportRepository(logRepo *InMemoryRequestLogRepository, userRepo *InMemoryUserRepository) *InMemoryReportRepository {
	return &InMemoryReportRepository{
		stats:    make([]*entity.BillingDailyStats, 0),
		logRepo:  logRepo,
		userRepo: userRepo,
		nextID:   1,
	}
}

func (r *InMemoryReportRepository) GetDailyStats(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.BillingDailyStats
	for _, s := range r.stats {
		if (s.StatDate.Equal(startDate) || s.StatDate.After(startDate)) &&
			(s.StatDate.Equal(endDate) || s.StatDate.Before(endDate)) {
			result = append(result, s)
		}
	}
	return result, nil
}

func (r *InMemoryReportRepository) GetDailyStatsByUser(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.BillingDailyStats
	for _, s := range r.stats {
		if (s.StatDate.Equal(startDate) || s.StatDate.After(startDate)) &&
			(s.StatDate.Equal(endDate) || s.StatDate.Before(endDate)) {
			result = append(result, s)
		}
	}
	// Sort by user_id, then date
	for i := 0; i < len(result); i++ {
		for j := i + 1; j < len(result); j++ {
			if result[i].UserID > result[j].UserID ||
				(result[i].UserID == result[j].UserID && result[i].StatDate.After(result[j].StatDate)) {
				result[i], result[j] = result[j], result[i]
			}
		}
	}
	return result, nil
}

func (r *InMemoryReportRepository) GetDailyStatsByModel(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.BillingDailyStats
	for _, s := range r.stats {
		if (s.StatDate.Equal(startDate) || s.StatDate.After(startDate)) &&
			(s.StatDate.Equal(endDate) || s.StatDate.Before(endDate)) {
			result = append(result, s)
		}
	}
	// Sort by model_id, then date
	for i := 0; i < len(result); i++ {
		for j := i + 1; j < len(result); j++ {
			if result[i].ModelID > result[j].ModelID ||
				(result[i].ModelID == result[j].ModelID && result[i].StatDate.After(result[j].StatDate)) {
				result[i], result[j] = result[j], result[i]
			}
		}
	}
	return result, nil
}

func (r *InMemoryReportRepository) GetTodayRevenue(ctx context.Context) (float64, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var revenue float64
	var count int
	today := time.Now().Truncate(24 * time.Hour)

	logs := r.logRepo.Logs()
	for _, log := range logs {
		if log.CreatedAt.After(today) {
			revenue += log.CostAmount
			count++
		}
	}
	return revenue, count, nil
}

func (r *InMemoryReportRepository) GetCurrentMonthRevenue(ctx context.Context) (float64, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var revenue float64
	var count int
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	for _, s := range r.stats {
		if (s.StatDate.Equal(firstOfMonth) || s.StatDate.After(firstOfMonth)) && s.StatDate.Before(now) {
			revenue += s.TotalRevenue
			count += s.RequestCount
		}
	}
	return revenue, count, nil
}

func (r *InMemoryReportRepository) RunDailyAggregation(ctx context.Context, statDate time.Time) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	dateStr := statDate.Format("2006-01-02")

	// Remove existing
	var remaining []*entity.BillingDailyStats
	for _, s := range r.stats {
		if s.StatDate.Format("2006-01-02") != dateStr {
			remaining = append(remaining, s)
		}
	}
	r.stats = remaining

	// Aggregate from requestLogs
	agg := make(map[string]*entity.BillingDailyStats) // key: "userID:modelID"
	logs := r.logRepo.Logs()
	for _, log := range logs {
		if log.CreatedAt.Format("2006-01-02") != dateStr {
			continue
		}
		key := formatKey(log.UserID, log.ModelID)
		if existing, ok := agg[key]; ok {
			existing.RequestCount++
			existing.InputTokens += int64(log.InputTokens)
			existing.OutputTokens += int64(log.OutputTokens)
			existing.TotalRevenue += log.CostAmount
		} else {
			agg[key] = &entity.BillingDailyStats{
				ID:           r.nextID,
				StatDate:     statDate,
				UserID:       log.UserID,
				ModelID:      log.ModelID,
				RequestCount: 1,
				InputTokens:  int64(log.InputTokens),
				OutputTokens: int64(log.OutputTokens),
				TotalRevenue: log.CostAmount,
				CreatedAt:    time.Now(),
				UpdatedAt:    time.Now(),
			}
			r.nextID++
		}
	}

	for _, s := range agg {
		r.stats = append(r.stats, s)
	}
	return nil
}

func formatKey(userID, modelID int64) string {
	return formatInt64(userID) + ":" + formatInt64(modelID)
}

func formatInt64(v int64) string {
	if v == 0 {
		return "0"
	}
	digits := make([]byte, 0, 20)
	negative := v < 0
	if negative {
		v = -v
	}
	for v > 0 {
		digits = append(digits, byte('0'+v%10))
		v /= 10
	}
	if negative {
		digits = append(digits, '-')
	}
	// Reverse
	for i, j := 0, len(digits)-1; i < j; i, j = i+1, j-1 {
		digits[i], digits[j] = digits[j], digits[i]
	}
	return string(digits)
}

func (r *InMemoryReportRepository) GetUserDailyStats(ctx context.Context, userID int64, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.BillingDailyStats
	for _, s := range r.stats {
		if s.UserID == userID &&
			(s.StatDate.Equal(startDate) || s.StatDate.After(startDate)) &&
			(s.StatDate.Equal(endDate) || s.StatDate.Before(endDate)) {
			result = append(result, s)
		}
	}
	return result, nil
}

func (r *InMemoryReportRepository) GetUserTodaySummary(ctx context.Context, userID int64) (float64, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var revenue float64
	var count int
	today := time.Now().Truncate(24 * time.Hour)

	for _, log := range r.logRepo.Logs() {
		if log.UserID == userID && log.CreatedAt.After(today) {
			revenue += log.CostAmount
			count++
		}
	}
	return revenue, count, nil
}

func (r *InMemoryReportRepository) GetCurrentMonthRevenueByUser(ctx context.Context, userID int64) (float64, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var revenue float64
	var count int
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	for _, s := range r.stats {
		if s.UserID == userID &&
			(s.StatDate.Equal(firstOfMonth) || s.StatDate.After(firstOfMonth)) &&
			s.StatDate.Before(now) {
			revenue += s.TotalRevenue
			count += s.RequestCount
		}
	}
	return revenue, count, nil
}
