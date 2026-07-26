package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"
)

// ReportRepository defines the interface for report data access.
type ReportRepository interface {
	// GetDailyStats returns aggregated stats for the given date range.
	GetDailyStats(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	// GetDailyStatsByUser returns stats grouped by user for the given date range.
	GetDailyStatsByUser(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	// GetDailyStatsByModel returns stats grouped by model for the given date range.
	GetDailyStatsByModel(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	// GetTodayRevenue returns today's real-time revenue and request count from request_logs.
	GetTodayRevenue(ctx context.Context) (revenue float64, requestCount int, err error)
	// RunDailyAggregation aggregates yesterday's data into billing_daily_stats (idempotent).
	RunDailyAggregation(ctx context.Context, statDate time.Time) error
	// GetUserDailyStats returns aggregated stats for a specific user over a date range.
	GetUserDailyStats(ctx context.Context, userID int64, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	// GetUserTodaySummary returns today's real-time summary for a specific user.
	GetUserTodaySummary(ctx context.Context, userID int64) (revenue float64, requestCount int, err error)
	// GetCurrentMonthRevenue returns current month's total revenue and request count.
	GetCurrentMonthRevenue(ctx context.Context) (revenue float64, requestCount int, err error)
	// GetCurrentMonthRevenueByUser returns current month's revenue and request count for a specific user.
	GetCurrentMonthRevenueByUser(ctx context.Context, userID int64) (revenue float64, requestCount int, err error)
}
