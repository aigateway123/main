-- ============================================================
-- 本地开发环境数据恢复脚本
-- 用途：业务配置数据（Provider/模型/定价/绑定）被清空后重建一套标准配置
-- 依据：docs/08-Release/RN-20260801-P1-Iteration-002.md（5 Provider + 8 模型定价）
-- 注意：幂等可重复执行；API Key 来自仓库 scripts/setup_all.py（本地开发用）
-- ============================================================

BEGIN;

-- 1. 恢复 Admin 额度（userID=1）
UPDATE users SET quota_balance = 1000000, updated_at = NOW()
WHERE email = 'admin@test.com' AND deleted_at IS NULL;

-- 2. 重建 Provider（5 个）
INSERT INTO providers (provider_name, base_url, api_key_ref, api_path, priority, weight, is_enabled_flag)
VALUES
  ('DeepSeek', 'https://api.deepseek.com',           'sk-0562481bb43d404ba775fce530af8c6d', '/v1/chat/completions',               100, 100, TRUE),
  ('智谱',     'https://open.bigmodel.cn',            'c05faa2ff5e54cafa2522f5ed95d20a2.BWW8mx6XWWq4Xpw3', '/api/paas/v4/chat/completions', 100, 100, TRUE),
  ('MiniMax',  'https://api.minimax.chat',           '',                                   '/v1/text/chatcompletion_v2',        100, 100, TRUE),
  ('千问',     'https://dashscope.aliyuncs.com',      'sk-ws-H.EDEYRRY.EOfA.MEUCIB1mQ4hC4v7fEsIAAPZ4PGp34Kkne6nKmt5nQnPHGyqSAiEAox7wje0bQqEQ5Wlq1d5vnkChwqh8gVw7J8mFDSTBF7Y', '/compatible-mode/v1/chat/completions', 100, 100, TRUE),
  ('Kimi',     'https://api.moonshot.cn',            'sk-DDoFml0OHfXR2pQb0Ot27UkcTbiKIuJ1bUgyIp2gUrufaG5h', '/v1/chat/completions',           100, 100, TRUE)
ON CONFLICT (provider_name) DO NOTHING;

-- 3. 重建模型（8 个）
INSERT INTO models (model_name, model_code, model_type, model_status)
VALUES
  ('DeepSeek V4 Flash', 'deepseek-v4-flash',     'chat', 'active'),
  ('DeepSeek V4 Pro',   'deepseek-v4-pro',       'chat', 'active'),
  ('Qwen3.7 Flash',     'qwen3.7-flash',         'chat', 'active'),
  ('Qwen3.7 Plus',      'qwen3.7-plus',          'chat', 'active'),
  ('Qwen3.8 Max Preview','qwen3.8-max-preview',  'chat', 'active'),
  ('MiniMax M3',        'MiniMax-M3',            'chat', 'active'),
  ('GLM 5.2',           'GLM-5.2',               'chat', 'active'),
  ('Kimi K3',           'kimi-k3',               'chat', 'active')
ON CONFLICT (model_code) DO NOTHING;

-- 4. 重建定价（价格 = 官网 ¥/百万 tokens ÷ 1e6，CNY）
-- 注意：numeric(16,6) 精度限制，极小单价会被舍入为 0，可在后台调整
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000001, 0.000002, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'deepseek-v4-flash'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000003, 0.000006, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'deepseek-v4-pro'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000000, 0.000000, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'qwen3.7-flash'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000000, 0.000002, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'qwen3.7-plus'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000003, 0.000008, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'qwen3.8-max-preview'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000002, 0.000008, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'MiniMax-M3'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000008, 0.000028, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'GLM-5.2'
ON CONFLICT (model_id) DO NOTHING;
INSERT INTO model_pricing (model_id, pricing_type, price_per_input_token, price_per_output_token, currency, pricing_status, pricing_unit)
SELECT m.id, 'flat', 0.000022, 0.000108, 'CNY', 'active', 'token' FROM models m WHERE m.model_code = 'kimi-k3'
ON CONFLICT (model_id) DO NOTHING;

-- 5. 重建模型 → Provider 绑定
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = 'DeepSeek' WHERE m.model_code = 'deepseek-v4-flash'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = 'DeepSeek' WHERE m.model_code = 'deepseek-v4-pro'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = '千问' WHERE m.model_code = 'qwen3.7-flash'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = '千问' WHERE m.model_code = 'qwen3.7-plus'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = '千问' WHERE m.model_code = 'qwen3.8-max-preview'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = 'MiniMax' WHERE m.model_code = 'MiniMax-M3'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = '智谱' WHERE m.model_code = 'GLM-5.2'
ON CONFLICT (model_id, provider_id) DO NOTHING;
INSERT INTO model_provider_bindings (model_id, provider_id, weight, binding_status)
SELECT m.id, p.id, 100, 'active' FROM models m JOIN providers p ON p.provider_name = 'Kimi' WHERE m.model_code = 'kimi-k3'
ON CONFLICT (model_id, provider_id) DO NOTHING;

-- 6. 创建本地测试 API Key（完整 Key 见交付说明）
INSERT INTO api_keys (user_id, key_prefix, key_hash, permission_scope, key_status)
VALUES (1, 'sk-campus-fb', 'b840e38f62d3704a2ba310108296d641d93876eb721cec9aff4d35add5652ddb', 'default', 'active')
ON CONFLICT (key_prefix) DO NOTHING;

COMMIT;
