package service

import (
	"bytes"
	"context"
	"encoding/csv"
	"fmt"
	"log/slog"
	"sort"
	"time"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/repository"
)

// ReportService handles business logic for billing reports.
type ReportService struct {
	reportRepo repository.ReportRepository
	modelRepo  repository.ModelRepository
	userRepo   repository.UserRepository
	logRepo    repository.RequestLogRepository
	logger     *slog.Logger
}

func NewReportService(
	reportRepo repository.ReportRepository,
	modelRepo repository.ModelRepository,
	userRepo repository.UserRepository,
	logRepo repository.RequestLogRepository,
	logger *slog.Logger,
) *ReportService {
	return &ReportService{
		reportRepo: reportRepo,
		modelRepo:  modelRepo,
		userRepo:   userRepo,
		logRepo:    logRepo,
		logger:     logger,
	}
}

// GetSummary returns the admin report summary (today + current month).
func (s *ReportService) GetSummary(ctx context.Context, startDate, endDate time.Time) (*dto.ReportSummary, error) {
	// Today's real-time data.
	todayRevenue, todayCount, err := s.reportRepo.GetTodayRevenue(ctx)
	if err != nil {
		return nil, fmt.Errorf("get today revenue: %w", err)
	}

	// Current month data from aggregation table.
	monthRevenue, monthCount, err := s.reportRepo.GetCurrentMonthRevenue(ctx)
	if err != nil {
		return nil, fmt.Errorf("get month revenue: %w", err)
	}

	summary := &dto.ReportSummary{}
	summary.Today.Revenue = todayRevenue
	summary.Today.RequestCount = todayCount
	summary.CurrentMonth.Revenue = monthRevenue
	summary.CurrentMonth.RequestCount = monthCount

	return summary, nil
}

// GetRevenueTrend returns daily revenue data points within the date range.
func (s *ReportService) GetRevenueTrend(ctx context.Context, startDate, endDate time.Time) ([]*dto.DailyTrendPoint, error) {
	stats, err := s.reportRepo.GetDailyStats(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("get daily stats: %w", err)
	}

	// Aggregate by date.
	dateMap := make(map[string]float64)
	for _, st := range stats {
		dateKey := st.StatDate.Format("2006-01-02")
		dateMap[dateKey] += st.TotalRevenue
	}

	// Fill all dates in range.
	var result []*dto.DailyTrendPoint
	for d := startDate; !d.After(endDate); d = d.Add(24 * time.Hour) {
		dateKey := d.Format("2006-01-02")
		revenue := dateMap[dateKey]
		result = append(result, &dto.DailyTrendPoint{
			Date:    dateKey,
			Revenue: revenue,
		})
	}
	return result, nil
}

// GetByModel returns model-level aggregated stats within the date range.
func (s *ReportService) GetByModel(ctx context.Context, startDate, endDate time.Time) ([]*dto.ModelStats, error) {
	stats, err := s.reportRepo.GetDailyStatsByModel(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("get daily stats by model: %w", err)
	}

	// Aggregate by model.
	modelMap := make(map[int64]*dto.ModelStats)
	for _, st := range stats {
		ms, ok := modelMap[st.ModelID]
		if !ok {
			ms = &dto.ModelStats{ModelID: st.ModelID}
			modelMap[st.ModelID] = ms
		}
		ms.RequestCount += st.RequestCount
		ms.InputTokens += st.InputTokens
		ms.OutputTokens += st.OutputTokens
		ms.Revenue += st.TotalRevenue
	}

	// Enrich with model names.
	models, err := s.modelRepo.List(ctx)
	if err != nil {
		return nil, fmt.Errorf("list models: %w", err)
	}
	modelNameByID := make(map[int64]string)
	for _, m := range models {
		modelNameByID[m.ID] = m.ModelName
	}
	for _, ms := range modelMap {
		if name, ok := modelNameByID[ms.ModelID]; ok {
			ms.ModelName = name
		}
	}

	// Sort by revenue descending.
	result := make([]*dto.ModelStats, 0, len(modelMap))
	for _, ms := range modelMap {
		result = append(result, ms)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].Revenue > result[j].Revenue
	})
	return result, nil
}

// GetByUser returns user-level aggregated stats within the date range.
func (s *ReportService) GetByUser(ctx context.Context, startDate, endDate time.Time) ([]*dto.UserStats, error) {
	stats, err := s.reportRepo.GetDailyStatsByUser(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("get daily stats by user: %w", err)
	}

	// Aggregate by user.
	userMap := make(map[int64]*dto.UserStats)
	for _, st := range stats {
		us, ok := userMap[st.UserID]
		if !ok {
			us = &dto.UserStats{UserID: st.UserID}
			userMap[st.UserID] = us
		}
		us.RequestCount += st.RequestCount
		us.Revenue += st.TotalRevenue
	}

	// Sort by revenue descending.
	result := make([]*dto.UserStats, 0, len(userMap))
	for _, us := range userMap {
		// Try to get user email.
		if s.userRepo != nil {
			u, err := s.userRepo.GetByID(ctx, us.UserID)
			if err == nil && u != nil {
				us.Email = u.Email
			}
		}
		result = append(result, us)
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].Revenue > result[j].Revenue
	})
	return result, nil
}

