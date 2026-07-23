# API: [接口名称]

Version: v1.0

Status: [Draft / Active / Deprecated]

Owner: Full Stack Engineer

Last Updated: YYYY-MM-DD

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| API ID | API-[YYYYMMDD]-[序号] |
| Version | v1.0 |
| Status | [Draft / Active / Deprecated] |
| Owner | Full Stack Engineer |
| Service | [Gateway / Auth / Policy / Billing] |
| Related PRD | [PRD ID] |
| Related Architecture | [ARCH ID] |
| Created | YYYY-MM-DD |
| Last Updated | YYYY-MM-DD |

---

## 2. API Name

[接口名称]

---

## 3. Description

[接口功能的简要描述。该接口解决了什么业务场景？]

### 使用场景

- [场景 1]
- [场景 2]

### 注意事项

- [注意事项 1]
- [注意事项 2]

---

## 4. URL

```
[Method] /api/v1/[资源路径]
```

### URL 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| [参数名] | [类型] | ✅ / ❌ | [说明] |

### Query 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:-----:|------|
| [参数名] | [类型] | ✅ / ❌ | [默认] | [说明] |

---

## 5. Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| [GET / POST / PUT / DELETE / PATCH] | [说明] | ✅ / ❌ |

---

## 6. Authentication

| 方式 | 说明 |
|------|------|
| [API Key / JWT / Basic Auth / OAuth] | [认证方式说明] |

### 认证 Header

```
Authorization: Bearer [token]
```

### 认证错误

| 场景 | HTTP Status | Error Code |
|------|:-----------:|:----------:|
| 未提供认证信息 | 401 | AUTH001 |
| 认证信息无效 | 401 | AUTH002 |
| 认证信息已过期 | 401 | AUTH003 |

---

## 7. Authorization

| 权限 | 说明 |
|------|------|
| [admin / user / read-only] | [权限说明] |

### 权限校验规则

- [规则 1]
- [规则 2]

### 授权错误

| 场景 | HTTP Status | Error Code |
|------|:-----------:|:----------:|
| 无权限 | 403 | AUTH004 |
| 资源不允许访问 | 403 | AUTH005 |

---

## 8. Request Header

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|:----:|:-----:|------|
| Authorization | string | ✅ | — | Bearer [token] |
| Content-Type | string | ✅ | application/json | 请求内容类型 |
| Accept-Language | string | ❌ | zh-CN | 语言偏好 |
| X-Request-ID | string | ❌ | — | 请求追踪 ID |
| X-Trace-ID | string | ❌ | — | 链路追踪 ID |

---

## 9. Request Body

```json
{
    "field1": "value1",
    "field2": 123,
    "field3": [
        "item1",
        "item2"
    ]
}
```

### 字段说明

| 字段 | 类型 | 必填 | 验证规则 | 说明 |
|------|------|:----:|---------|------|
| field1 | string | ✅ | max length 255 | [说明] |
| field2 | integer | ✅ | >= 0 | [说明] |
| field3 | array | ❌ | max items 100 | [说明] |

---

## 10. Response

### Success Response (200 / 201)

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "field1": "value1",
        "field2": 123
    },
    "traceId": "trace-xxx"
}
```

### Response 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | integer | 业务状态码，0 表示成功 |
| message | string | 状态描述 |
| data | object | 业务数据 |
| traceId | string | 链路追踪 ID |

### No Content (204)

操作成功但无返回数据时返回 204 No Content。

---

## 11. Error Codes

| Error Code | HTTP Status | 说明 | 处理建议 |
|:----------:|:-----------:|------|---------|
| 0 | 200 | 成功 | — |
| AUTH001 | 401 | 未提供认证信息 | 检查 Authorization header |
| AUTH002 | 401 | 认证信息无效 | 检查 API Key 或 Token |
| AUTH004 | 403 | 无权限 | 检查账号权限 |
| VALID001 | 400 | 参数校验失败 | 检查请求参数 |
| VALID002 | 400 | 参数格式错误 | 检查参数格式 |
| RATE001 | 429 | 请求频率超限 | 降低请求频率 |
| GATEWAY001 | 500 | Gateway 内部错误 | 联系运维 |
| BILL001 | 500 | 计费服务异常 | 联系运维 |

### 错误响应格式

```json
{
    "code": "VALID001",
    "message": "参数校验失败",
    "detail": {
        "field": "email",
        "reason": "邮箱格式不正确"
    },
    "traceId": "trace-xxx"
}
```

---

## 12. Pagination

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:-----:|------|
| page | integer | ❌ | 1 | 页码，从 1 开始 |
| pageSize | integer | ❌ | 20 | 每页数量，最大 100 |
| sortBy | string | ❌ | created_at | 排序字段 |
| sortOrder | string | ❌ | desc | 排序方向 (asc / desc) |

### 响应格式

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "items": [],
        "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 100,
            "totalPages": 5
        }
    },
    "traceId": "trace-xxx"
}
```

### Pagination 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| page | integer | 当前页码 |
| pageSize | integer | 每页数量 |
| total | integer | 总数 |
| totalPages | integer | 总页数 |

---

## 13. Examples

### cURL 示例

```bash
curl -X [METHOD] https://api.example.com/v1/[path] \
  -H "Authorization: Bearer sk-xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "value1",
    "field2": 123
  }'
```

### 成功响应示例

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 1,
        "name": "example"
    },
    "traceId": "trace-abc123"
}
```

### 错误响应示例

```json
{
    "code": "VALID001",
    "message": "参数校验失败",
    "detail": {
        "field": "email",
        "reason": "邮箱格式不正确"
    },
    "traceId": "trace-abc123"
}
```

---

## 14. Database Impact

| 表名 | 操作 | 说明 |
|------|------|------|
| [表名] | [SELECT / INSERT / UPDATE / DELETE] | [说明] |
| [表名] | [SELECT / INSERT / UPDATE / DELETE] | [说明] |

### 查询说明

- [复杂查询说明]
- [索引使用说明]

---

## 15. Cache Strategy

| 缓存项 | Key 模式 | TTL | 失效时机 | 说明 |
|--------|---------|:---:|---------|------|
| [缓存项] | `[key 模式]` | [时间] | [失效条件] | [说明] |
| [缓存项] | `[key 模式]` | [时间] | [失效条件] | [说明] |

---

## 16. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| YYYY-MM-DD | v1.0 | 初始版本 | Full Stack Engineer |
| YYYY-MM-DD | v1.1 | [修改内容] | [修改人] |

---

# End

本模板依据 AI Company Document Standard 和 Engineering Standard 设计。

所有 API 文档必须基于此模板创建。
