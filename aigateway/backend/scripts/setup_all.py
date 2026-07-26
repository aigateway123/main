#!/usr/bin/env python3
"""One-time setup script: configures all providers, bindings, pricing and tests."""
import json, urllib.request, sys, os

BASE = "http://localhost:8080"

def api(method, path, data=None, token=None):
    url = BASE + path
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        resp = urllib.request.urlopen(req)
        b = resp.read()
        return json.loads(b) if b else {"code": 0, "data": None}
    except urllib.error.HTTPError as e:
        b = e.read()
        return json.loads(b) if b else {"code": e.code}

# 1. Login
print("=== 1. 登录 ===")
r = api("POST", "/api/v1/auth/login", {"email":"admin@nova.com","password":"admin123"})
if "data" not in r:
    print(f"登录失败: {r}")
    sys.exit(1)
token = r["data"]["accessToken"]
print("OK")

# 2. Update providers
print("\n=== 2. 更新 Provider 配置 ===")
providers = [
    (1, "OpenAI",   "https://api.openai.com",         "/v1/chat/completions",                       ""),
    (2, "DeepSeek", "https://api.deepseek.com",       "/v1/chat/completions",                       "sk-0562481bb43d404ba775fce530af8c6d"),
    (3, "Kimi",     "https://api.moonshot.cn",        "/v1/chat/completions",                       "sk-DDoFml0OHfXR2pQb0Ot27UkcTbiKIuJ1bUgyIp2gUrufaG5h"),
    (4, "Zhipu",    "https://open.bigmodel.cn",        "/api/paas/v4/chat/completions",              "c05faa2ff5e54cafa2522f5ed95d20a2.BWW8mx6XWWq4Xpw3"),
    (5, "Qwen",     "https://dashscope.aliyuncs.com",  "/compatible-mode/v1/chat/completions",       "sk-ws-H.EDEYRRY.EOfA.MEUCIB1mQ4hC4v7fEsIAAPZ4PGp34Kkne6nKmt5nQnPHGyqSAiEAox7wje0bQqEQ5Wlq1d5vnkChwqh8gVw7J8mFDSTBF7Y"),
]
for pid, name, url, path, key in providers:
    r = api("PUT", f"/api/v1/providers/{pid}", {
        "providerName": name, "baseUrl": url, "apiPath": path,
        "apiKeyRef": key, "priority": 100, "weight": 100, "isEnabledFlag": True
    }, token)
    ok = r.get("data") is not None
    print(f"  [{pid}] {name} {'✅' if ok else '❌'}")

# 3. Bind models to providers
print("\n=== 3. 绑定模型 ===")
bindings = [(1,1), (2,2), (3,5), (4,4), (5,3)]
for mid, pid in bindings:
    api("POST", f"/api/v1/models/{mid}/bind", {"providerId": pid, "weight": 100}, token)
    print(f"  模型{mid} → Provider{pid} ✅")

# 4. Set pricing
print("\n=== 4. 设置定价 ===")
prices = [(1, 0.00001, 0.00003), (2, 0.000005, 0.000015), (3, 0.00001, 0.00003), (4, 0.00001, 0.00003), (5, 0.00001, 0.00003)]
for mid, inp, outp in prices:
    api("PUT", f"/api/v1/admin/pricing/{mid}", {
        "pricingType": "flat", "pricePerInputToken": inp, "pricePerOutputToken": outp, "currency": "USD"
    }, token)
    print(f"  模型{mid} ✅")

# 5. Create API Key
print("\n=== 5. 创建 API Key ===")
r = api("POST", "/api/v1/api-keys", {}, token)
if r.get("data"):
    api_key = r["data"]["fullKey"]
    print(f"  API Key: {api_key}")
else:
    print(f"  创建失败: {r}")
    print("  请到后台 API Keys 页面手动创建一个，复制 fullKey 回来")
    api_key = input("  粘贴 fullKey: ").strip()

# 6. Test
print("\n=== 6. 测试 ===")
tests = [("deepseek-v4-flash", "DeepSeek"), ("kimi-k3", "Kimi"), ("glm-5.2", "智谱"), ("qwen-plus", "千问")]
for code, name in tests:
    r = api("POST", "/v1/chat/completions", {"model": code, "messages": [{"role": "user", "content": "hi"}]}, api_key)
    if "usage" in r:
        print(f"  {name} ({code}) ✅ tokens: {r['usage']['total_tokens']}")
    elif "error" in r:
        print(f"  {name} ({code}) ❌ {r['error'].get('message', r['error'])[:80]}")
    else:
        msg = str(r)[:120]
        print(f"  {name} ({code}) ❌ {msg}")

print("\n=== 完成 ===")
