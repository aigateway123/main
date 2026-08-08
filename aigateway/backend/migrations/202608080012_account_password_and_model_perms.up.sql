-- Migration 012: Account password visibility + model permission popup
-- 1. Add plain_password column for admin view of account passwords.
-- 2. Add admin:user:view_password permission and grant to Admin role.
-- 3. Grant existing public models to all existing users (keep current behavior).

BEGIN;

-- ============================================================
-- 1. users.plain_password (admin-only visibility)
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS plain_password VARCHAR(255);

-- ============================================================
-- 2. New permission: admin:user:view_password
-- ============================================================
INSERT INTO permissions (code, name, description, module)
VALUES ('admin:user:view_password', '查看账号密码', '查看账号的登录密码', 'user')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'Admin'), id FROM permissions
WHERE code = 'admin:user:view_password'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. Grant existing public models to all existing users
-- (keeps current is_public visibility; new semantics require explicit grants)
-- ============================================================
INSERT INTO user_model_permissions (user_id, model_id)
SELECT u.id, m.id
FROM users u
JOIN models m ON m.is_public = TRUE AND m.deleted_at IS NULL
WHERE u.deleted_at IS NULL
ON CONFLICT (user_id, model_id) DO NOTHING;

COMMIT;
