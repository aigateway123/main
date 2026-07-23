# API: Nova AI Gateway API 设计规范

Version: v1.0

Status: Active

Owner: Full Stack Engineer

Last Updated: 2026-07-20

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| API ID | API-20260720-001 |
| Version | v1.0 |
| Status | Active |
| Owner | Full Stack Engineer |
| Service | Gateway / Auth / Policy / Billing |
| Related PRD | N/A |
| Related Architecture | ARCH-20260720-001 |
| Created | 2026-07-20 |
| Last Updated | 2026-07-20 |

---

## 2. API Name

Nova AI Gateway API 设计规范

---

## 3. Description

本文档定义 Nova AI Gateway 在 P0 到 P2 阶段的 API 设计基线，包括统一路径规范、认证方式、请求响应结构、错误码、分页约定与示例。

### 使用场景

- 对外提供 OpenAI 兼容模型调用接口
- 对内提供管理后台所需的用户、Provider、模型、API Key、用量、策略接口

### 注意事项

- 所有接口默认返回 JSON
- 对外模型调用接口优先兼容 OpenAI 风格
- 管理后台接口使用 JWT 认证

---

## 4. URL

```text
[Method] /api/v1/[resource]
```

### URL 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | integer | 视接口而定 | 资源标识 |

### Query 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:-----:|------|
| `page` | integer | ❌ | 1 | 页码 |
| `pageSize` | integer | ❌ | 20 | 每页数量 |
| `sortBy` | string | ❌ | `created_at` | 排序字段 |
| `sortOrder` | string | ❌ | `desc` | 排序方向 |

---

## 5. Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| GET | 查询资源 | ✅ |
| POST | 创建资源 / 发起推理请求 | ❌ |
| PUT | 全量更新资源 | ✅ |
| PATCH | 部分更新资源 | ✅ |
| DELETE | 删除或禁用资源 | ✅ |

---

## 6. Authentication

| 方式 | 说明 |
|------|------|
| API Key | 对外模型调用接口，使用 `Authorization: Bearer sk-xxx` |
| JWT | Admin 控制台和后台管理接口 |

### 认证 Header

```text
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
| `admin` | 可管理用户、Provider、模型、策略、预算 |
| `user` | 可管理自己的 API Key、查询自己的用量和日志 |
| `read-only` | 仅允许查询类接口 |

### 权限校验规则

- 管理后台写操作必须校验 `admin`
- 普通用户只能访问自己的资源
- API Key 默认按所属用户和权限范围做隔离

### 授权错误

| 场景 | HTTP Status | Error Code |
|------|:-----------:|:----------:|
| 无权限 | 403 | AUTH004 |
| 资源不允许访问 | 403 | AUTH005 |

---

## 8. Request Header

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|:----:|:-----:|------|
| Authorization | string | ✅ | — | Bearer Token 或 API Key |
| Content-Type | string | ✅ | application/json | 请求类型 |
| Accept-Language | string | ❌ | zh-CN | 语言偏好 |
| X-Request-ID | string | ❌ | — | 请求 ID |
| X-Trace-ID | string | ❌ | — | 链路追踪 ID |

---

## 9. Request Body

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "hello"
    }
  ],
  "temperature": 0.7,
  "stream": false
}
```

### 字段说明

| 字段 | 类型 | 必填 | 验证规则 | 说明 |
|------|------|:----:|---------|------|
| `model` | string | ✅ | 非空 | 逻辑模型编码 |
| `messages` | array | ✅ | 至少 1 项 | 对话消息 |
| `temperature` | number | ❌ | 0~2 | 采样温度 |
| `stream` | boolean | ❌ | - | 是否流式返回 |

---

## 10. Response

