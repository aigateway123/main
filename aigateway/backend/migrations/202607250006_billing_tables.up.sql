-- Migration 006: User model permissions and model pricing tables
-- Adds user_model_permissions table for per-user model access control,
-- and model_pricing table (supports flat and time-based pricing).

BEGIN;

-- ============================================================
-- 1. Create user_model_permissions table
-- ============================================================
CREATE TABLE user_model_permissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    model_id BIGINT NOT NULL REFERENCES models(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, model_id)
);

CREATE INDEX idx_user_model_permissions_user_id ON user_model_permissions(user_id);
CREATE INDEX idx_user_model_permissions_model_id ON user_model_permissions(model_id);

-- ============================================================
-- 2. Create model_pricing table
-- Supports both flat pricing and time-based (peak/off-peak) pricing.
-- pricing_type: 'flat' = standard pricing, 'time_based' = peak/off-peak pricing
-- ============================================================
CREATE TABLE model_pricing (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES models(id),
    pricing_type VARCHAR(20) NOT NULL DEFAULT 'flat'
        CHECK (pricing_type IN ('flat', 'time_based')),
    price_per_input_token DECIMAL(16,6) NOT NULL DEFAULT 0,
    price_per_output_token DECIMAL(16,6) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    peak_start TIME,
    peak_end TIME,
    peak_price_per_input DECIMAL(16,6),
    peak_price_per_output DECIMAL(16,6),
    offpeak_price_per_input DECIMAL(16,6),
    offpeak_price_per_output DECIMAL(16,6),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_model_pricing_model_id ON model_pricing(model_id);

-- ============================================================
-- 3. Seed default model pricing entries for existing models
-- Sets default price to 0 (Admin should configure actual prices via admin UI).
-- ============================================================
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token)
SELECT id, 'flat', 0, 0 FROM models;

COMMIT;
