# API Contract: Student Account System + Billing Module + RBAC

Version: v1.0

Status: Draft

Owner: Architect

Last Updated: 2026-07-25

Related PRD: PRD-20260725-001

---

## 1. Overview

本文档定义学生账号体系、计费模块和 RBAC 权限体系的所有新增和修改的 API 端点。

### 通用规范

- Base URL: `/api/v1`
- 通用响应格式：

```json
{
    "code": 0,
    "message": "success",
    "data": { ... }
}
```

- 错误响应格式：

```json
{
    "code": "ERROR_CODE",
    "message": "错误描述"
}
```

- 认证方式：
  - **JWT**：用于 Admin/Student UI 的 API 调用，在 `Authorization` 头中使用 `Bearer <token>` 格式
  - **API Key**：用于模型 API 调用，在 `Authorization` 头中使用 `Bearer <sk-xxx>` 格式
- 分页请求参数：`page`（默认 1）, `pageSize`（默认 20，最大 100）
- 分页响应格式：

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "items": [...],
        "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 100,
            "totalPages": 5
        }
    }
}
```

---

## 2. Auth 相关（修改）

### POST /api/v1/auth/login

修改：返回体中增加 `role`、`quotaBalance` 字段。

**Request Body：**

```json
{
    "email": "admin@nova.com",
    "password": "password123"
}
```

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 1,
        "email": "admin@nova.com",
        "nickname": "Admin",
        "role": "Admin",
        "quotaBalance": 100.000000,
        "accessToken": "eyJhbGciOiJIUzI1NiIs...",
        "refreshToken": "a1b2c3d4..."
    }
}
```

**新增字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `role` | `string` | 用户角色名称，如 `"Admin"` 或 `"Student"` |
| `quotaBalance` | `number` | 用户当前额度余额，保留 6 位小数 |

**错误码：**

| HTTP Status | Code | Message | 说明 |
|-------------|------|---------|------|
| 401 | AUTH006 | invalid email or password | 邮箱或密码错误 |
| 401 | AUTH003 | account is disabled | 账号被禁用 |

---

### POST /api/v1/auth/register (已废弃)

**状态：DEPRECATED**

**说明：** 不再支持自主注册。保留该端点仅为兼容旧版前端，调用将返回错误提示。建议使用 Admin 专用接口创建账号。

**Response Body (410 Gone)：**

```json
{
    "code": "AUTH007",
    "message": "Registration is no longer supported. Please contact admin."
}
```

---

### GET /api/v1/auth/profile

修改：返回体中增加 `role`、`quotaBalance`、`permissions` 字段。

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 1,
        "email": "admin@nova.com",
        "nickname": "Admin",
        "role": "Admin",
        "quotaBalance": 100.000000,
        "permissions": [
            "dashboard:view",
            "api_key:manage",
            "api_key:create",
            "admin:user:list",
            "admin:role:manage",
            "admin:pricing:manage",
            "admin:billing:view"
        ]
    }
}
```

**新增字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `role` | `string` | 用户角色名称 |
| `quotaBalance` | `number` | 用户当前额度余额 |
| `permissions` | `string[]` | 用户拥有的所有权限代码列表 |

---

## 3. Admin 学生管理 API

所有接口需要 JWT 认证 + RBAC 权限校验。

### GET /api/v1/admin/users

查看学生列表（分页）。仅 Admin 可访问，权限代码：`admin:user:list`

**Query Parameters：**

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 否 | 1 | 页码 |
| `pageSize` | int | 否 | 20 | 每页条数 |
| `search` | string | 否 | — | 搜索关键词（匹配邮箱和昵称） |
| `status` | string | 否 | — | 筛选状态：`active` / `disabled` |

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "items": [
            {
                "id": 2,
                "email": "student1@school.edu",
                "nickname": "张三",
                "role": "Student",
                "userStatus": "active",
                "quotaBalance": 8.500000,
                "createdAt": "2026-07-25T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 50,
            "totalPages": 3
        }
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:list` 权限时返回。

---

### POST /api/v1/admin/users

Admin 创建学生账号。权限代码：`admin:user:create`

**Request Body：**

