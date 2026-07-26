-- Migration 005: RBAC tables
-- Adds roles, permissions, role_permissions tables and seeds default roles/permissions.

BEGIN;

-- ============================================================
-- 1. Create roles table
-- ============================================================
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_roles_name ON roles(name) WHERE deleted_at IS NULL;

-- ============================================================
-- 2. Create permissions table
-- ============================================================
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    module VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_permissions_module ON permissions(module);

-- ============================================================
-- 3. Create role_permissions join table
-- ============================================================
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id),
    permission_id BIGINT NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- ============================================================
-- 4. Seed default permissions
-- ============================================================
INSERT INTO permissions (code, name, description, module) VALUES
    -- Dashboard
    ('dashboard:view', '查看仪表盘', '访问仪表盘页面', 'dashboard'),
    -- API Key management
    ('api_key:manage', '管理 API Key', '查看和管理 API Key', 'api_key'),
    ('api_key:create', '创建 API Key', '创建新的 API Key', 'api_key'),
    ('api_key:delete', '删除 API Key', '删除 API Key', 'api_key'),
    -- Personal billing
    ('billing:view_self', '查看个人用量', '查看个人额度和用量明细', 'billing'),
    -- Admin: user management
    ('admin:user:list', '查看学生列表', '查看所有学生账号列表', 'user'),
    ('admin:user:create', '创建学生账号', '创建新的学生账号', 'user'),
    ('admin:user:manage', '管理学生账号', '启用/禁用学生账号', 'user'),
    ('admin:user:manage_quota', '管理学生额度', '查看和设置学生额度', 'user'),
    ('admin:user:manage_models', '管理学生模型授权', '指定学生可用模型列表', 'user'),
    -- Admin: role management
    ('admin:role:manage', '管理角色权限', '创建/编辑/删除角色和权限', 'role'),
    -- Admin: pricing management
    ('admin:pricing:manage', '管理模型定价', '查看和修改模型定价配置', 'pricing'),
    -- Admin: billing
    ('admin:billing:view', '查看全平台用量', '查看全平台用量统计和明细', 'billing'),
    -- Admin: provider/model management
    ('admin:provider:manage', '管理 Provider', '管理 AI Provider 配置', 'provider'),
    ('admin:model:manage', '管理 Model', '管理模型配置', 'model');

-- ============================================================
-- 5. Seed default roles
-- ============================================================
-- Admin role: gets all permissions
INSERT INTO roles (name, description, is_system) VALUES
    ('Admin', '系统管理员，拥有全部管理功能权限', TRUE),
    ('Student', '学生用户，仅能使用 API 和查看个人用量', TRUE);

-- Assign all permissions to Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'Admin'), id FROM permissions;

-- Assign limited permissions to Student role
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'Student'), id FROM permissions
WHERE code IN (
    'dashboard:view',
    'api_key:manage',
    'api_key:create',
    'api_key:delete',
    'billing:view_self'
);

COMMIT;
