package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

// isPgDuplicateError checks if the error is a PostgreSQL unique constraint violation.
func isPgDuplicateError(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23505"
	}
	return false
}

// NewPostgresPool creates a new PostgreSQL connection pool.
func NewPostgresPool(databaseURL string) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database URL: %w", err)
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute
	config.HealthCheckPeriod = 1 * time.Minute

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return pool, nil
}

// NewPostgresDB opens a database/sql connection for use with the migrator.
func NewPostgresDB(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	db.SetMaxOpenConns(5)
	db.SetMaxIdleConns(2)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}

// NewRepositoryFromDriver creates all repositories based on the storage driver.
func NewRepositoryFromDriver(driver string, pool *pgxpool.Pool) (
	healthRepo HealthRepository,
	userRepo UserRepository,
	keyRepo ApiKeyRepository,
	sessionRepo SessionRepository,
	providerRepo ProviderRepository,
	modelRepo ModelRepository,
	bindingRepo ModelBindingRepository,
	logRepo RequestLogRepository,
) {
	switch driver {
	case "postgres":
		healthRepo = NewStaticHealthRepository("gateway", "development")
		userRepo = NewPostgresUserRepository(pool)
		keyRepo = NewPostgresApiKeyRepository(pool)
		sessionRepo = NewPostgresSessionRepository(pool)
		providerRepo = NewPostgresProviderRepository(pool)
		modelRepo = NewPostgresModelRepository(pool)
		bindingRepo = NewPostgresModelBindingRepository(pool)
		logRepo = NewPostgresRequestLogRepository(pool)
	default:
		healthRepo = NewStaticHealthRepository("gateway", "development")
		userRepo = NewInMemoryUserRepository()
		keyRepo = NewInMemoryApiKeyRepository()
		sessionRepo = NewInMemorySessionRepository()
		providerRepo = NewInMemoryProviderRepository()
		modelRepo = NewInMemoryModelRepository()
		bindingRepo = NewInMemoryModelBindingRepository()
		logRepo = NewInMemoryRequestLogRepository()
	}
	return
}
