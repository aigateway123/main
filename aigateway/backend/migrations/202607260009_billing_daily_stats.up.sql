-- Migration 009: Create billing_daily_stats aggregation table and request_logs indexes
-- Adds billing_daily_stats table for fast report queries
-- Adds composite indexes on request_logs for report query performance

BEGIN;

-- ============================================================
-- 1. Create billing_daily_stats aggregation table
-- ============================================================
CREATE TABLE IF NOT EXISTS billing_daily_stats (
    id              BIGSERIAL PRIMARY KEY,
    stat_date       DATE            NOT NULL,
    user_id         BIGINT          NOT NULL,
    model_id        BIGINT          NOT NULL,
    request_count   INTEGER         NOT NULL DEFAULT 0,
    input_tokens    BIGINT          NOT NULL DEFAULT 0,
    output_tokens   BIGINT          NOT NULL DEFAULT 0,
    total_revenue   DECIMAL(18,6)   NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE(stat_date, user_id, model_id)
);

CREATE INDEX IF NOT EXISTS idx_bds_stat_date ON billing_daily_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_bds_user_id ON billing_daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_bds_model_id ON billing_daily_stats(model_id);
CREATE INDEX IF NOT EXISTS idx_bds_date_user ON billing_daily_stats(stat_date, user_id);
CREATE INDEX IF NOT EXISTS idx_bds_date_model ON billing_daily_stats(stat_date, model_id);

-- ============================================================
-- 2. Add request_logs composite indexes for report queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_rl_user_date ON request_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_rl_model_date ON request_logs(model_code, created_at);

-- ============================================================
-- 3. Add new permission code admin:billing:report
-- ============================================================
INSERT INTO permissions (code, name, description, module)
VALUES ('admin:billing:report', '查看账单报表', '查看和导出账单报表', 'billing')
ON CONFLICT (code) DO NOTHING;

-- Assign the new permission to Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Admin' AND p.code = 'admin:billing:report'
ON CONFLICT DO NOTHING;

COMMIT;
