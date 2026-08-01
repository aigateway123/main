-- Rollback: Remove model_type, api_path_override, pricing_unit, unit_price, and request_logs extension fields

-- 1. request_logs 表移除扩展字段
ALTER TABLE request_logs DROP COLUMN IF EXISTS model_type;
ALTER TABLE request_logs DROP COLUMN IF EXISTS usage_unit;
ALTER TABLE request_logs DROP COLUMN IF EXISTS usage_amount;

-- 2. model_pricing 表移除 pricing_unit 和 unit_price
ALTER TABLE model_pricing DROP COLUMN IF EXISTS pricing_unit;
ALTER TABLE model_pricing DROP COLUMN IF EXISTS unit_price;

-- 3. model_provider_bindings 表移除 api_path_override
ALTER TABLE model_provider_bindings DROP COLUMN IF EXISTS api_path_override;

-- 4. models 表移除 model_type
ALTER TABLE models DROP COLUMN IF EXISTS model_type;
