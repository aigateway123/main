-- 种子数据：创建默认 Admin 用户和示例 Provider

-- Admin 用户（密码: admin123，需要先用 bcrypt 生成 hash）
-- 实际密码 hash 需用户自行生成
INSERT INTO users (email, nickname, password_hash, user_status) 
VALUES ('admin@nova.com', 'Admin', '$2a$10$placeholder_hash', 'active')
ON CONFLICT (email) DO NOTHING;

-- 示例 Provider（仅做参考，需要用户自行填入真实 API Key）
INSERT INTO providers (provider_name, base_url, api_key_ref, priority, weight, is_enabled_flag)
VALUES 
  ('OpenAI', 'https://api.openai.com', 'sk-your-openai-key', 1, 100, true),
  ('DeepSeek', 'https://api.deepseek.com', 'sk-your-deepseek-key', 2, 80, true)
ON CONFLICT (provider_name) DO NOTHING;

-- 示例 Model
INSERT INTO models (model_name, model_code, model_status)
VALUES 
  ('GPT-4o Mini', 'gpt-4o-mini', 'active'),
  ('DeepSeek Chat', 'deepseek-chat', 'active')
ON CONFLICT (model_code) DO NOTHING;
