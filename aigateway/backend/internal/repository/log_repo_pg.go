package repository

import (
	"context"
	"fmt"
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
	// COALESCE the nullable FK columns (api_key_id / provider_id) so scans
	// never hit NULL when ad-hoc entries were recorded without them.
	logColumns = "id, user_id, COALESCE(api_key_id, 0) AS api_key_id, model_id, COALESCE(provider_id, 0) AS provider_id, " +
		"model_code, provider_name, " +
		"input_tokens, output_tokens, latency_ms, cost_amount, request_status, model_type, usage_unit, usage_amount, created_at"

	// adminLogColumns is the aliased variant used by AdminList.
	adminLogColumns = "l.id, l.user_id, COALESCE(l.api_key_id, 0) AS api_key_id, l.model_id, COALESCE(l.provider_id, 0) AS provider_id, " +
		"l.model_code, l.provider_name, " +
		"l.input_tokens, l.output_tokens, l.latency_ms, l.cost_amount, l.request_status, l.model_type, l.usage_unit, l.usage_amount, l.created_at"
)

func (r *PostgresRequestLogRepository) Create(ctx context.Context, log *entity.RequestLog) error {
	query := `INSERT INTO request_logs
		(user_id, api_key_id, model_id, provider_id, model_code, provider_name,
		 input_tokens, output_tokens, latency_ms, cost_amount, request_status,
		 model_type, usage_unit, usage_amount, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, created_at`

	modelType := log.ModelType
	if modelType == "" {
		modelType = "chat"
	}
	usageUnit := log.UsageUnit
	if usageUnit == "" {
		usageUnit = "token"
	}

	// api_key_id / provider_id are nullable FK columns: write NULL instead of 0
	// so partial log entries (e.g. ad-hoc recording) don't trip FK constraints.
	var apiKeyID, providerID *int64
	if log.ApiKeyID > 0 {
		apiKeyID = &log.ApiKeyID
	}
	if log.ProviderID > 0 {
		providerID = &log.ProviderID
	}

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		log.UserID, apiKeyID, log.ModelID, providerID,
		log.ModelCode, log.ProviderName, log.InputTokens, log.OutputTokens,
		log.LatencyMs, log.CostAmount, log.RequestStatus,
		modelType, usageUnit, log.UsageAmount, now,
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
			&l.LatencyMs, &l.CostAmount, &l.RequestStatus,
			&l.ModelType, &l.UsageUnit, &l.UsageAmount, &l.CreatedAt,
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
			&l.LatencyMs, &l.CostAmount, &l.RequestStatus,
			&l.ModelType, &l.UsageUnit, &l.UsageAmount, &l.CreatedAt,
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

func (r *PostgresRequestLogRepository) ListByUserIDFiltered(ctx context.Context, userID int64, offset, limit int, startDate, endDate, modelCode string) ([]*entity.RequestLog, int, error) {
	args := []interface{}{userID}
	whereClause := "WHERE user_id = $1"
	argIdx := 2

	if modelCode != "" {
		whereClause += fmt.Sprintf(" AND model_code = $%d", argIdx)
		args = append(args, modelCode)
		argIdx++
	}
	if startDate != "" {
		whereClause += fmt.Sprintf(" AND created_at >= ($%d::timestamp AT TIME ZONE 'Asia/Shanghai')", argIdx)
		args = append(args, startDate)
		argIdx++
	}
	if endDate != "" {
		whereClause += fmt.Sprintf(" AND created_at < (($%d::timestamp + INTERVAL '1 day') AT TIME ZONE 'Asia/Shanghai')", argIdx)
		args = append(args, endDate)
		argIdx++
	}

	countQuery := `SELECT COUNT(*) FROM request_logs ` + whereClause
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	dataQuery := `SELECT ` + logColumns + ` FROM request_logs ` + whereClause + ` ORDER BY created_at DESC LIMIT $` + fmt.Sprintf("%d", argIdx) + ` OFFSET $` + fmt.Sprintf("%d", argIdx+1)
	args = append(args, limit, offset)
	rows, err := r.pool.Query(ctx, dataQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var result []*entity.RequestLog
	for rows.Next() {
		var l entity.RequestLog
		err := rows.Scan(&l.ID, &l.UserID, &l.ApiKeyID, &l.ModelID, &l.ProviderID,
			&l.ModelCode, &l.ProviderName, &l.InputTokens, &l.OutputTokens,
			&l.LatencyMs, &l.CostAmount, &l.RequestStatus,
			&l.ModelType, &l.UsageUnit, &l.UsageAmount, &l.CreatedAt)
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

func (r *PostgresRequestLogRepository) AdminStats(ctx context.Context) (*AdminUsageStats, error) {
	today := time.Now().Truncate(24 * time.Hour)

	stats := &AdminUsageStats{}

	// Basic stats
	err := r.pool.QueryRow(ctx, `
		SELECT
			COALESCE(COUNT(*), 0),
			COALESCE(SUM(input_tokens + output_tokens), 0),
			COALESCE(SUM(cost_amount), 0),
			COALESCE(SUM(CASE WHEN created_at >= $1 THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN created_at >= $1 THEN input_tokens + output_tokens ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN created_at >= $1 THEN cost_amount ELSE 0 END), 0)
		FROM request_logs
	`, today).Scan(&stats.TotalRequests, &stats.TotalTokens, &stats.TotalCost,
		&stats.TodayRequests, &stats.TodayTokens, &stats.TodayCost)
	if err != nil {
		return nil, err
	}

	// Count users
	if err := r.pool.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE deleted_at IS NULL`).Scan(&stats.TotalUsers); err != nil {
		return nil, err
	}

	// Count active users (have at least one log today)
	if err := r.pool.QueryRow(ctx, `SELECT COUNT(DISTINCT user_id) FROM request_logs WHERE created_at >= $1`, today).Scan(&stats.ActiveUsers); err != nil {
		return nil, err
	}

	// Cost by model
	rows, err := r.pool.Query(ctx, `
		SELECT model_code, COALESCE(SUM(cost_amount), 0), COUNT(*)
		FROM request_logs
		GROUP BY model_code
		ORDER BY SUM(cost_amount) DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats.CostByModel = make([]CostByModelItem, 0)
	for rows.Next() {
		var item CostByModelItem
		if err := rows.Scan(&item.ModelCode, &item.TotalCost, &item.TotalRequests); err != nil {
			return nil, err
		}
		stats.CostByModel = append(stats.CostByModel, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return stats, nil
}

func (r *PostgresRequestLogRepository) AdminList(ctx context.Context, offset, limit int, filterUserID int64, startDate, endDate, status string) ([]*entity.RequestLog, int, error) {
	args := []interface{}{}
	whereClause := ""
	argIdx := 1

	if filterUserID > 0 {
		whereClause += fmt.Sprintf(" WHERE l.user_id = $%d", argIdx)
		args = append(args, filterUserID)
		argIdx++
	} else {
		whereClause += " WHERE 1=1"
	}

	if status != "" {
		whereClause += fmt.Sprintf(" AND l.request_status = $%d", argIdx)
		args = append(args, status)
		argIdx++
	}
	if startDate != "" {
		whereClause += fmt.Sprintf(" AND l.created_at >= ($%d::timestamp AT TIME ZONE 'Asia/Shanghai')", argIdx)
		args = append(args, startDate)
		argIdx++
	}
	if endDate != "" {
		whereClause += fmt.Sprintf(" AND l.created_at < (($%d::timestamp + INTERVAL '1 day') AT TIME ZONE 'Asia/Shanghai')", argIdx)
		args = append(args, endDate)
		argIdx++
	}

	countQuery := `SELECT COUNT(*) FROM request_logs l` + whereClause
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	dataQuery := `SELECT ` + adminLogColumns + ` FROM request_logs l` + whereClause +
		` ORDER BY l.created_at DESC LIMIT $` + fmt.Sprintf("%d", argIdx) + ` OFFSET $` + fmt.Sprintf("%d", argIdx+1)
	args = append(args, limit, offset)

	rows, err := r.pool.Query(ctx, dataQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var result []*entity.RequestLog
	for rows.Next() {
		var l entity.RequestLog
		err := rows.Scan(&l.ID, &l.UserID, &l.ApiKeyID, &l.ModelID, &l.ProviderID,
			&l.ModelCode, &l.ProviderName, &l.InputTokens, &l.OutputTokens,
			&l.LatencyMs, &l.CostAmount, &l.RequestStatus,
			&l.ModelType, &l.UsageUnit, &l.UsageAmount, &l.CreatedAt)
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
