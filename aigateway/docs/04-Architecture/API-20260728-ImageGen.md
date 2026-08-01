# API: 图片生成（Image Generation）模型接口契约

Version: v1.0

Status: Draft

Owner: Full Stack Engineer

Last Updated: 2026-07-28

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| API ID | API-20260728-ImageGen |
| Version | v1.0 |
| Status | Draft |
| Owner | Full Stack Engineer |
| Service | API Gateway |
| Related PRD | PRD-20260728-ImageGen |
| Related Architecture | ARCH-20260728-ImageGen |
| Created | 2026-07-28 |
| Last Updated | 2026-07-28 |

---

## 2. 通用约定

### 认证方式

| 方式 | 适用场景 | Header |
|------|---------|--------|
| API Key | 模型 API 调用接口（`/v1/images/generations`） | `Authorization: Bearer <api_key>` |
| JWT Bearer Token | Admin 管理接口（`/api/v1/models`, `/api/v1/admin/pricing` 等） | `Authorization: Bearer <jwt_token>` |

### 响应格式

所有 API 遵循统一响应格式：

```json
{
    "code": 0,
    "message": "success",
    "data": { ... },
    "traceId": "trace-xxx"
}
```

### 错误响应格式

```json
{
    "code": "ERROR_CODE",
    "message": "错误描述",
    "detail": {
        "field": "field_name",
        "reason": "具体原因"
    },
    "traceId": "trace-xxx"
}
```

### 公共错误码

| Error Code | HTTP Status | 说明 | 处理建议 |
|:----------:|:-----------:|------|---------|
| AUTH001 | 401 | 未提供认证信息 | 检查 Authorization header |
| AUTH002 | 401 | 认证信息无效 | 检查 API Key 或 Token |
| AUTH003 | 401 | 认证信息已过期 | 重新获取 Token |
| AUTH004 | 403 | 无权限 | 检查账号权限 |
| VALID001 | 400 | 参数校验失败 | 检查请求参数 |
| RATE001 | 429 | 请求频率超限 | 降低请求频率 |
| GATEWAY001 | 500 | Gateway 内部错误 | 联系运维 |
| BILL001 | 500 | 计费服务异常 | 联系运维 |

---

## 3. 图片生成 —— POST /v1/images/generations

### Description

生成图片。遵循 OpenAI `/v1/images/generations` API 规范，接收文本 prompt 生成对应图片。

### 使用场景

- 开发者通过 OpenAI 兼容的 API 调用图片生成模型
- 支持指定模型、生成张数、图片尺寸、返回格式

### 注意事项

- 请求超时时间 120s
- `n` 参数最大值取决于具体 Provider 能力，默认为 1
- 不支持的 `size` 返回 400 Bad Request
- 部分成功时，`data` 中只包含成功生成的图片

---

### URL

```
POST /v1/images/generations
```

### Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| POST | 创建图片生成任务 | ❌ |

### Authentication

| 方式 | 说明 |
|------|------|
| API Key | 通过 `Authorization: Bearer <api_key>` 认证 |

### Request Header

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|:----:|:-----:|------|
| Authorization | string | ✅ | — | Bearer <api_key> |
| Content-Type | string | ✅ | application/json | 固定值 |

### Request Body

