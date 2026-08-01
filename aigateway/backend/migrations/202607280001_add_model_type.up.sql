-- Migration: Add model_type, api_path_override, pricing_unit, unit_price, and request_logs extension fields
-- This migration supports image generation model type in addition to chat

-- 1. models 表增加 model_type
ALTER TABLE models ADD COLUMN model_type VARCHAR(32) NOT NULL DEFAULT 'chat';

-- 2. model_provider_bindings 表增加 api_path_override
ALTER TABLE model_provider_bindings ADD COLUMN api_path_override VARCHAR(255) DEFAULT NULL;

-- 3. model_pricing 表增加 pricing_unit 和 unit_price
ALTER TABLE model_pricing ADD COLUMN pricing_unit VARCHAR(32) NOT NULL DEFAULT 'token';
ALTER TABLE model_pricing ADD COLUMN unit_price JSONB DEFAULT NULL;

-- 4. request_logs 表增加扩展字段
ALTER TABLE request_logs ADD COLUMN model_type VARCHAR(32) NOT NULL DEFAULT 'chat';
ALTER TABLE request_logs ADD COLUMN usage_unit VARCHAR(32) NOT NULL DEFAULT 'token';
ALTER TABLE request_logs ADD COLUMN usage_amount INT NOT NULL DEFAULT 0;