```json
{
    "email": "newstudent@school.edu",
    "password": "temp123456",
    "nickname": "李四"
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | string | 是 | 学生邮箱，全局唯一 |
| `password` | string | 是 | 初始密码，建议设置临时密码 |
| `nickname` | string | 是 | 学生昵称 |

**Response Body (201 Created)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 3,
        "email": "newstudent@school.edu",
        "nickname": "李四",
        "role": "Student",
        "userStatus": "active",
        "quotaBalance": 0.000000,
        "createdAt": "2026-07-25T12:00:00Z"
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:create` 权限时返回。

**说明：**
- 创建后角色自动为 `Student`，状态为 `active`
- 创建后默认额度为 0，需 Admin 手动分配额度
- 创建后自动生成默认 API Key

**错误码：**

| HTTP Status | Code | Message | 说明 |
|-------------|------|---------|------|
| 403 | AUTH004 | forbidden | 无权限访问该资源 |
| 409 | AUTH005 | email already exists | 邮箱已被使用 |
| 400 | VALID001 | invalid request body | 请求参数校验失败 |

---

### GET /api/v1/admin/users/{id}

查看学生详情。权限代码：`admin:user:list`

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 2,
        "email": "student1@school.edu",
        "nickname": "张三",
        "role": "Student",
        "roleId": 2,
        "userStatus": "active",
        "quotaBalance": 8.500000,
        "totalSpent": 1.500000,
        "totalRequests": 42,
        "createdAt": "2026-07-25T10:00:00Z",
        "updatedAt": "2026-07-25T12:00:00Z"
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:list` 权限时返回。

**新增字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `roleId` | int | 角色 ID |
| `totalSpent` | number | 累计消费总额 |
| `totalRequests` | int | 累计请求次数 |

---

### GET /api/v1/admin/users/{id}/quota

查看学生额度。权限代码：`admin:user:manage_quota`

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 2,
        "email": "student1@school.edu",
        "quotaBalance": 8.500000,
        "totalAllocated": 10.000000,
        "totalSpent": 1.500000,
        "lastTransaction": {
            "id": 100,
            "amount": -0.003200,
            "type": "deduction",
            "createdAt": "2026-07-25T11:30:00Z"
        }
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:manage_quota` 权限时返回。

---

### PUT /api/v1/admin/users/{id}/quota

设置学生额度。权限代码：`admin:user:manage_quota`

**Request Body：**

```json
{
    "amount": 20.000000
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `amount` | number | 是 | 设置的新额度总额（非增量），保留 6 位小数 |

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 2,
        "quotaBalance": 20.000000
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:manage_quota` 权限时返回。

**说明：**
- `amount` 是设置新总额度，不是增量调整
- 设置后会在 `quota_transactions` 中记录一条 `admin_allocation` 类型记录

---

### GET /api/v1/admin/users/{id}/models

查看学生可用模型列表。权限代码：`admin:user:manage_models`

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 2,
        "authorizedModels": [
            {
                "modelId": 1,
                "modelName": "GPT-4o",
                "modelCode": "gpt-4o",
                "authorizedAt": "2026-07-25T10:00:00Z"
            }
        ],
        "allModels": [
            {
                "modelId": 1,
                "modelName": "GPT-4o",
                "modelCode": "gpt-4o",
                "authorized": true
            },
            {
                "modelId": 2,
                "modelName": "DeepSeek V3",
                "modelCode": "deepseek-v3",
                "authorized": false
            }
        ]
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:manage_models` 权限时返回。

---

### PUT /api/v1/admin/users/{id}/models

设置学生可用模型。权限代码：`admin:user:manage_models`

**Request Body：**

```json
{
    "modelIds": [1, 2]
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `modelIds` | int[] | 是 | 授权的模型 ID 列表。传入空数组 `[]` 表示清空所有授权 |

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 2,
        "authorizedModelCount": 2
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:manage_models` 权限时返回。

**说明：**
- 该操作为全量替换，先删除该用户的所有模型授权，再插入新的授权记录

---

### PUT /api/v1/admin/users/{id}/status

启用/禁用学生账号。权限代码：`admin:user:manage`

**Request Body：**

```json
{
    "status": "active"
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `status` | string | 是 | `"active"` 启用 / `"disabled"` 禁用 |

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 2,
        "userStatus": "active"
    }
}
```

**403 Forbidden：** 当前用户无 `admin:user:manage` 权限时返回。

---

## 4. Admin 角色权限管理 API

所有接口需要 JWT 认证 + RBAC 权限校验（权限代码：`admin:role:manage`）。

### GET /api/v1/admin/roles

获取所有角色列表。

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "Admin",
            "description": "系统管理员，拥有全部管理功能权限",
            "isSystem": true,
            "permissionCount": 15,
            "userCount": 1,
            "createdAt": "2026-07-25T00:00:00Z"
        },
        {
            "id": 2,
            "name": "Student",
            "description": "学生用户，仅能使用 API 和查看个人用量",
            "isSystem": true,
            "permissionCount": 5,
            "userCount": 50,
            "createdAt": "2026-07-25T00:00:00Z"
        }
    ]
}
```

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

