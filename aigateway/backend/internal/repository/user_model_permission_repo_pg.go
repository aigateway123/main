package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresUserModelPermissionRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresUserModelPermissionRepository(pool *pgxpool.Pool) *PostgresUserModelPermissionRepository {
	return &PostgresUserModelPermissionRepository{pool: pool}
}

func (r *PostgresUserModelPermissionRepository) Exists(ctx context.Context, userID int64, modelID int64) (bool, error) {
	query := `SELECT 1 FROM user_model_permissions WHERE user_id = $1 AND model_id = $2`
	var x int
	err := r.pool.QueryRow(ctx, query, userID, modelID).Scan(&x)
	if err != nil {
		if err == pgx.ErrNoRows {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (r *PostgresUserModelPermissionRepository) ListModelIDsByUserID(ctx context.Context, userID int64) ([]int64, error) {
	query := `SELECT model_id FROM user_model_permissions WHERE user_id = $1 ORDER BY model_id ASC`
	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		result = append(result, id)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *PostgresUserModelPermissionRepository) ReplaceByUserID(ctx context.Context, userID int64, modelIDs []int64) (int, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `DELETE FROM user_model_permissions WHERE user_id = $1`, userID); err != nil {
		return 0, err
	}

	count := 0
	for _, modelID := range modelIDs {
		_, err := tx.Exec(ctx, `INSERT INTO user_model_permissions (user_id, model_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, userID, modelID)
		if err != nil {
			return 0, err
		}
		count++
	}

	if err := tx.Commit(ctx); err != nil {
		return 0, err
	}
	return count, nil
}

