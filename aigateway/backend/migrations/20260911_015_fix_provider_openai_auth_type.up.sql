-- 014 起 auth_type 语义 = OpenAI 端点认证方式（013 加该列时是 Anthropic 端点语义，默认 'api_key'）
ALTER TABLE providers ALTER COLUMN auth_type SET DEFAULT 'bearer';

-- 存量 OpenAI 端点修正为 Bearer（旧前端写入了 'api_key'，旧代码硬编码 Bearer 故此前未暴露）
UPDATE providers
SET auth_type = 'bearer'
WHERE protocol_type = 'openai' AND base_url <> '' AND auth_type = 'api_key';