// ExportCSV generates CSV data for the given date range.
func (s *ReportService) ExportCSV(ctx context.Context, startDate, endDate time.Time) ([]byte, error) {
	stats, err := s.reportRepo.GetDailyStats(ctx, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("get daily stats: %w", err)
	}

	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)

	// Header.
	if err := writer.Write([]string{"Date", "UserID", "ModelID", "RequestCount", "InputTokens", "OutputTokens", "TotalRevenue"}); err != nil {
		return nil, fmt.Errorf("write csv header: %w", err)
	}

	for _, st := range stats {
		record := []string{
			st.StatDate.Format("2006-01-02"),
			fmt.Sprintf("%d", st.UserID),
			fmt.Sprintf("%d", st.ModelID),
			fmt.Sprintf("%d", st.RequestCount),
			fmt.Sprintf("%d", st.InputTokens),
			fmt.Sprintf("%d", st.OutputTokens),
			fmt.Sprintf("%.6f", st.TotalRevenue),
		}
		if err := writer.Write(record); err != nil {
			return nil, fmt.Errorf("write csv record: %w", err)
		}
	}

	writer.Flush()
	if err := writer.Error(); err != nil {
		return nil, fmt.Errorf("csv writer flush: %w", err)
	}

	return buf.Bytes(), nil
}

// GetUserUsageSummary returns the personal usage summary for a student.
func (s *ReportService) GetUserUsageSummary(ctx context.Context, userID int64) (*dto.UserUsageSummary, error) {
	// Today's real-time data.
	todayRevenue, _, err := s.reportRepo.GetUserTodaySummary(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user today summary: %w", err)
	}

	// Current month aggregated data.
	monthRevenue, _, err := s.reportRepo.GetCurrentMonthRevenueByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("get user month revenue: %w", err)
	}

	summary := &dto.UserUsageSummary{
		TodayRevenue: todayRevenue,
		MonthRevenue: monthRevenue,
	}

	// Total revenue: sum of all user's billing_daily_stats.
	stats, err := s.reportRepo.GetUserDailyStats(ctx, userID, time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC), time.Now())
	if err == nil {
		for _, st := range stats {
			summary.TotalRevenue += st.TotalRevenue
		}
	}
	// Add today's data (not in aggregation yet).
	summary.TotalRevenue += todayRevenue

	return summary, nil
}

// GetUserUsageTrend returns daily usage trend data for a specific user.
func (s *ReportService) GetUserUsageTrend(ctx context.Context, userID int64, days int) ([]*dto.DailyTrendPoint, error) {
	endDate := time.Now().Truncate(24 * time.Hour)
	startDate := endDate.AddDate(0, 0, -days+1)

	stats, err := s.reportRepo.GetUserDailyStats(ctx, userID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("get user daily stats: %w", err)
	}

	dateMap := make(map[string]float64)
	for _, st := range stats {
		dateKey := st.StatDate.Format("2006-01-02")
		dateMap[dateKey] += st.TotalRevenue
	}

	var result []*dto.DailyTrendPoint
	for d := startDate; !d.After(endDate); d = d.Add(24 * time.Hour) {
		dateKey := d.Format("2006-01-02")
		result = append(result, &dto.DailyTrendPoint{
			Date:    dateKey,
			Revenue: dateMap[dateKey],
		})
	}
	return result, nil
}

// GetUserUsageDetail returns paginated usage detail for a specific user.
func (s *ReportService) GetUserUsageDetail(ctx context.Context, userID int64, page, pageSize int) ([]*dto.UsageDetailItem, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	logs, total, err := s.logRepo.ListByUserIDFiltered(ctx, userID, offset, pageSize, "", "", "")
	if err != nil {
		return nil, 0, fmt.Errorf("list user logs: %w", err)
	}

	items := make([]*dto.UsageDetailItem, 0, len(logs))
	for _, l := range logs {
		items = append(items, &dto.UsageDetailItem{
			Timestamp:    l.CreatedAt.Format("2006-01-02T15:04:05Z"),
			ModelName:    l.ModelCode,
			InputTokens:  l.InputTokens,
			OutputTokens: l.OutputTokens,
			Cost:         l.CostAmount,
		})
	}
	return items, int64(total), nil
}

// parseDateRange parses startDate and endDate query params with defaults.
func ParseDateRange(startDate, endDate string) (time.Time, time.Time, error) {
	now := time.Now()
	var start, end time.Time
	var err error

	if startDate != "" {
		start, err = time.Parse("2006-01-02", startDate)
		if err != nil {
			return start, end, fmt.Errorf("invalid startDate: %w", err)
		}
	} else {
		// Default to first day of current month.
		start = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	}

	if endDate != "" {
		end, err = time.Parse("2006-01-02", endDate)
		if err != nil {
			return start, end, fmt.Errorf("invalid endDate: %w", err)
		}
	} else {
		end = now
	}

	if start.After(end) {
		return start, end, fmt.Errorf("startDate cannot be after endDate")
	}

	return start, end, nil
}


