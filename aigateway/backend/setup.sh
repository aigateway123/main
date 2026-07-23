#!/bin/bash
# Setup gateway data programmatically

# Login
TOKEN=$(curl -s http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' | python3 -c "
import sys,json
d=json.load(sys.stdin)
print(d.get('data',{}).get('accessToken',''))
")

# If login fails, register first
if [ -z "$TOKEN" ]; then
  TOKEN=$(curl -s http://localhost:8080/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@test.com","password":"admin123","nickname":"Admin"}' | python3 -c "
import sys,json
d=json.load(sys.stdin)
print(d.get('data',{}).get('accessToken',''))
")
fi

echo "TOKEN: $TOKEN"
if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  exit 1
fi

# Create Provider
echo "=== Creating Provider ==="
curl -s -X POST http://localhost:8080/api/v1/providers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"providerName":"DeepSeek官方","baseUrl":"https://api.deepseek.com","apiKeyRef":"sk-a249fa3b080145e2b57b136121c1a6ba","priority":1,"weight":100,"isEnabledFlag":true}'
echo ""

# Create Model
echo "=== Creating Model ==="
curl -s -X POST http://localhost:8080/api/v1/models \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"modelName":"DeepSeek V4 Flash","modelCode":"deepseek-v4-flash"}'
echo ""

# Bind
echo "=== Binding ==="
curl -s -X POST http://localhost:8080/api/v1/models/1/bind \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"providerId":1,"weight":100}'
echo ""

# Create API Key
echo "=== Creating API Key ==="
curl -s -X POST http://localhost:8080/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"test-key"}'
echo ""