```json
{
    "model": "glm-image",
    "prompt": "一只穿着西装的猫在喝咖啡，数字绘画风格",
    "n": 2,
    "size": "1024x1024",
    "response_format": "url",
    "user": "user-123"
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 验证规则 | 说明 |
|------|------|:----:|:-----:|---------|------|
| model | string | ✅ | — | 必须为系统中已配置的 image 类型模型 | 模型名称/编码 |
| prompt | string | ✅ | — | 1 ~ 4000 字符 | 图片描述文本 |
| n | integer | ❌ | 1 | 1 ~ 10（取决于 Provider） | 生成的图片数量 |
| size | string | ❌ | "1024x1024" | 支持的尺寸之一 | 图片尺寸，如 "1024x1024", "512x512" |
| response_format | string | ❌ | "url" | "url" / "b64_json" | 返回图片数据格式 |
| user | string | ❌ | — | max 255 字符 | 可选用户标识，用于跟踪 |

### Success Response (200)

```json
{
    "created": 1722163200,
    "data": [
        {
            "url": "https://api.nova-ai.com/v1/files/image-abc123.png",
            "revised_prompt": "一只穿着正式西装的猫优雅地拿着咖啡杯，数字绘画风格，高细节"
        },
        {
            "url": "https://api.nova-ai.com/v1/files/image-abc124.png",
            "revised_prompt": "一只穿着正式西装的猫优雅地拿着咖啡杯，数字绘画风格，高细节"
        }
    ],
    "usage": {
        "prompt_tokens": 24,
        "total_tokens": 24,
        "image_count": 2
    }
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| created | integer | 创建时间戳（Unix 时间戳，秒级） |
| data | array | 图片数据列表 |
| data[].url | string | 图片下载 URL（response_format="url" 时返回） |
| data[].b64_json | string | Base64 编码的图片数据（response_format="b64_json" 时返回） |
| data[].revised_prompt | string | 可选，供应商优化后的 prompt |
| usage.prompt_tokens | integer | prompt 消耗的 token 数（如 Provider 支持） |
| usage.total_tokens | integer | 总 token 数 |
| usage.image_count | integer | 实际生成的图片张数（用于计费） |

### Error Response

#### 400 — 参数错误

```json
{
    "code": "VALID001",
    "message": "参数校验失败",
    "detail": {
        "field": "size",
        "reason": "不支持的图片尺寸，支持的尺寸：[\"1024x1024\", \"512x512\"]"
    },
    "traceId": "trace-abc123"
}
```

#### 402 — 余额不足

```json
{
    "code": "BILL002",
    "message": "余额不足",
    "detail": {
        "balance": 0.05,
        "required": 0.2
    },
    "traceId": "trace-abc123"
}
```

#### 504 — Provider 超时

```json
{
    "code": "GATEWAY003",
    "message": "Provider 请求超时",
    "detail": {
        "provider": "智谱GLM",
        "timeout": 120
    },
    "traceId": "trace-abc123"
}
```

### 错误码

| Error Code | HTTP Status | 说明 | 处理建议 |
|:----------:|:-----------:|------|---------|
| VALID001 | 400 | 参数校验失败 | 检查请求参数 |
| VALID002 | 400 | 不支持的 size | 检查 size 参数 |
| AUTH002 | 401 | API Key 无效 | 检查 API Key |
| BILL002 | 402 | 余额不足 | 充值后重试 |
| RATE001 | 429 | 请求频率超限 | 降低请求频率 |
| GATEWAY003 | 504 | Provider 超时 | 重试或检查 Provider 状态 |
| GATEWAY004 | 502 | Provider 错误 | 检查 Provider API 状态 |

### Examples

```bash
curl -X POST https://api.nova-ai.com/v1/images/generations \
  -H "Authorization: Bearer sk-xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-image",
    "prompt": "一只穿着西装的猫在喝咖啡",
    "n": 1,
    "size": "1024x1024"
  }'
```

---

## 4. 获取模型列表 —— GET /api/v1/models

### Description

获取所有可用的模型列表。新增 `modelType` 字段以区分模型类型。

### 使用场景

- Admin 后台展示模型列表，可按类型筛选
- 开发者查看可用模型

---

### URL

```
GET /api/v1/models
```

### Query 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:-----:|------|
| modelType | string | ❌ | — | 筛选模型类型：`chat` / `image` / `embedding` |
| page | integer | ❌ | 1 | 页码 |
| pageSize | integer | ❌ | 20 | 每页数量 |

### Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| GET | 获取模型列表 | ✅ |

### Authentication

| 方式 | 说明 |
|------|------|
| JWT Bearer Token | Admin 后台接口，需要管理员权限 |

### Success Response (200)

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "items": [
            {
                "id": 1,
                "modelName": "GLM-Image",
                "modelCode": "glm-image",
                "modelType": "image",
                "modelStatus": "active",
                "description": "智谱 GLM 图片生成模型",
                "createdAt": "2026-07-28T10:00:00Z",
                "updatedAt": "2026-07-28T10:00:00Z"
            },
            {
                "id": 2,
                "modelName": "GPT-4o",
                "modelCode": "gpt-4o",
                "modelType": "chat",
                "modelStatus": "active",
                "description": "OpenAI GPT-4o 文本对话模型",
                "createdAt": "2026-07-01T10:00:00Z",
                "updatedAt": "2026-07-01T10:00:00Z"
            },
            {
                "id": 3,
                "modelName": "wan2.7-image-pro",
                "modelCode": "wan2.7-image-pro",
                "modelType": "image",
                "modelStatus": "active",
                "description": "阿里万相图片生成模型",
                "createdAt": "2026-07-28T10:00:00Z",
                "updatedAt": "2026-07-28T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 3,
            "totalPages": 1
        }
    },
    "traceId": "trace-abc123"
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| items[].id | integer | 模型 ID |
| items[].modelName | string | 模型显示名称 |
| items[].modelCode | string | 模型编码，API 调用时使用 |
| items[].modelType | string | **新增** 模型类型：`chat` / `image` / `embedding`，默认 `chat` |
| items[].modelStatus | string | 模型状态：`active` / `inactive` |
| items[].description | string | 模型描述 |
| items[].createdAt | string | 创建时间 (ISO 8601) |
| items[].updatedAt | string | 更新时间 (ISO 8601) |

### 向后兼容说明

- `modelType` 为新增字段，已有模型默认返回 `modelType: "chat"`
- 现有客户端忽略该字段不会产生任何问题

---

## 5. 创建模型 —— POST /api/v1/models

### Description

创建新模型。支持指定 `modelType` 以创建图片生成等非 Chat 类型模型。

---

### URL

```
POST /api/v1/models
```

### Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| POST | 创建模型 | ❌ |

### Authentication

| 方式 | 说明 |
|------|------|
| JWT Bearer Token | Admin 后台接口，需要管理员权限 |

### Request Body

```json
{
    "modelName": "GLM-Image",
    "modelCode": "glm-image",
    "modelType": "image",
    "description": "智谱 GLM 图片生成模型"
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 验证规则 | 说明 |
|------|------|:----:|:-----:|---------|------|
| modelName | string | ✅ | — | 1 ~ 128 字符 | 模型显示名称 |
| modelCode | string | ✅ | — | 1 ~ 64 字符，字母数字下划线 | 模型编码，全局唯一 |
| modelType | string | ❌ | "chat" | `chat` / `image` / `embedding` | **新增** 模型类型 |
| description | string | ❌ | "" | max 512 字符 | 模型描述 |

### Success Response (201)

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 4,
        "modelName": "GLM-Image",
        "modelCode": "glm-image",
        "modelType": "image",
        "modelStatus": "active",
        "description": "智谱 GLM 图片生成模型",
        "createdAt": "2026-07-28T10:00:00Z",
        "updatedAt": "2026-07-28T10:00:00Z"
    },
    "traceId": "trace-abc123"
}
```

### 错误码

| Error Code | HTTP Status | 说明 |
|:----------:|:-----------:|------|
| VALID001 | 400 | 参数校验失败（如 modelName 为空） |
| VALID003 | 409 | 模型编码已存在 |

---

## 6. 更新模型 —— PUT /api/v1/models/{id}

### Description

更新现有模型的属性，包括 `modelType`。

---

### URL

```
PUT /api/v1/models/{id}
```

### URL 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| id | integer | ✅ | 模型 ID |

### Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| PUT | 更新模型 | ✅ |

### Authentication

| 方式 | 说明 |
|------|------|
| JWT Bearer Token | Admin 后台接口，需要管理员权限 |

### Request Body

```json
{
    "modelName": "GLM-Image-v2",
    "modelType": "image",
    "description": "智谱 GLM 图片生成模型 v2 版本"
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 验证规则 | 说明 |
|------|------|:----:|---------|------|
| modelName | string | ❌ | 1 ~ 128 字符 | 模型显示名称 |
| modelType | string | ❌ | `chat` / `image` / `embedding` | **新增** 模型类型 |
| description | string | ❌ | max 512 字符 | 模型描述 |
| modelStatus | string | ❌ | `active` / `inactive` | 模型状态 |

> 注意：`modelCode` 不可修改。

### Success Response (200)

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 4,
        "modelName": "GLM-Image-v2",
        "modelCode": "glm-image",
        "modelType": "image",
        "modelStatus": "active",
        "description": "智谱 GLM 图片生成模型 v2 版本",
        "createdAt": "2026-07-28T10:00:00Z",
        "updatedAt": "2026-07-28T12:00:00Z"
    },
    "traceId": "trace-abc123"
}
```

### 错误码

| Error Code | HTTP Status | 说明 |
|:----------:|:-----------:|------|
| VALID001 | 400 | 参数校验失败 |
| VALID004 | 404 | 模型不存在 |

---

## 7. 设置定价 —— PUT /api/v1/admin/pricing/{modelId}

### Description

设置或更新模型的定价信息。新增 `pricingUnit` 和 `unitPrice` 字段以支持按张数等非 Token 计费。

### 使用场景

- Admin 后台为 Chat 模型设置 Token 计费价格
- Admin 后��为 Image 模型设置按张数计费价格
- Admin 后台为 Image 模型设置不同分辨率下的阶梯定价

---

### URL

```
PUT /api/v1/admin/pricing/{modelId}
```

### URL 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| modelId | integer | ✅ | 模型 ID |

### Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| PUT | 设置定价（全量覆盖） | ✅ |

### Authentication

| 方式 | 说明 |
|------|------|
| JWT Bearer Token | Admin 后台接口，需要管理员权限 |

### Request Body

#### Chat 模型定价（Token 计费）

```json
{
    "pricingType": "flat",
    "pricingUnit": "token",
    "pricePerInputToken": 0.000003,
    "pricePerOutputToken": 0.000015
}
```

#### Image 模型定价（按张数计费）

```json
{
    "pricingType": "flat",
    "pricingUnit": "image_count",
    "unitPrice": {
        "per_image": 0.1,
        "resolutions": {
            "512x512": 0.05,
            "1024x1024": 0.1,
            "1024x1792": 0.15
        }
    }
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:-----:|------|
| pricingType | string | ✅ | — | 定价类型：`flat`（固定价）/ `time_based`（峰谷定价） |
| pricingUnit | string | ❌ | "token" | **新增** 计价单位：`token` / `image_count` / `request` |
| pricePerInputToken | float | ❌* | — | 输入 Token 单价（pricingUnit="token" 时必填） |
| pricePerOutputToken | float | ❌* | — | 输出 Token 单价（pricingUnit="token" 时必填） |
| unitPrice | object | ❌* | — | **新增** 按单位计价的详细价格（pricingUnit != "token" 时必填） |
| unitPrice.per_image | float | ❌* | — | 每张图片的基础单价 |
| unitPrice.resolutions | object | ❌ | — | 不同分辨率的阶梯单价，key 为尺寸字符串 |

> `*` 标记：根据 `pricingUnit` 不同，必填字段不同。

### Success Response (200)

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "modelId": 4,
        "pricingType": "flat",
        "pricingUnit": "image_count",
        "unitPrice": {
            "per_image": 0.1,
            "resolutions": {
                "512x512": 0.05,
                "1024x1024": 0.1,
                "1024x1792": 0.15
            }
        },
        "updatedAt": "2026-07-28T12:00:00Z"
    },
    "traceId": "trace-abc123"
}
```

### 计费逻辑说明

```go
// 伪代码：计费计算逻辑
func CalculateCost(pricing *ModelPricing, usage *ImageUsage, size string) float64 {
    switch pricing.PricingUnit {
    case "token":
        return pricing.PricePerInputToken*float64(usage.InputTokens) +
               pricing.PricePerOutputToken*float64(usage.OutputTokens)
    case "image_count":
        // 按分辨率查找单价
        price := pricing.UnitPrice.PerImage
        if resolutionPrice, ok := pricing.UnitPrice.Resolutions[size]; ok {
            price = resolutionPrice
        }
        return price * float64(usage.ImageCount)
    default:
        return 0
    }
}
```

### 错误码

| Error Code | HTTP Status | 说明 |
|:----------:|:-----------:|------|
| VALID001 | 400 | 参数校验失败（如 pricingType 不合法） |
| VALID004 | 404 | 模型不存在 |

---

## 8. 绑定 Provider —— POST /api/v1/models/{id}/bind

### Description

为模型绑定一个 Provider。新增 `apiPathOverride` 字段，允许同一 Provider 为不同类型模型指定不同的 API 路径。

### 使用场景

- 为 Image 模型绑定 Provider，并指定图片生成的 API 路径（如 `/v1/images/generations`）
- 多个模型共用同一 Provider 但使用不同 API 路径

---

### URL

```
POST /api/v1/models/{id}/bind
```

### URL 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| id | integer | ✅ | 模型 ID |

### Method

| Method | 说明 | 幂等 |
|--------|------|:----:|
| POST | 创建绑定关系 | ❌ |

### Authentication

| 方式 | 说明 |
|------|------|
| JWT Bearer Token | Admin 后台接口，需要管理员权限 |

### Request Body

```json
{
    "providerId": 1,
    "weight": 100,
    "apiPathOverride": "/v1/images/generations"
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 验证规则 | 说明 |
|------|------|:----:|:-----:|---------|------|
| providerId | integer | ✅ | — | 必须存在 | Provider ID |
| weight | integer | ❌ | 100 | 1 ~ 100 | 权重，用于负载均衡 |
| apiPathOverride | string | ❌ | NULL | — | **新增** 覆盖 Provider 的默认 API 路径；为 NULL 时使用 Provider 的 `api_path` 字段 |

### Success Response (201)

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 10,
        "modelId": 4,
        "providerId": 1,
        "providerName": "智谱GLM",
        "weight": 100,
        "apiPathOverride": "/v1/images/generations",
        "bindingStatus": "active",
        "createdAt": "2026-07-28T12:00:00Z"
    },
    "traceId": "trace-abc123"
}
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 绑定关系 ID |
| modelId | integer | 模型 ID |
| providerId | integer | Provider ID |
| providerName | string | Provider 名称 |
| weight | integer | 权重 |
| apiPathOverride | string | **新增** 覆盖的 API 路径，NULL 表示使用 Provider 默认路径 |
| bindingStatus | string | 绑定状态：`active` / `inactive` |
| createdAt | string | 创建时间 (ISO 8601) |

### 路由选择逻辑

```
当 RouterService 为模型选择 Provider 时：

1. 筛选 binding_status = 'active' 的绑定关系
2. 按权重轮询选择 Provider
3. 如果 binding.api_path_override 不为 NULL，使用该路径作为 API 端点
4. 否则使用 Provider.api_path 作为 API 端点
```

### 错误码

| Error Code | HTTP Status | 说明 |
|:----------:|:-----------:|------|
| VALID001 | 400 | 参数校验失败 |
| VALID004 | 404 | 模型或 Provider 不存在 |
| VALID005 | 409 | 该绑定关系已存在 |

---

## 9. 错误码汇总

| Error Code | HTTP Status | 说明 | 适用 API |
|:----------:|:-----------:|------|----------|
| AUTH001 | 401 | 未提供认证信息 | 所有 |
| AUTH002 | 401 | 认证信息无效 | 所有 |
| AUTH003 | 401 | 认证信息已过期 | `/api/v1/*` |
| AUTH004 | 403 | 无权限 | `/api/v1/admin/*` |
| VALID001 | 400 | 参数校验失败 | 所有 |
| VALID002 | 400 | 不支持的 size | `/v1/images/generations` |
| VALID003 | 409 | 模型编码已存在 | `POST /api/v1/models` |
| VALID004 | 404 | 资源不存在 | `PUT /api/v1/models/{id}`, `PUT /api/v1/admin/pricing/{modelId}`, `POST /api/v1/models/{id}/bind` |
| VALID005 | 409 | 绑定关系已存在 | `POST /api/v1/models/{id}/bind` |
| BILL002 | 402 | 余额不足 | `/v1/images/generations` |
| RATE001 | 429 | 请求频率超限 | 所有对外 API |
| GATEWAY003 | 504 | Provider 超时 | `/v1/images/generations` |
| GATEWAY004 | 502 | Provider 错误 | `/v1/images/generations` |
| GATEWAY001 | 500 | Gateway 内部错误 | 所有 |

---

## 10. Database Impact

| 表名 | 操作 | 说明 |
|------|------|------|
| `models` | INSERT / SELECT / UPDATE | `GET /api/v1/models` 查询；`POST /api/v1/models` 插入；`PUT /api/v1/models/{id}` 更新 |
| `model_provider_bindings` | INSERT / SELECT | `POST /api/v1/models/{id}/bind` 插入；路由查询绑定关系 |
| `model_pricing` | INSERT / SELECT / UPDATE | `PUT /api/v1/admin/pricing/{modelId}` 更新；计费时查询定价 |
| `request_logs` | INSERT | 计费完成后写入请求日志 |

---

## 11. Cache Strategy

| 缓存项 | Key 模式 | TTL | 失效时机 | 说明 |
|--------|---------|:---:|---------|------|
| 模型列表 | `models:all` | 5min | 模型增删改时 | `GET /api/v1/models` 可缓存 |
| 模型信息 | `model:{modelCode}` | 5min | 模型更新时 | 路由查询使用 |
| 定价配置 | `pricing:{modelId}` | 10min | 定价更新时 | 计费查询使用 |
| 绑定关系 | `binding:{modelId}:{providerId}` | 5min | 绑定关系更新时 | 路由选择使用 |

---

## 12. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-28 | v1.0 | 初始版本 | Full Stack Engineer |

---

# End

本模板依据 AI Company Document Standard 和 Engineering Standard 设计。

所有 API 文档必须基于此模板创建。
