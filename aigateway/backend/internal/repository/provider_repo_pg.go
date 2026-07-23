package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresProviderRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresProviderRepository(pool *pgxpool.Pool) *PostgresProviderRepository {
	return &PostgresProviderRepository{pool: pool}
}

const (
	providerColumns = "id, provider_name, base_url, api_key_ref, api_path, priority, weight, is_enabled_flag, created_at, updated_at, deleted_at"
)

func (r *PostgresProviderRepository) scanProvider(row pgx.Row) (*entity.Provider, error) {
	var p entity.Provider
	err := row.Scan(
		&p.ID, &p.ProviderName, &p.BaseURL, &p.APIKeyRef,
		&p.APIPath,
		&p.Priority, &p.Weight, &p.IsEnabledFlag,
		&p.CreatedAt, &p.UpdatedAt, &p.DeletedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrProviderNotFound
		}
		return nil, err
	}
	return &p, nil
}

func (r *PostgresProviderRepository) Create(ctx context.Context, p *entity.Provider) error {
	query := `INSERT INTO providers (provider_name, base_url, api_key_ref, api_path, priority, weight, is_enabled_flag, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		p.ProviderName, p.BaseURL, p.APIKeyRef, p.APIPath, p.Priority, p.Weight, p.IsEnabledFlag, now, now,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if isPgDuplicateError(err) {
			return ErrDuplicateName
		}
		return err
	}
	return nil
}

func (r *PostgresProviderRepository) GetByID(ctx context.Context, id int64) (*entity.Provider, error) {
	query := `SELECT ` + providerColumns + ` FROM providers WHERE id = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, id)
	return r.scanProvider(row)
}

func (r *PostgresProviderRepository) List(ctx context.Context) ([]*entity.Provider, error) {
	query := `SELECT ` + providerColumns + ` FROM providers WHERE deleted_at IS NULL ORDER BY priority ASC, provider_name ASC`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.Provider
	for rows.Next() {
		var p entity.Provider
		err := rows.Scan(
			&p.ID, &p.ProviderName, &p.BaseURL, &p.APIKeyRef,
			&p.APIPath,
			&p.Priority, &p.Weight, &p.IsEnabledFlag,
			&p.CreatedAt, &p.UpdatedAt, &p.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, &p)
	}
	return result, rows.Err()
}

func (r *PostgresProviderRepository) Update(ctx context.Context, p *entity.Provider) error {
	query := `UPDATE providers SET provider_name = $1, base_url = $2, api_key_ref = $3,
		api_path = $4, priority = $5, weight = $6, is_enabled_flag = $7, updated_at = $8
		WHERE id = $9 AND deleted_at IS NULL`

	now := time.Now()
	result, err := r.pool.Exec(ctx, query,
		p.ProviderName, p.BaseURL, p.APIKeyRef, p.APIPath, p.Priority, p.Weight, p.IsEnabledFlag, now, p.ID,
	)
	if err != nil {
		if isPgDuplicateError(err) {
			return ErrDuplicateName
		}
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrProviderNotFound
	}
	p.UpdatedAt = now
	return nil
}

func (r *PostgresProviderRepository) Delete(ctx context.Context, id int64) error {
	query := `UPDATE providers SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`

	result, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrProviderNotFound
	}
	return nil
}
