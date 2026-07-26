#!/usr/bin/env python3
"""Fix Zhipu provider and test with correct model names."""
import json, urllib.request

BASE = "http://localhost:8080"
HEADERS = {"Content-Type": "application/json"}

def api(method, path, data=None, token=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(data).encode() if data else None, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        resp = urllib.request.urlopen(req)
        b = resp.read()
        return json.loads(b) if b else {"code": 0}
    except urllib.error.HTTPError as e:
        return json.loads(e.read()) if e.read() else {"code": e.code}

# Login
r = api("POST", "/api/v1/auth/login", {"email":"admin@nova.com","password":"admin123"})
token = r["data"]["accessToken"]

# Re-update Zhipu provider - explicitly WITHOUT backticks
print("=== 修复 Zhipu Provider ===")
r = api("PUT", "/api/v1/providers/4", {
    "providerName": "Zhipu",
    "baseUrl": "https://open.bigmodel.cn",
    "apiPath": "/api/paas/v4/chat/completions",
    "apiKeyRef": "c05faa2ff5e54cafa2522f5ed95d20a2.BWW8mx6XWWq4Xpw3",
    "priority": 100,
    "weight": 100,
    "isEnabledFlag": True
}, token)
data = r.get("data", {})
url = data.get("baseUrl", "NONE")
print(f"  baseUrl = {url}")
print(f"  {'✅ 无误' if '`' not in url else '❌ 还有反引号'}")

# Create API Key
r = api("POST", "/api/v1/api-keys", {}, token)
if r.get("data"):
    key = r["data"]["fullKey"]
else:
    key = input("粘贴 API Key fullKey: ").strip()

# Test Zhipu with multiple model names
print("\n=== 测试智谱模型 ===")
models_to_try = ["glm-5.2", "glm-5", "glm-4-plus", "glm-4-flash", "glm-4-air"]
for model in models_to_try:
    r = api("POST", "/v1/chat/completions", {
        "model": model,
        "messages": [{"role": "user", "content": "hi"}]
    }, key)
    if "usage" in r:
        print(f"  {model} ✅ tokens: {r['usage']['total_tokens']}")
        break
    elif "error" in r:
        err = r["error"]
        msg = err.get("message", str(err)) if isinstance(err, dict) else str(err)
        print(f"  {model} ❌ {msg[:80]}")
    else:
        print(f"  {model} ❌ {str(r)[:80]}")

# Final: update model name to the working one if needed
print("\n=== 完成 ===")
