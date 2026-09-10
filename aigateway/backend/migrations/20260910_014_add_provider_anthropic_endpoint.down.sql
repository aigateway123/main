-- 回滚仅删除新增列，不恢复已被搬运的存量端点数据（需从备份人工恢复，见 Release Note 回滚预案）
ALTER TABLE providers DROP COLUMN anthropic_base_url;
ALTER TABLE providers DROP COLUMN anthropic_api_path;
ALTER TABLE providers DROP COLUMN anthropic_api_key_ref;
ALTER TABLE providers DROP COLUMN anthropic_auth_type;

-- 移除迁移记录，使重新升级时 up.sql 能被再次执行
-- （否则迁移器会跳过该版本，anthropic_* 列将永久缺失）
-- version 取值规则 = 文件名首个 '_' 之前的部分
DELETE FROM schema_migrations WHERE version = '20260910';