---

### POST /api/v1/admin/roles

创建新角色。系统内置角色（isSystem=true）不可创建。

**Request Body：**

```json
{
    "name": "TA",
    "description": "助教角色，拥有比 Student 更多的权限"
}
```

**Response Body (201 Created)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 3,
        "name": "TA",
        "description": "助教角色，拥有比 Student 更多的权限",
        "isSystem": false,
        "createdAt": "2026-07-25T12:00:00Z"
    }
}
```

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

---

### GET /api/v1/admin/roles/{id}

获取角色详情（含权限列表）。

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "id": 2,
        "name": "Student",
        "description": "学生用户，仅能使用 API 和查看个人用量",
        "isSystem": true,
        "permissions": [
            {
                "id": 1,
                "code": "dashboard:view",
                "name": "查看仪表盘",
                "module": "dashboard",
                "assigned": true
            },
            {
                "id": 2,
                "code": "api_key:manage",
                "name": "管理 API Key",
                "module": "api_key",
                "assigned": true
            }
        ],
        "createdAt": "2026-07-25T00:00:00Z",
        "updatedAt": "2026-07-25T00:00:00Z"
    }
}
```

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

---

### PUT /api/v1/admin/roles/{id}

更新角色信息。

**Request Body：**

```json
{
    "name": "TA-Updated",
    "description": "更新后的描述"
}
```

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

**约束：** 系统内置角色（isSystem=true）的 `name` 不可修改。

---

### DELETE /api/v1/admin/roles/{id}

删除角色。

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

**约束：**
- 有用户关联的角色不可删除（需先转移用户）
- 系统内置角色（isSystem=true）不可删除

---

### PUT /api/v1/admin/roles/{id}/permissions

更新角色功能权限。

**Request Body：**

```json
{
    "permissionIds": [1, 2, 3, 4, 5]
}
```

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "roleId": 2,
        "permissionCount": 5
    }
}
```

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

**说明：**
- 全量替换：先删除该角色的所有权限关联，再插入新的权限关联

---

### GET /api/v1/admin/permissions

获取所有功能权限列表。

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": [
        {
            "id": 1,
            "code": "dashboard:view",
            "name": "查看仪表盘",
            "description": "访问仪表盘页面",
            "module": "dashboard"
        },
        {
            "id": 2,
            "code": "api_key:manage",
            "name": "管理 API Key",
            "description": "查看和管理 API Key",
            "module": "api_key"
        }
    ]
}
```

**403 Forbidden：** 当前用户无 `admin:role:manage` 权限时返回。

---

## 5. Admin 定价管理 API

所有接口需要 JWT 认证 + RBAC 权限校验（权限代码：`admin:pricing:manage`）。

### GET /api/v1/admin/pricing

