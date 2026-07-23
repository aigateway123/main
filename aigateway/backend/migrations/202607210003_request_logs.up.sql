CREATE TABLE request_logs (
    id BIGSERIAL PRIMARY KEY,
    api_key_id BIGINT REFERENCES api_keys(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    model_id BIGINT NOT NULL REFERENCES models(id),
    provider_id BIGINT NOT NULL REFERENCES providers(id),
    model_code VARCHAR(100) NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    cost_amount DECIMAL(18,6) NOT NULL DEFAULT 0,
    request_status VARCHAR(50) NOT NULL DEFAULT 'success',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_request_logs_created_at ON request_logs(created_at);
CREATE INDEX idx_request_logs_user_id ON request_logs(user_id);
CREATE INDEX idx_request_logs_api_key_id ON request_logs(api_key_id);
