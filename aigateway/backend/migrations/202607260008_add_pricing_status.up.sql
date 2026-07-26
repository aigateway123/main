ALTER TABLE model_pricing ADD COLUMN IF NOT EXISTS pricing_status VARCHAR(20) NOT NULL DEFAULT 'pending';
