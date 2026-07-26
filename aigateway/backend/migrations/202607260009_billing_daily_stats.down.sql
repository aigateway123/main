-- Migration 009: Rollback billing_daily_stats table and request_logs indexes

BEGIN;

DROP INDEX IF EXISTS idx_bds_stat_date;
DROP INDEX IF EXISTS idx_bds_user_id;
DROP INDEX IF EXISTS idx_bds_model_id;
DROP INDEX IF EXISTS idx_bds_date_user;
DROP INDEX IF EXISTS idx_bds_date_model;
DROP TABLE IF EXISTS billing_daily_stats;

DROP INDEX IF EXISTS idx_rl_user_date;
DROP INDEX IF EXISTS idx_rl_model_date;

-- Remove the permission
DELETE FROM role_permissions WHERE permission_id IN (SELECT id FROM permissions WHERE code = 'admin:billing:report');
DELETE FROM permissions WHERE code = 'admin:billing:report';

COMMIT;
