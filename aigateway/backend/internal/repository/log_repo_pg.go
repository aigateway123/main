package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// NOTE: request_logs table is not yet created by the current migrations.
// Execute migration 003 to create the table before using this repository.

type PostgresRequestLogRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRequestLogRepository(pool *pgxpool.Pool) *PostgresRequestLogRepository {
	return &PostgresRequestLogRepository{pool: pool}
}

const (
	logColumns = "id, user_id, api_key_id, model_id, provider_id, model_code, provider_name, " +
		"input_tokens, output_tokens, latency_ms, cost_amount, request_status, created_at"
)

func (r *PostgresRequestLogRepository) Create(ctx context.Context, log *entity.RequestLog) error {
	query := `INSERT INTO request_logs
		(user_id, api_key_id, model_id, provider_id, model_code, provider_name,
		 input_tokens, output_tokens, latency_ms, cost_amount, request_status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		log.UserID, log.ApiKeyID, log.ModelID, log.ProviderID,
		log.ModelCode, log.ProviderName, log.InputTokens, log.OutputTokens,
		log.LatencyMs, log.CostAmount, log.RequestStatus, now,
	).Scan(&log.ID, &log.CreatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *PostgresRequestLogRepository) List(ctx context.Context, userID int64, offset, limit int) ([]*entity.RequestLog, int, error) {
	// Count total
	countQuery := `SELECT COUNT(*) FROM request_logs WHERE user_id = $1`
	var total int
	err := r.pool.QueryRow(ctx, countQuery, userID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Fetch page
	query := `SELECT ` + logColumns + ` FROM request_logs
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`
	rows, err := r.pool.Query(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var result []*entity.RequestLog
	for rows.Next() {
		var l entity.RequestLog
		err := rows.Scan(
			&l.ID, &l.UserID, &l.ApiKeyID, &l.ModelID, &l.ProviderID,
			&l.ModelCode, &l.ProviderName, &l.InputTokens, &l.OutputTokens,
			&l.LatencyMs, &l.CostAmount, &l.RequestStatus, &l.CreatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		result = append(result, &l)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return result, total, nil
}

func (r *PostgresRequestLogRepository) CountByUserID(ctx context.Context, userID int64) (int, error) {
	query := `SELECT COUNT(*) FROM request_logs WHERE user_id = $1`
	var count int
	err := r.pool.QueryRow(ctx, query, userID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (r *PostgresRequestLogRepository) Recent(ctx context.Context, userID int64, limit int) ([]*entity.RequestLog, error) {
	query := `SELECT ` + logColumns + ` FROM request_logs
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2`
	rows, err := r.pool.Query(ctx, query, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.RequestLog
	for rows.Next() {
		var l entity.RequestLog
		err := rows.Scan(
			&l.ID, &l.UserID, &l.ApiKeyID, &l.ModelID, &l.ProviderID,
			&l.ModelCode, &l.ProviderName, &l.InputTokens, &l.OutputTokens,
			&l.LatencyMs, &l.CostAmount, &l.RequestStatus, &l.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, &l)
	}
	return result, rows.Err()
}

func (r *PostgresRequestLogRepository) Stats(ctx context.Context, userID int64) (*UsageStats, error) {
	query := `
		SELECT
			COALESCE(SUM(CASE WHEN created_at >= $2 THEN 1 ELSE 0 END), 0) AS today_requests,
			COALESCE(SUM(CASE WHEN created_at >= $2 THEN input_tokens + output_tokens ELSE 0 END), 0) AS today_tokens,
			COALESCE(SUM(CASE WHEN created_at >= $2 THEN cost_amount ELSE 0 END), 0) AS today_cost,
			COUNT(*) AS total_requests,
			COALESCE(SUM(input_tokens + output_tokens), 0) AS total_tokens,
			COALESCE(SUM(cost_amount), 0) AS total_cost,
			COALESCE(AVG(latency_ms), 0) AS average_latency
		FROM request_logs
		WHERE user_id = $1`

	today := time.Now().Truncate(24 * time.Hour)
	stats := &UsageStats{}
	err := r.pool.QueryRow(ctx, query, userID, today).Scan(
		&stats.TodayRequests, &stats.TodayTokens, &stats.TodayCost,
		&stats.TotalRequests, &stats.TotalTokens, &stats.TotalCost,
		&stats.AverageLatency,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return &UsageStats{}, nil
		}
		return nil, err
	}
	return stats, nil
}
