package repository

import (
	"context"
	"fmt"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresAdminUserRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresAdminUserRepository(pool *pgxpool.Pool) *PostgresAdminUserRepository {
	return &PostgresAdminUserRepository{pool: pool}
}

func (r *PostgresAdminUserRepository) ListByRoleID(ctx context.Context, roleID int64, search string, status string, offset int, limit int) ([]*entity.User, int, error) {
	args := make([]interface{}, 0, 5)
	args = append(args, roleID)
	where := "deleted_at IS NULL AND role_id = $1"
	argIdx := 2

	if search != "" {
		where += fmt.Sprintf(" AND (email ILIKE $%d OR nickname ILIKE $%d)", argIdx, argIdx)
		args = append(args, "%"+search+"%")
		argIdx++
	}
	if status != "" {
		where += fmt.Sprintf(" AND user_status = $%d", argIdx)
		args = append(args, status)
		argIdx++
	}

	countQuery := `SELECT COUNT(*) FROM users WHERE ` + where
	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	args = append(args, limit, offset)
	listQuery := `SELECT ` + userColumns + ` FROM users WHERE ` + where + fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIdx, argIdx+1)

	rows, err := r.pool.Query(ctx, listQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var items []*entity.User
	for rows.Next() {
		var u entity.User
		if err := rows.Scan(
			&u.ID, &u.OrganizationID, &u.Email, &u.Nickname,
			&u.UserStatus, &u.PasswordHash, &u.RoleID, &u.QuotaBalance, &u.CreatedAt, &u.UpdatedAt, &u.DeletedAt,
		); err != nil {
			return nil, 0, err
		}
		items = append(items, &u)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

func (r *PostgresAdminUserRepository) UpdateStatus(ctx context.Context, userID int64, status string) error {
	query := `UPDATE users SET user_status = $2, updated_at = $3 WHERE id = $1 AND deleted_at IS NULL`
	ct, err := r.pool.Exec(ctx, query, userID, status, time.Now())
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return ErrUserNotFound
	}
	return nil
}

func (r *PostgresAdminUserRepository) SetQuotaBalance(ctx context.Context, userID int64, newBalance float64) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var current float64
	err = tx.QueryRow(ctx, `SELECT quota_balance FROM users WHERE id = $1 AND deleted_at IS NULL FOR UPDATE`, userID).Scan(&current)
	if err != nil {
		if err == pgx.ErrNoRows {
			return ErrUserNotFound
		}
		return err
	}

	delta := newBalance - current
	now := time.Now()
	if _, err := tx.Exec(ctx, `UPDATE users SET quota_balance = $2, updated_at = $3 WHERE id = $1`, userID, newBalance, now); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, `INSERT INTO quota_transactions (user_id, amount, type, created_at) VALUES ($1, $2, 'admin_allocation', $3)`, userID, delta, now); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *PostgresAdminUserRepository) GetLastQuotaTransaction(ctx context.Context, userID int64) (*entity.QuotaTransaction, error) {
	query := `SELECT id, user_id, amount, type, reference_id, created_at FROM quota_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`
	var t entity.QuotaTransaction
	if err := r.pool.QueryRow(ctx, query, userID).Scan(&t.ID, &t.UserID, &t.Amount, &t.Type, &t.ReferenceID, &t.CreatedAt); err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}

func (r *PostgresAdminUserRepository) GetQuotaTotals(ctx context.Context, userID int64) (totalAllocated float64, totalSpent float64, error error) {
	query := `
		SELECT
			COALESCE(SUM(CASE WHEN type = 'admin_allocation' AND amount > 0 THEN amount ELSE 0 END), 0) AS total_allocated,
			COALESCE(SUM(CASE WHEN type = 'deduction' THEN -amount ELSE 0 END), 0) AS total_spent
		FROM quota_transactions
		WHERE user_id = $1
	`
	if err := r.pool.QueryRow(ctx, query, userID).Scan(&totalAllocated, &totalSpent); err != nil {
		return 0, 0, err
	}
	return totalAllocated, totalSpent, nil
}

