-- Migration 006: Rollback user model permissions and model pricing tables

BEGIN;

-- Drop model_pricing table
DROP INDEX IF EXISTS idx_model_pricing_model_id;
DROP TABLE IF EXISTS model_pricing;

-- Drop user_model_permissions table
DROP INDEX IF EXISTS idx_user_model_permissions_user_id;
DROP INDEX IF EXISTS idx_user_model_permissions_model_id;
DROP TABLE IF EXISTS user_model_permissions;

COMMIT;
