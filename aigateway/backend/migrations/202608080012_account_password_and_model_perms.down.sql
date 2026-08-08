-- Migration 012 rollback: Account password visibility + model permission popup

BEGIN;

-- Revoke new permission and remove grants of public models created by this migration.
DELETE FROM role_permissions
WHERE permission_id IN (SELECT id FROM permissions WHERE code = 'admin:user:view_password');

DELETE FROM permissions WHERE code = 'admin:user:view_password';

DELETE FROM user_model_permissions
WHERE user_id IN (SELECT id FROM users WHERE deleted_at IS NULL)
  AND model_id IN (SELECT id FROM models WHERE is_public = TRUE AND deleted_at IS NULL);

ALTER TABLE users DROP COLUMN IF EXISTS plain_password;

COMMIT;
