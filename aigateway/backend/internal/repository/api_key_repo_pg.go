package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresApiKeyRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresApiKeyRepository(pool *pgxpool.Pool) *PostgresApiKeyRepository {
	return &PostgresApiKeyRepository{pool: pool}
}

const (
	apiKeyColumns = "id, user_id, key_prefix, key_hash, permission_scope, key_status, created_at, updated_at, deleted_at"
)

func (r *PostgresApiKeyRepository) scanApiKey(row pgx.Row) (*entity.ApiKey, error) {
	var k entity.ApiKey
	err := row.Scan(
		&k.ID, &k.UserID, &k.KeyPrefix, &k.KeyHash,
		&k.PermissionScope, &k.KeyStatus, &k.CreatedAt, &k.UpdatedAt, &k.DeletedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrApiKeyNotFound
		}
		return nil, err
	}
	return &k, nil
}

func (r *PostgresApiKeyRepository) Create(ctx context.Context, key *entity.ApiKey) error {
	query := `INSERT INTO api_keys (user_id, key_prefix, key_hash, permission_scope, key_status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		key.UserID, key.KeyPrefix, key.KeyHash, key.PermissionScope, key.KeyStatus, now, now,
	).Scan(&key.ID, &key.CreatedAt, &key.UpdatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *PostgresApiKeyRepository) GetByID(ctx context.Context, id int64) (*entity.ApiKey, error) {
	query := `SELECT ` + apiKeyColumns + ` FROM api_keys WHERE id = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, id)
	return r.scanApiKey(row)
}

func (r *PostgresApiKeyRepository) GetByUserID(ctx context.Context, userID int64) ([]*entity.ApiKey, error) {
	query := `SELECT ` + apiKeyColumns + ` FROM api_keys WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.ApiKey
	for rows.Next() {
		var k entity.ApiKey
		err := rows.Scan(
			&k.ID, &k.UserID, &k.KeyPrefix, &k.KeyHash,
			&k.PermissionScope, &k.KeyStatus, &k.CreatedAt, &k.UpdatedAt, &k.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, &k)
	}
	return result, rows.Err()
}

func (r *PostgresApiKeyRepository) GetByPrefix(ctx context.Context, prefix string) (*entity.ApiKey, error) {
	query := `SELECT ` + apiKeyColumns + ` FROM api_keys WHERE key_prefix = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, prefix)
	return r.scanApiKey(row)
}

func (r *PostgresApiKeyRepository) UpdateStatus(ctx context.Context, id int64, status string) error {
	query := `UPDATE api_keys SET key_status = $1, updated_at = $2 WHERE id = $3 AND deleted_at IS NULL`
	result, err := r.pool.Exec(ctx, query, status, time.Now(), id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrApiKeyNotFound
	}
	return nil
}
