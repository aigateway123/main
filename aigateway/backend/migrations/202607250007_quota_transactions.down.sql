-- Migration 007: Rollback quota transactions and users table additions

BEGIN;

-- Remove quota_balance from users table
ALTER TABLE users DROP COLUMN IF EXISTS quota_balance;

-- Remove role_id from users table
DROP INDEX IF EXISTS idx_users_role_id;
ALTER TABLE users DROP COLUMN IF EXISTS role_id;

-- Drop quota_transactions table
DROP INDEX IF EXISTS idx_quota_transactions_user_id;
DROP INDEX IF EXISTS idx_quota_transactions_created_at;
DROP INDEX IF EXISTS idx_quota_transactions_type;
DROP TABLE IF EXISTS quota_transactions;

COMMIT;
