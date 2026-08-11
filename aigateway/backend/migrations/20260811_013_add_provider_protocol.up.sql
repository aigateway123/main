ALTER TABLE providers ADD COLUMN protocol_type VARCHAR(20) NOT NULL DEFAULT 'openai';
ALTER TABLE providers ADD COLUMN auth_type VARCHAR(20) NOT NULL DEFAULT 'api_key';
