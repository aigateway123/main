ALTER TABLE providers ALTER COLUMN auth_type SET DEFAULT 'api_key';

UPDATE providers
SET auth_type = 'api_key'
WHERE protocol_type = 'openai' AND base_url <> '' AND auth_type = 'bearer';

-- 移除迁移记录，使重新升级时 up.sql 能再次执行
-- （version 取值规则 = 文件名首个 '_' 之前的部分）
DELETE FROM schema_migrations WHERE version = '20260911';
