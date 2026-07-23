package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresUserRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresUserRepository(pool *pgxpool.Pool) *PostgresUserRepository {
	return &PostgresUserRepository{pool: pool}
}

const (
	userColumns = "id, organization_id, email, nickname, user_status, password_hash, created_at, updated_at, deleted_at"
)

func (r *PostgresUserRepository) scanUser(row pgx.Row) (*entity.User, error) {
	var u entity.User
	err := row.Scan(
		&u.ID, &u.OrganizationID, &u.Email, &u.Nickname,
		&u.UserStatus, &u.PasswordHash, &u.CreatedAt, &u.UpdatedAt, &u.DeletedAt,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &u, nil
}

func (r *PostgresUserRepository) Create(ctx context.Context, user *entity.User) error {
	query := `INSERT INTO users (email, nickname, password_hash, user_status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at`

	now := time.Now()
	err := r.pool.QueryRow(ctx, query,
		user.Email, user.Nickname, user.PasswordHash, user.UserStatus, now, now,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if isPgDuplicateError(err) {
			return ErrDuplicateEmail
		}
		return err
	}
	return nil
}

func (r *PostgresUserRepository) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	query := `SELECT ` + userColumns + ` FROM users WHERE email = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, email)
	return r.scanUser(row)
}

func (r *PostgresUserRepository) GetByID(ctx context.Context, id int64) (*entity.User, error) {
	query := `SELECT ` + userColumns + ` FROM users WHERE id = $1 AND deleted_at IS NULL`
	row := r.pool.QueryRow(ctx, query, id)
	return r.scanUser(row)
}