### Success Response (200 / 201)

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "chatcmpl-001",
    "model": "gpt-4o-mini",
    "choices": []
  },
  "traceId": "trace-xxx"
}
```

### Response 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | integer | 业务状态码，0 表示成功 |
| `message` | string | 返回消息 |
| `data` | object | 业务数据 |
| `traceId` | string | 链路追踪 ID |

### No Content (204)

用于删除、禁用等成功但无需返回实体的场景。

---

## 11. Error Codes

| Error Code | HTTP Status | 说明 | 处理建议 |
|:----------:|:-----------:|------|---------|
| 0 | 200 | 成功 | — |
| AUTH001 | 401 | 未提供认证信息 | 检查 Authorization Header |
| AUTH002 | 401 | 认证信息无效 | 检查 API Key 或 JWT |
| AUTH004 | 403 | 权限不足 | 检查账号角色 |
| VALID001 | 400 | 参数校验失败 | 检查字段必填与格式 |
| VALID002 | 400 | 参数格式错误 | 检查字段类型 |
| RATE001 | 429 | 请求频率超限 | 降低请求频率 |
| GATEWAY001 | 500 | Gateway 内部错误 | 查看日志和 traceId |
| POLICY001 | 500 | 策略引擎异常 | 检查策略与缓存 |
| ROUTER001 | 500 | 路由引擎异常 | 检查 Provider 状态 |
| BILL001 | 500 | 计费服务异常 | 检查异步任务状态 |

### 错误响应格式

```json
{
  "code": "VALID001",
  "message": "参数校验失败",
  "detail": {
    "field": "model",
    "reason": "model 不能为空"
  },
  "traceId": "trace-xxx"
}
```

---

## 12. Pagination

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:-----:|------|
| `page` | integer | ❌ | 1 | 当前页 |
| `pageSize` | integer | ❌ | 20 | 每页条数，最大 100 |
| `sortBy` | string | ❌ | `created_at` | 排序字段 |
| `sortOrder` | string | ❌ | `desc` | 排序方向 |

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
| `page` | integer | 当前页码 |
| `pageSize` | integer | 每页数量 |
| `total` | integer | 总数 |
| `totalPages` | integer | 总页数 |

---

## 13. Examples

### cURL 示例

```bash
curl -X POST https://api.example.com/api/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "hello"
      }
    ]
  }'
```

### 成功响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "chatcmpl-001",
    "provider": "openai",
    "latencyMs": 1320
  },
  "traceId": "trace-abc123"
}
```

### 错误响应示例

```json
{
  "code": "RATE001",
  "message": "请求频率超限",
  "detail": {
    "limit": "1000 req/min"
  },
  "traceId": "trace-abc123"
}
```

---

## 14. Database Impact

| 表名 | 操作 | 说明 |
|------|------|------|
| `api_keys` | SELECT | 校验 API Key 和权限 |
| `providers` | SELECT | 读取 Provider 配置 |
| `models` | SELECT | 读取逻辑模型定义 |
| `request_logs` | INSERT | 异步记录请求日志 |
| `usage_daily_stats` | UPDATE | 异步更新用量统计 |

### 查询说明

- 主链路优先从 Redis 获取缓存数据
- 统计和日志相关写入尽量走异步事件，不阻塞响应

---

## 15. Cache Strategy

| 缓存项 | Key 模式 | TTL | 失效时机 | 说明 |
|--------|---------|:---:|---------|------|
| API Key 校验结果 | `gateway:apikey:{prefix}` | 5m | Key 状态变更 | 降低数据库压力 |
| Provider 配置 | `router:provider:{id}` | 1m | Provider 修改 | 路由快速读取 |
| 模型绑定关系 | `router:model:{code}` | 1m | 模型绑定修改 | 路由快速选择 |
| 策略结果 | `policy:user:{id}:model:{code}` | 1m | 规则变更 | 减少 Policy 查询延迟 |

---

## 16. 接口清单总览

| 资源 | 典型接口 | 说明 |
|------|----------|------|
| Chat | `POST /api/v1/chat/completions` | 对外推理入口 |
| Models | `GET /api/v1/models` | 查询逻辑模型 |
| API Keys | `GET/POST/PATCH /api/v1/api-keys` | Key 管理 |
| Providers | `GET/POST/PATCH /api/v1/providers` | Provider 管理 |
| Usage | `GET /api/v1/usage` | 用量统计 |
| Logs | `GET /api/v1/logs` | 请求日志查询 |
| Policies | `GET/POST/PATCH /api/v1/policies` | 策略管理 |

---

## 17. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-20 | v1.0 | 初始版本 | Full Stack Engineer |

---

# End

本文档是 Nova AI Gateway 在 P0 到 P2 阶段的 API 设计权威总览。

后续具体接口文档应在本规范基础上按模块展开。