查看所有模型定价列表。

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": [
        {
            "id": 1,
            "modelId": 1,
            "modelName": "GPT-4o",
            "modelCode": "gpt-4o",
            "pricingType": "flat",
            "pricePerInputToken": 0.000010,
            "pricePerOutputToken": 0.000030,
            "currency": "USD",
            "peakStart": null,
            "peakEnd": null,
            "peakPricePerInput": null,
            "peakPricePerOutput": null,
            "offpeakPricePerInput": null,
            "offpeakPricePerOutput": null,
            "updatedAt": "2026-07-25T10:00:00Z"
        },
        {
            "id": 2,
            "modelId": 2,
            "modelName": "DeepSeek V3",
            "modelCode": "deepseek-v3",
            "pricingType": "time_based",
            "pricePerInputToken": 0.000005,
            "pricePerOutputToken": 0.000015,
            "currency": "USD",
            "peakStart": "08:00:00",
            "peakEnd": "22:00:00",
            "peakPricePerInput": 0.000005,
            "peakPricePerOutput": 0.000015,
            "offpeakPricePerInput": 0.000002,
            "offpeakPricePerOutput": 0.000006,
            "updatedAt": "2026-07-25T10:00:00Z"
        }
    ]
}
```

**403 Forbidden：** 当前用户无 `admin:pricing:manage` 权限时返回。

---

### GET /api/v1/admin/pricing/{modelId}

查看指定模型的定价详情。

**Response Body (200 OK)：** 返回单个定价对象，结构与上一条相同。

**403 Forbidden：** 当前用户无 `admin:pricing:manage` 权限时返回。

---

### PUT /api/v1/admin/pricing/{modelId}

修改指定模型的定价。

**Request Body（普通定价 `flat`）：**

```json
{
    "pricingType": "flat",
    "pricePerInputToken": 0.000010,
    "pricePerOutputToken": 0.000030,
    "currency": "USD"
}
```

**Request Body（峰谷定价 `time_based`）：**

```json
{
    "pricingType": "time_based",
    "pricePerInputToken": 0.000005,
    "pricePerOutputToken": 0.000015,
    "currency": "USD",
    "peakStart": "08:00:00",
    "peakEnd": "22:00:00",
    "peakPricePerInput": 0.000005,
    "peakPricePerOutput": 0.000015,
    "offpeakPricePerInput": 0.000002,
    "offpeakPricePerOutput": 0.000006
}
```

**403 Forbidden：** 当前用户无 `admin:pricing:manage` 权限时返回。

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pricingType` | string | 是 | `"flat"` 普通定价 / `"time_based"` 峰谷计价 |
| `pricePerInputToken` | number | 是 | 输入 Token 单价 |
| `pricePerOutputToken` | number | 是 | 输出 Token 单价 |
| `currency` | string | 是 | 币种，如 `"USD"`、`"CNY"` |
| `peakStart` | string | time_based 时必填 | 高峰开始时间，HH:MM:SS 格式 |
| `peakEnd` | string | time_based 时必填 | 高峰结束时间，HH:MM:SS 格式 |
| `peakPricePerInput` | number | time_based 时必填 | 高峰时段输入 Token 单价 |
| `peakPricePerOutput` | number | time_based 时必填 | 高峰时段输出 Token 单价 |
| `offpeakPricePerInput` | number | time_based 时必填 | 低谷时段输入 Token 单价 |
| `offpeakPricePerOutput` | number | time_based 时必填 | 低谷时段输出 Token 单价 |

**Response Body (200 OK)：** 返回更新后的定价对象。

---

## 6. Billing 相关 API

### GET /api/v1/billing/quota

当前用户查看自己的额度余额。需要 JWT 认证。

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "userId": 2,
        "email": "student1@school.edu",
        "quotaBalance": 8.500000,
        "totalSpent": 1.500000,
        "totalAllocated": 10.000000
    }
}
```

---

### GET /api/v1/billing/usage

当前用户查看自己的用量明细（分页）。需要 JWT 认证。

**Query Parameters：**

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 否 | 1 | 页码 |
| `pageSize` | int | 否 | 20 | 每页条数，最大 100 |
| `startDate` | string | 否 | — | 开始日期，ISO 8601 格式 |
| `endDate` | string | 否 | — | 结束日期，ISO 8601 格式 |
| `modelCode` | string | 否 | — | 按模型代码筛选 |

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "items": [
            {
                "id": 1001,
                "modelCode": "gpt-4o",
                "providerName": "OpenAI",
                "inputTokens": 150,
                "outputTokens": 42,
                "latencyMs": 1200,
                "costAmount": 0.003200,
                "requestStatus": "success",
                "createdAt": "2026-07-25T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 42,
            "totalPages": 3
        }
    }
}
```

---

### GET /api/v1/billing/admin/summary

