CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_status VARCHAR(50) NOT NULL DEFAULT 'active',
    budget_amount DECIMAL(18, 6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    user_status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE api_keys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    key_prefix VARCHAR(50) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permission_scope VARCHAR(100) NOT NULL DEFAULT 'default',
    key_status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE providers (
    id BIGSERIAL PRIMARY KEY,
    provider_name VARCHAR(100) NOT NULL,
    base_url VARCHAR(255) NOT NULL,
    api_key_ref VARCHAR(255),
    priority INTEGER NOT NULL DEFAULT 100,
    weight INTEGER NOT NULL DEFAULT 100,
    is_enabled_flag BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE models (
    id BIGSERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_code VARCHAR(100) NOT NULL,
    model_status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE model_provider_bindings (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES models(id),
    provider_id BIGINT NOT NULL REFERENCES providers(id),
    weight INTEGER NOT NULL DEFAULT 100,
    binding_status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_organizations_name ON organizations(name);
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE UNIQUE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE UNIQUE INDEX idx_providers_name ON providers(provider_name);
CREATE UNIQUE INDEX idx_models_code ON models(model_code);
CREATE UNIQUE INDEX idx_model_provider_bindings_unique ON model_provider_bindings(model_id, provider_id);
