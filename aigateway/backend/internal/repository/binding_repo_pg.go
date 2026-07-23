package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresModelBindingRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresModelBindingRepository(pool *pgxpool.Pool) *PostgresModelBindingRepository {
	return &PostgresModelBindingRepository{pool: pool}
}

const (
	bindingColumns = "id, model_id, provider_id, weight, binding_status, created_at, updated_at, deleted_at"
)

func (r *PostgresModelBindingRepository) scanBinding(row pgx.Row) (*entity.ModelProviderBinding, error) {
	var b entity.ModelProviderBinding
	err := row.Scan(
		&b.ID, &b.ModelID, &b.ProviderID, &b.Weight,
		&b.BindingStatus, &b.CreatedAt, &b.UpdatedAt, &b.DeletedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrBindingNotFound
		}
		return nil, err
	}
	return &b, nil
}

func (r *PostgresModelBindingRepository) Create(ctx context.Context, b *entity.ModelProviderBinding) error {
	query := `INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		b.ModelID, b.ProviderID, b.Weight, b.BindingStatus, now, now,
	).Scan(&b.ID, &b.CreatedAt, &b.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *PostgresModelBindingRepository) ListByModelID(ctx context.Context, modelID int64) ([]*entity.ModelProviderBinding, error) {
	query := `SELECT ` + bindingColumns + ` FROM model_provider_bindings
		WHERE model_id = $1 AND deleted_at IS NULL ORDER BY weight ASC`
	rows, err := r.pool.Query(ctx, query, modelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.ModelProviderBinding
	for rows.Next() {
		var b entity.ModelProviderBinding
		err := rows.Scan(
			&b.ID, &b.ModelID, &b.ProviderID, &b.Weight,
			&b.BindingStatus, &b.CreatedAt, &b.UpdatedAt, &b.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, &b)
	}
	return result, rows.Err()
}

func (r *PostgresModelBindingRepository) DeleteByID(ctx context.Context, id int64) error {
	query := `UPDATE model_provider_bindings SET deleted_at = $1, updated_at = $1 WHERE id = $2 AND deleted_at IS NULL`
	now := time.Now()
	result, err := r.pool.Exec(ctx, query, now, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrBindingNotFound
	}
	return nil
}
