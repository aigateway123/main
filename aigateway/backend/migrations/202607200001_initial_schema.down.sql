DROP INDEX IF EXISTS idx_model_provider_bindings_unique;
DROP INDEX IF EXISTS idx_models_code;
DROP INDEX IF EXISTS idx_providers_name;
DROP INDEX IF EXISTS idx_api_keys_user_id;
DROP INDEX IF EXISTS idx_api_keys_prefix;
DROP INDEX IF EXISTS idx_users_organization_id;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_organizations_name;

DROP TABLE IF EXISTS model_provider_bindings;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS organizations;