Admin 查看全平台用量汇总。权限代码：`admin:billing:view`

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "totalUsers": 50,
        "activeUsers": 45,
        "totalRequests": 10800,
        "todayRequests": 320,
        "todayCost": 15.500000,
        "totalCost": 520.000000,
        "totalTokens": 15000000,
        "todayTokens": 450000,
        "costByModel": [
            {
                "modelCode": "gpt-4o",
                "totalCost": 300.000000,
                "totalRequests": 5000
            },
            {
                "modelCode": "deepseek-v3",
                "totalCost": 220.000000,
                "totalRequests": 5800
            }
        ]
    }
}
```

**403 Forbidden：** 当前用户无 `admin:billing:view` 权限时返回。

---

### GET /api/v1/billing/admin/usage

Admin 查看全平台用量明细。权限代码：`admin:billing:view`

**Query Parameters：**

| 参数 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `page` | int | 否 | 1 | 页码 |
| `pageSize` | int | 否 | 20 | 每页条数 |
| `userId` | int | 否 | — | 按用户 ID 筛选 |
| `startDate` | string | 否 | — | 开始日期 |
| `endDate` | string | 否 | — | 结束日期 |
| `status` | string | 否 | — | 请求状态：`success` / `failed` |

**Response Body (200 OK)：**

```json
{
    "code": 0,
    "message": "success",
    "data": {
        "items": [
            {
                "id": 1001,
                "userId": 2,
                "email": "student1@school.edu",
                "modelCode": "gpt-4o",
                "providerName": "OpenAI",
                "inputTokens": 150,
                "outputTokens": 42,
                "latencyMs": 1200,
                "costAmount": 0.003200,
                "requestStatus": "success",
                "createdAt": "2026-07-25T10:30:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 10800,
            "totalPages": 540
        }
    }
}
```

**403 Forbidden：** 当前用户无 `admin:billing:view` 权限时返回。

---

## 7. 错误码汇总

| HTTP Status | Code | 说明 |
|-------------|------|------|
| 400 | VALID001 | 请求体格式错误或参数校验失败 |
| 401 | AUTH001 | 缺少认证信息 |
| 401 | AUTH002 | Token 无效或过期 |
| 401 | AUTH003 | 账号被禁用 |
| 403 | AUTH004 | 无权限访问该资源（RBAC 权限不足） |
| 402 | QUOTA_EXCEEDED | 账户额度不足 |
| 403 | MODEL_FORBIDDEN | 模型未授权 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | AUTH005 | 邮箱已被使用 |
| 401 | AUTH006 | 邮箱或密码错误 |
| 410 | AUTH007 | 接口已废弃 |
| 409 | CONFLICT | 资源冲突 |
| 500 | GATEWAY001 | 内部服务器错误 |
| 503 | ROUTER001 | 服务不可用 |

---

## 8. 权限代码与接口映射

| 权限代码 | 模块 | 受保护的接口 |
|----------|------|-------------|
| `dashboard:view` | dashboard | GET /api/v1/dashboard |
| `api_key:manage` | api_key | GET /api/v1/api-keys |
| `api_key:create` | api_key | POST /api/v1/api-keys |
| `api_key:delete` | api_key | PATCH /api/v1/api-keys/{id}/revoke |
| `billing:view_self` | billing | GET /api/v1/billing/quota, GET /api/v1/billing/usage |
| `admin:user:list` | user | GET /api/v1/admin/users, GET /api/v1/admin/users/{id} |
| `admin:user:create` | user | POST /api/v1/admin/users |
| `admin:user:manage` | user | PUT /api/v1/admin/users/{id}/status |
| `admin:user:manage_quota` | user | GET/PUT /api/v1/admin/users/{id}/quota |
| `admin:user:manage_models` | user | GET/PUT /api/v1/admin/users/{id}/models |
| `admin:role:manage` | role | All /api/v1/admin/roles/* and /api/v1/admin/permissions |
| `admin:pricing:manage` | pricing | All /api/v1/admin/pricing/* |
| `admin:billing:view` | billing | GET /api/v1/billing/admin/summary, GET /api/v1/billing/admin/usage |
| `admin:provider:manage` | provider | All /api/v1/providers/* |
| `admin:model:manage` | model | All /api/v1/models/* |

---

## 9. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-26 | v1.1 | 1. 统一 Admin 汇总路径为 /billing/admin/*<br/>2. 记录 /auth/register 接口废弃<br/>3. 区分 AUTH001 和 AUTH006 错误码<br/>4. 补全 Admin API 的 403 响应描述<br/>5. 补充定价接口 currency 字段 | Architect |
| 2026-07-25 | v1.0 | 初始版本 | Architect |

---

# End

本文档定义 AI Gateway 学生账号体系、计费模块和 RBAC 权限体系的所有 API 契约。