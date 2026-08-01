package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresModelRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresModelRepository(pool *pgxpool.Pool) *PostgresModelRepository {
	return &PostgresModelRepository{pool: pool}
}

const (
	modelColumns = "id, model_name, model_code, model_type, model_status, created_at, updated_at, deleted_at"
)

func (r *PostgresModelRepository) scanModel(row pgx.Row) (*entity.Model, error) {
	var m entity.Model
	err := row.Scan(
		&m.ID, &m.ModelName, &m.ModelCode, &m.ModelType, &m.ModelStatus,
		&m.CreatedAt, &m.UpdatedAt, &m.DeletedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrModelNotFound
		}
		return nil, err
	}
	return &m, nil
}

func (r *PostgresModelRepository) Create(ctx context.Context, m *entity.Model) error {
	modelType := m.ModelType
	if modelType == "" {
		modelType = "chat"
	}
	query := `INSERT INTO models (model_name, model_code, model_type, model_status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		m.ModelName, m.ModelCode, modelType, m.ModelStatus, now, now,
	).Scan(&m.ID, &m.CreatedAt, &m.UpdatedAt)
	if err != nil {
		if isPgDuplicateError(err) {
			return ErrDuplicateModelCode
		}
		return err
	}
	return nil
}

func (r *PostgresModelRepository) GetByID(ctx context.Context, id int64) (*entity.Model, error) {
	query := `SELECT ` + modelColumns + ` FROM models WHERE id = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, id)
	return r.scanModel(row)
}

func (r *PostgresModelRepository) GetByCode(ctx context.Context, code string) (*entity.Model, error) {
	query := `SELECT ` + modelColumns + ` FROM models WHERE model_code = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, code)
	return r.scanModel(row)
}

func (r *PostgresModelRepository) List(ctx context.Context, modelType string) ([]*entity.Model, error) {
	var query string
	var args []any
	if modelType != "" {
		query = `SELECT ` + modelColumns + ` FROM models WHERE deleted_at IS NULL AND model_type = $1 ORDER BY model_name ASC`
		args = append(args, modelType)
	} else {
		query = `SELECT ` + modelColumns + ` FROM models WHERE deleted_at IS NULL ORDER BY model_name ASC`
	}
	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.Model
	for rows.Next() {
		var m entity.Model
		err := rows.Scan(
			&m.ID, &m.ModelName, &m.ModelCode, &m.ModelType, &m.ModelStatus,
			&m.CreatedAt, &m.UpdatedAt, &m.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		result = append(result, &m)
	}
	return result, rows.Err()
}

func (r *PostgresModelRepository) Update(ctx context.Context, m *entity.Model) error {
	query := `UPDATE models SET model_name = $1, model_code = $2, model_type = $3, model_status = $4, updated_at = $5
		WHERE id = $6 AND deleted_at IS NULL`

	modelType := m.ModelType
	if modelType == "" {
		modelType = "chat"
	}

	now := time.Now()
	result, err := r.pool.Exec(ctx, query,
		m.ModelName, m.ModelCode, modelType, m.ModelStatus, now, m.ID,
	)
	if err != nil {
		if isPgDuplicateError(err) {
			return ErrDuplicateModelCode
		}
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrModelNotFound
	}
	m.UpdatedAt = now
	return nil
}

func (r *PostgresModelRepository) Delete(ctx context.Context, id int64) error {
	query := `UPDATE models SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`

	result, err := r.pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrModelNotFound
	}
	return nil
}
