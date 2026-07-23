DROP TABLE IF EXISTS user_sessions;
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
