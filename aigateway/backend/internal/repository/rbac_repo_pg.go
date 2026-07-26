package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRBACRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRBACRepository(pool *pgxpool.Pool) *PostgresRBACRepository {
	return &PostgresRBACRepository{pool: pool}
}

func (r *PostgresRBACRepository) GetRoleNameByID(ctx context.Context, roleID int64) (string, error) {
	query := `SELECT name FROM roles WHERE id = $1 AND deleted_at IS NULL`
	var name string
	err := r.pool.QueryRow(ctx, query, roleID).Scan(&name)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", ErrRoleNotFound
		}
		return "", err
	}
	return name, nil
}

func (r *PostgresRBACRepository) GetRoleIDByName(ctx context.Context, name string) (int64, error) {
	query := `SELECT id FROM roles WHERE name = $1 AND deleted_at IS NULL`
	var id int64
	err := r.pool.QueryRow(ctx, query, name).Scan(&id)
	if err != nil {
		if err == pgx.ErrNoRows {
			return 0, ErrRoleNotFound
		}
		return 0, err
	}
	return id, nil
}

func (r *PostgresRBACRepository) ListPermissionCodesByRoleID(ctx context.Context, roleID int64) ([]string, error) {
	query := `
		SELECT p.code
		FROM permissions p
		JOIN role_permissions rp ON rp.permission_id = p.id
		WHERE rp.role_id = $1
		ORDER BY p.code ASC
	`
	rows, err := r.pool.Query(ctx, query, roleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []string
	for rows.Next() {
		var code string
		if err := rows.Scan(&code); err != nil {
			return nil, err
		}
		result = append(result, code)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *PostgresRBACRepository) ListRoles(ctx context.Context) ([]*entity.Role, error) {
	query := `SELECT id, name, description, is_system, created_at, updated_at FROM roles WHERE deleted_at IS NULL ORDER BY id ASC`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.Role
	for rows.Next() {
		var role entity.Role
		if err := rows.Scan(&role.ID, &role.Name, &role.Description, &role.IsSystem, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, &role)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *PostgresRBACRepository) CreateRole(ctx context.Context, name string, description string) (*entity.Role, error) {
	now := time.Now()
	var role entity.Role
	err := r.pool.QueryRow(ctx,
		`INSERT INTO roles (name, description, is_system, created_at, updated_at) VALUES ($1, $2, false, $3, $3) RETURNING id, name, description, is_system, created_at, updated_at`,
		name, description, now,
	).Scan(&role.ID, &role.Name, &role.Description, &role.IsSystem, &role.CreatedAt, &role.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *PostgresRBACRepository) UpdateRole(ctx context.Context, id int64, name string, description string) error {
	now := time.Now()
	result, err := r.pool.Exec(ctx,
		`UPDATE roles SET name = $2, description = $3, updated_at = $4 WHERE id = $1 AND deleted_at IS NULL`,
		id, name, description, now,
	)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrRoleNotFound
	}
	return nil
}

func (r *PostgresRBACRepository) DeleteRole(ctx context.Context, id int64) error {
	// Soft delete by checking it's not a system role
	result, err := r.pool.Exec(ctx,
		`UPDATE roles SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL AND is_system = false`,
		id,
	)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrRoleNotFound
	}
	return nil
}

func (r *PostgresRBACRepository) ListPermissions(ctx context.Context) ([]*entity.Permission, error) {
	query := `SELECT id, code, name, description, module, created_at FROM permissions ORDER BY id ASC`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.Permission
	for rows.Next() {
		var p entity.Permission
		if err := rows.Scan(&p.ID, &p.Code, &p.Name, &p.Description, &p.Module, &p.CreatedAt); err != nil {
			return nil, err
		}
		result = append(result, &p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *PostgresRBACRepository) UpdateRolePermissions(ctx context.Context, roleID int64, permissionIDs []int64) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if _, err := tx.Exec(ctx, `DELETE FROM role_permissions WHERE role_id = $1`, roleID); err != nil {
		return err
	}

	for _, permID := range permissionIDs {
		if _, err := tx.Exec(ctx, `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, roleID, permID); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func (r *PostgresRBACRepository) GetRoleWithPermissions(ctx context.Context, roleID int64) (int64, string, *string, bool, []entity.Permission, error) {
	// Get role
	var rid int64
	var name string
	var desc *string
	var isSystem bool
	err := r.pool.QueryRow(ctx,
		`SELECT id, name, description, is_system FROM roles WHERE id = $1 AND deleted_at IS NULL`,
		roleID,
	).Scan(&rid, &name, &desc, &isSystem)
	if err != nil {
		if err == pgx.ErrNoRows {
			return 0, "", nil, false, nil, ErrRoleNotFound
		}
		return 0, "", nil, false, nil, err
	}

	// Get all permissions with assigned flag
	query := `
		SELECT p.id, p.code, p.name, p.description, p.module, p.created_at,
			CASE WHEN rp.role_id IS NOT NULL THEN true ELSE false END AS assigned
		FROM permissions p
		LEFT JOIN role_permissions rp ON rp.permission_id = p.id AND rp.role_id = $1
		ORDER BY p.id ASC
	`
	rows, err := r.pool.Query(ctx, query, roleID)
	if err != nil {
		return 0, "", nil, false, nil, err
	}
	defer rows.Close()

	var perms []entity.Permission
	for rows.Next() {
		var p entity.Permission
		var assigned bool
		if err := rows.Scan(&p.ID, &p.Code, &p.Name, &p.Description, &p.Module, &p.CreatedAt, &assigned); err != nil {
			return 0, "", nil, false, nil, err
		}
		// We always return all permissions; the assigned flag handling is done by the caller
		perms = append(perms, p)
	}
	if err := rows.Err(); err != nil {
		return 0, "", nil, false, nil, err
	}

	return rid, name, desc, isSystem, perms, nil
}

