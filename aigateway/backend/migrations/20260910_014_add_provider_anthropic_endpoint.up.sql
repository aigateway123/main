-- Provider 双协议端点：base_url 系列列 = OpenAI 端点，新增 anthropic_* 列 = Anthropic 端点
ALTER TABLE providers ADD COLUMN anthropic_base_url VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE providers ADD COLUMN anthropic_api_path VARCHAR(255) NOT NULL DEFAULT '/v1/messages';
ALTER TABLE providers ADD COLUMN anthropic_api_key_ref VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE providers ADD COLUMN anthropic_auth_type VARCHAR(20) NOT NULL DEFAULT 'api_key';

-- 迁移存量 anthropic 协议 Provider：主端点搬运到 anthropic_*，OpenAI 列清空
UPDATE providers
SET anthropic_base_url    = base_url,
    anthropic_api_path    = COALESCE(NULLIF(api_path, ''), '/v1/messages'),
    anthropic_api_key_ref = COALESCE(api_key_ref, ''),
    anthropic_auth_type   = COALESCE(NULLIF(auth_type, ''), 'api_key'),
    base_url              = '',
    api_path              = '',
    api_key_ref           = ''
WHERE protocol_type = 'anthropic';
