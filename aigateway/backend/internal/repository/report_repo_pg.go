package repository

import (
	"context"
	"fmt"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostgresReportRepository implements ReportRepository with PostgreSQL.
type PostgresReportRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresReportRepository(pool *pgxpool.Pool) *PostgresReportRepository {
	return &PostgresReportRepository{pool: pool}
}

// scanDailyStats scans a single BillingDailyStats row.
func (r *PostgresReportRepository) scanDailyStats(row pgx.Row) (*entity.BillingDailyStats, error) {
	var s entity.BillingDailyStats
	err := row.Scan(
		&s.ID, &s.StatDate, &s.UserID, &s.ModelID,
		&s.RequestCount, &s.InputTokens, &s.OutputTokens,
		&s.TotalRevenue, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &s, nil
}

// scanDailyStatsRows scans multiple BillingDailyStats rows.
func (r *PostgresReportRepository) scanDailyStatsRows(rows pgx.Rows) ([]*entity.BillingDailyStats, error) {
	defer rows.Close()

	var result []*entity.BillingDailyStats
	for rows.Next() {
		var s entity.BillingDailyStats
		err := rows.Scan(
			&s.ID, &s.StatDate, &s.UserID, &s.ModelID,
			&s.RequestCount, &s.InputTokens, &s.OutputTokens,
			&s.TotalRevenue, &s.CreatedAt, &s.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, &s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

const dailyStatsColumns = "id, stat_date, user_id, model_id, request_count, input_tokens, output_tokens, total_revenue, created_at, updated_at"

// GetDailyStats returns all aggregated stats within the date range.
func (r *PostgresReportRepository) GetDailyStats(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	query := fmt.Sprintf(`SELECT %s FROM billing_daily_stats
		WHERE stat_date >= $1 AND stat_date <= $2
		ORDER BY stat_date ASC`, dailyStatsColumns)

	rows, err := r.pool.Query(ctx, query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	return r.scanDailyStatsRows(rows)
}

// GetDailyStatsByUser returns stats grouped by user (summed across models).
func (r *PostgresReportRepository) GetDailyStatsByUser(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	query := fmt.Sprintf(`SELECT %s FROM billing_daily_stats
		WHERE stat_date >= $1 AND stat_date <= $2
		ORDER BY user_id, stat_date ASC`, dailyStatsColumns)

	rows, err := r.pool.Query(ctx, query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	return r.scanDailyStatsRows(rows)
}

// GetDailyStatsByModel returns stats grouped by model (summed across users).
func (r *PostgresReportRepository) GetDailyStatsByModel(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	query := fmt.Sprintf(`SELECT %s FROM billing_daily_stats
		WHERE stat_date >= $1 AND stat_date <= $2
		ORDER BY model_id, stat_date ASC`, dailyStatsColumns)

	rows, err := r.pool.Query(ctx, query, startDate, endDate)
	if err != nil {
		return nil, err
	}
	return r.scanDailyStatsRows(rows)
}

// GetTodayRevenue queries today's real-time data from request_logs.
func (r *PostgresReportRepository) GetTodayRevenue(ctx context.Context) (float64, int, error) {
	var revenue float64
	var count int
	today := time.Now().Format("2006-01-02")
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(cost_amount), 0), COUNT(*)
		FROM request_logs
		WHERE created_at::date = $1
	`, today).Scan(&revenue, &count)
	return revenue, count, err
}

// GetCurrentMonthRevenue queries current month's total revenue and request count from billing_daily_stats.
func (r *PostgresReportRepository) GetCurrentMonthRevenue(ctx context.Context) (float64, int, error) {
	var revenue float64
	var count int
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(total_revenue), 0), COALESCE(SUM(request_count), 0)
		FROM billing_daily_stats
		WHERE stat_date >= $1 AND stat_date < $2
	`, firstOfMonth, now).Scan(&revenue, &count)
	return revenue, count, err
}

// RunDailyAggregation aggregates data from request_logs into billing_daily_stats (idempotent).
func (r *PostgresReportRepository) RunDailyAggregation(ctx context.Context, statDate time.Time) error {
	dateStr := statDate.Format("2006-01-02")

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	// Delete existing records for the date (idempotent).
	if _, err := tx.Exec(ctx, `DELETE FROM billing_daily_stats WHERE stat_date = $1`, dateStr); err != nil {
		return fmt.Errorf("delete existing: %w", err)
	}

	// Insert aggregated data from request_logs.
	if _, err := tx.Exec(ctx, `
		INSERT INTO billing_daily_stats (stat_date, user_id, model_id, request_count, input_tokens, output_tokens, total_revenue)
		SELECT
			$1::date,
			user_id,
			model_id,
			COUNT(*),
			COALESCE(SUM(input_tokens), 0),
			COALESCE(SUM(output_tokens), 0),
			COALESCE(SUM(cost_amount), 0)
		FROM request_logs
		WHERE created_at::date = $1
		GROUP BY user_id, model_id
	`, dateStr); err != nil {
		return fmt.Errorf("insert aggregation: %w", err)
	}

	return tx.Commit(ctx)
}

// GetUserDailyStats returns aggregated stats for a specific user over a date range.
func (r *PostgresReportRepository) GetUserDailyStats(ctx context.Context, userID int64, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	query := fmt.Sprintf(`SELECT %s FROM billing_daily_stats
		WHERE user_id = $1 AND stat_date >= $2 AND stat_date <= $3
		ORDER BY stat_date ASC`, dailyStatsColumns)

	rows, err := r.pool.Query(ctx, query, userID, startDate, endDate)
	if err != nil {
		return nil, err
	}
	return r.scanDailyStatsRows(rows)
}

// GetUserTodaySummary returns today's real-time summary for a specific user.
func (r *PostgresReportRepository) GetUserTodaySummary(ctx context.Context, userID int64) (float64, int, error) {
	var revenue float64
	var count int
	today := time.Now().Format("2006-01-02")
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(cost_amount), 0), COUNT(*)
		FROM request_logs
		WHERE user_id = $1 AND created_at::date = $2
	`, userID, today).Scan(&revenue, &count)
	return revenue, count, err
}

// GetCurrentMonthRevenueByUser returns current month's revenue and request count for a specific user.
func (r *PostgresReportRepository) GetCurrentMonthRevenueByUser(ctx context.Context, userID int64) (float64, int, error) {
	var revenue float64
	var count int
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(total_revenue), 0), COALESCE(SUM(request_count), 0)
		FROM billing_daily_stats
		WHERE user_id = $1 AND stat_date >= $2 AND stat_date < $3
	`, userID, firstOfMonth, now).Scan(&revenue, &count)
	return revenue, count, err
}
