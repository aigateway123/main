-- Migration 005: Rollback RBAC tables

BEGIN;

-- Drop role_permissions table
DROP INDEX IF EXISTS idx_role_permissions_role_id;
DROP INDEX IF EXISTS idx_role_permissions_permission_id;
DROP TABLE IF EXISTS role_permissions;

-- Drop permissions table
DROP INDEX IF EXISTS idx_permissions_code;
DROP INDEX IF EXISTS idx_permissions_module;
DROP TABLE IF EXISTS permissions;

-- Drop roles table
DROP INDEX IF EXISTS idx_roles_name;
DROP TABLE IF EXISTS roles;

COMMIT;
