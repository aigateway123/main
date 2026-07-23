ALTER TABLE providers ADD COLUMN api_path VARCHAR(255) NOT NULL DEFAULT '/v1/chat/completions';
