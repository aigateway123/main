package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresBillingRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresBillingRepository(pool *pgxpool.Pool) *PostgresBillingRepository {
	return &PostgresBillingRepository{pool: pool}
}

func (r *PostgresBillingRepository) DeductQuotaAndRecord(ctx context.Context, log *entity.RequestLog, costAmount float64) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	now := time.Now()
	insertLogQuery := `INSERT INTO request_logs
		(user_id, api_key_id, model_id, provider_id, model_code, provider_name,
		 input_tokens, output_tokens, latency_ms, cost_amount, request_status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at`
	if err := tx.QueryRow(ctx, insertLogQuery,
		log.UserID, log.ApiKeyID, log.ModelID, log.ProviderID,
		log.ModelCode, log.ProviderName, log.InputTokens, log.OutputTokens,
		log.LatencyMs, 0, log.RequestStatus, now,
	).Scan(&log.ID, &log.CreatedAt); err != nil {
		return err
	}

	var quotaBalance float64
	err = tx.QueryRow(ctx, `SELECT quota_balance FROM users WHERE id = $1 AND deleted_at IS NULL FOR UPDATE`, log.UserID).Scan(&quotaBalance)
	if err != nil {
		if err == pgx.ErrNoRows {
			return ErrUserNotFound
		}
		return err
	}

	if costAmount > 0 && quotaBalance < costAmount {
		return ErrQuotaExceeded
	}

	if costAmount > 0 {
		if _, err := tx.Exec(ctx, `UPDATE users SET quota_balance = quota_balance - $2, updated_at = $3 WHERE id = $1`, log.UserID, costAmount, now); err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `INSERT INTO quota_transactions (user_id, amount, type, reference_id, created_at) VALUES ($1, $2, 'deduction', $3, $4)`, log.UserID, -costAmount, log.ID, now); err != nil {
			return err
		}
	}

	if _, err := tx.Exec(ctx, `UPDATE request_logs SET cost_amount = $2 WHERE id = $1`, log.ID, costAmount); err != nil {
		return err
	}
	log.CostAmount = costAmount

	return tx.Commit(ctx)
}

