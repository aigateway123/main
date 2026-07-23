package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresSessionRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresSessionRepository(pool *pgxpool.Pool) *PostgresSessionRepository {
	return &PostgresSessionRepository{pool: pool}
}

const (
	sessionColumns = "id, user_id, refresh_token_hash, expires_at, created_at, deleted_at"
)

func (r *PostgresSessionRepository) scanSession(row pgx.Row) (*entity.UserSession, error) {
	var s entity.UserSession
	err := row.Scan(
		&s.ID, &s.UserID, &s.RefreshTokenHash, &s.ExpiresAt,
		&s.CreatedAt, &s.DeletedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrSessionNotFound
		}
		return nil, err
	}
	return &s, nil
}

func (r *PostgresSessionRepository) Create(ctx context.Context, session *entity.UserSession) error {
	query := `INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at, created_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		session.UserID, session.RefreshTokenHash, session.ExpiresAt, now,
	).Scan(&session.ID, &session.CreatedAt)
	if err != nil {
		return err
	}
	return nil
}

func (r *PostgresSessionRepository) GetByUserID(ctx context.Context, userID int64) (*entity.UserSession, error) {
	query := `SELECT ` + sessionColumns + ` FROM user_sessions
		WHERE user_id = $1 AND deleted_at IS NULL AND expires_at > NOW()
		ORDER BY created_at DESC LIMIT 1`
	row := r.pool.QueryRow(ctx, query, userID)
	return r.scanSession(row)
}

func (r *PostgresSessionRepository) DeleteByUserID(ctx context.Context, userID int64) error {
	query := `UPDATE user_sessions SET deleted_at = $1 WHERE user_id = $2 AND deleted_at IS NULL`
	_, err := r.pool.Exec(ctx, query, time.Now(), userID)
	return err
}
