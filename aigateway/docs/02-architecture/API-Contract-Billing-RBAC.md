# API Contract: 学生账号体系 + 计费模块 + 权限体系

Version: v1.0

Status: Draft

Owner: Architect

Last Updated: 2026-07-25

Related Architecture: ARCH-20260725-001

---

## 1. Overview

本文档定义学生账号管理、RBAC 权限管理和计费模块所有新增接口的请求/响应结构体。

### 通用约定

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **认证方式**: JWT（Bearer Token），通过 `Authorization: Bearer <token>` 传递
- **通用响应格式**:

```go
package types

type APIResponse[T any] struct {
    Code    int    `json:"code"`    // 0=成功, 非0=错误码
    Message string `json:"message"` // "success" 或错误描述
    Data    T      `json:"data"`    // 泛型数据
}
```

- **分页响应格式**:

```go
type PaginatedResponse[T any] struct {
    Items      []T   `json:"items"`
    Total      int64 `json:"total"`
    Page       int   `json:"page"`
    PageSize   int   `json:"pageSize"`
    TotalPages int   `json:"totalPages"`
}
```

- **错误响应格式**（非标准路径，如 402/403）：

```json
{
  "code": "QUOTA_EXCEEDED",
  "message": "账户额度不足，请联系管理员充值",
  "balance": 0.50,
  "estimatedCost": 1.20
}
```

### 错误码定义

| HTTP 状态码 | Code | 说明 |
|------------|------|------|
| 400 | VALID001 | 请求参数校验失败 |
| 401 | AUTH001/AUTH002 | 未认证或 Token 无效 |
| 402 | QUOTA_EXCEEDED | 额度不足 |
| 403 | PERM_DENIED | 权限不足（权限码缺失） |
| 403 | MODEL_FORBIDDEN | 模型未授权 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如邮箱已存在） |
| 500 | INTERNAL | 服务器内部错误 |

---

## 2. Student Management APIs (Admin)

### 2.1 创建学生账号

`POST /api/v1/admin/users`

**权限码**: `admin:user:create`

**Request**:

```go
package dto

type AdminCreateUserRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=6"`
    Nickname string `json:"nickname" validate:"required"`
}
```

**Response (201 Created)**:

```go
type AdminCreateUserResponse struct {
    ID        int64  `json:"id"`
    Email     string `json:"email"`
    Nickname  string `json:"nickname"`
    RoleID    int64  `json:"roleId"`
    RoleName  string `json:"roleName"` // "Student"
    UserStatus string `json:"userStatus"`
    CreatedAt string `json:"createdAt"`
}
```

### 2.2 学生列表

`GET /api/v1/admin/users?page=1&pageSize=20&keyword=&status=`

**权限码**: `admin:user:list`

**Query Parameters**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 20，最大 100 |
| keyword | string | 否 | 搜索关键字（匹配邮箱/昵称） |
| status | string | 否 | 筛选状态：active / disabled |

**Response (200)**:

```go
type AdminUserListItem struct {
    ID            int64   `json:"id"`
    Email         string  `json:"email"`
    Nickname      string  `json:"nickname"`
    RoleID        int64   `json:"roleId"`
    RoleName      string  `json:"roleName"`
    UserStatus    string  `json:"userStatus"`
    QuotaBalance  float64 `json:"quotaBalance"`
    QuotaTotal    float64 `json:"quotaTotal"` // 累计分配总额度
    CreatedAt     string  `json:"createdAt"`
    LastActiveAt  *string `json:"lastActiveAt,omitempty"`
}

// 使用通用分页响应
type AdminUserListResponse = PaginatedResponse[AdminUserListItem]
```

### 2.3 查看学生额度

`GET /api/v1/admin/users/{id}/quota`

**权限码**: `admin:user:manage_quota`

**Response (200)**:

```go
type AdminUserQuotaResponse struct {
    UserID       int64   `json:"userId"`
    Email        string  `json:"email"`
    QuotaBalance float64 `json:"quotaBalance"` // 当前余额
    QuotaTotal   float64 `json:"quotaTotal"`   // 累计分配总额
    QuotaUsed    float64 `json:"quotaUsed"`    // 累计使用总额
    UpdatedAt    string  `json:"updatedAt"`
}
```

### 2.4 设置学生额度

`PUT /api/v1/admin/users/{id}/quota`

**权限码**: `admin:user:manage_quota`

**Request**:

```go
type AdminSetQuotaRequest struct {
    Amount float64 `json:"amount" validate:"required,min=0"` // 增加的额度金额
}
```

**Response (200)**:

```go
type AdminSetQuotaResponse struct {
    UserID       int64   `json:"userId"`
    QuotaBalance float64 `json:"quotaBalance"` // 设置后余额
    Amount       float64 `json:"amount"`       // 本次增加金额
    CreatedAt    string  `json:"createdAt"`
}
```

### 2.5 查看学生模型授权

`GET /api/v1/admin/users/{id}/models`

**权限码**: `admin:user:manage_models`

**Response (200)**:

```go
type AdminUserModelsResponse struct {
    UserID    int64              `json:"userId"`
    Email     string             `json:"email"`
    Models    []UserModelItem    `json:"models"`
}

type UserModelItem struct {
    ModelID    int64  `json:"modelId"`
    ModelName  string `json:"modelName"`
    ModelCode  string `json:"modelCode"`
    Authorized bool   `json:"authorized"` // true=已授权, false=未授权
}
```

### 2.6 设置学生模型授权

`PUT /api/v1/admin/users/{id}/models`

**权限码**: `admin:user:manage_models`

**Request**:

```go
type AdminSetUserModelsRequest struct {
    ModelIDs []int64 `json:"modelIds" validate:"required"` // 授权的模型 ID 列表（全量覆盖）
}
```

**Response (200)**:

```go
type AdminSetUserModelsResponse struct {
    UserID    int64  `json:"userId"`
    ModelIDs  []int64 `json:"modelIds"` // 当前已授权的模型 ID 列表
    UpdatedAt string  `json:"updatedAt"`
}
```

### 2.7 启禁用学生账号

`PUT /api/v1/admin/users/{id}/status`

**权限码**: `admin:user:manage`

**Request**:

```go
type AdminUpdateUserStatusRequest struct {
    Status string `json:"status" validate:"required,oneof=active disabled"` // active / disabled
}
```

**Response (200)**:

```go
type AdminUpdateUserStatusResponse struct {
    UserID     int64  `json:"userId"`
    Email      string `json:"email"`
    UserStatus string `json:"userStatus"`
    UpdatedAt  string `json:"updatedAt"`
}
```

---

## 3. Role & Permission APIs (Admin)

### 3.1 角色列表

`GET /api/v1/admin/roles`

**权限码**: `admin:role:manage`

**Response (200)**:

```go
type RoleListItem struct {
    ID          int64  `json:"id"`
    Name        string `json:"name"`
    Description string `json