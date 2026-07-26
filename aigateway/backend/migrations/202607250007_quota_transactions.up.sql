-- Migration 007: Quota transactions and users table additions
-- Adds quota_transactions table for tracking all quota changes,
-- and adds role_id and quota_balance fields to users table.
-- Also migrates existing admin users to have the Admin role.

BEGIN;

-- ============================================================
-- 1. Create quota_transactions table
-- ============================================================
CREATE TABLE quota_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    amount DECIMAL(16,6) NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('deduction', 'admin_allocation', 'refund')),
    reference_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quota_transactions_user_id ON quota_transactions(user_id);
CREATE INDEX idx_quota_transactions_created_at ON quota_transactions(created_at);
CREATE INDEX idx_quota_transactions_type ON quota_transactions(type);

-- ============================================================
-- 2. Add role_id to users table
-- ============================================================
ALTER TABLE users ADD COLUMN role_id BIGINT REFERENCES roles(id);
CREATE INDEX idx_users_role_id ON users(role_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 3. Add quota_balance to users table
-- ============================================================
ALTER TABLE users ADD COLUMN quota_balance DECIMAL(16,6) NOT NULL DEFAULT 0;

-- ============================================================
-- 4. Migrate existing users: assign Admin role and default quota
-- For existing users that don't have a role_id, assign the Admin role
-- to ensure backward compatibility.
-- ============================================================
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'Admin'),
    quota_balance = 0
WHERE role_id IS NULL;

COMMIT;
