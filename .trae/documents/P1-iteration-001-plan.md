# P1 迭代 #001 规划：学生账号 + 计费模块 + 权限体系

## 概述

在 MVP 基础上进行 P1 阶段的第一次迭代，新增三个核心模块：
1. **学生账号体系** — 允许学生注册，Admin 可分配额度
2. **计费模块** — 按用量计费，额度不足时拒绝 API 调用
3. **权限体系** — 完整 RBAC（角色 + 功能权限 + 数据权限）

## 需求规模评估

| 维度 | 评估 |
|------|------|
| 等级 | **S2**（模块开发） |
| 预估工作量 | 3~5 天 |
| 涉及层面 | 数据库、后端 API、前端页面、中间件 |
| 风险点 | 计费精度、并发扣费、权限兼容性 |

## 第一阶段：需求分析（当前阶段）

### 目标
Product Manager 产出需求文档，经用户确认后进入下一阶段。

### 产出物
| 文档 | 内容 | 模板 |
|------|------|------|
| PRD | 产品需求文档，含功能列表、用户故事、验收标准 | `06-templates/prd-template.md` |
| 功能清单 | 按模块拆分的功能列表及优先级 | — |
| 原型设计 | 关键页面的低保真原型 | — |

### 用户决策记录
| 决策项 | 结论 |
|--------|------|
| 额度定义 | 费用金额（如 $10/账号） |
| 权限体系 | 完整 RBAC（角色 + 功能 + 数据权限） |
| 学生模型范围 | Admin 指定可用模型列表 |

---

## 第二阶段：架构设计（PM 文档确认后）

### 产出物
| 文档 | 内容 |
|------|------|
| ADR | 架构决策记录（DB 设计、API 设计、权限模型） |
| 数据库迁移 | 新增表的 SQL 迁移文件 |
| API 契约 | 所有新增/修改的 API 定义 |

### 关键设计点
1. **数据库**：新增 `roles`、`permissions`、`role_permissions`、`user_roles`、`user_quota`、`billing_records` 等表
2. **API 设计**：
   - `POST /api/v1/auth/register/student` — 学生注册
   - `GET/PUT /api/v1/admin/users/{id}/quota` — Admin 管理学生额度
   - `GET /api/v1/billing/usage` — 查看用量
   - `POST /api/v1/admin/roles` — 角色管理 CRUD
3. **中间件**：新增 `PermissionMiddleware` 校验功能权限
4. **计费流程**：Chat Completion 完成后异步扣费，并发场景使用乐观锁

---

## 第三阶段：实现

### 后端（Backend Engineer）

| 模块 | 文件/变更 | 说明 |
|------|-----------|------|
| DB 迁移 | `backend/migrations/` | 新增 2-3 个迁移文件 |
| Entity | `internal/entity/` | 新增 Role, Permission, Quota, Billing 等实体 |
| Repository | `internal/repository/` | 新增对应 Repository |
| Service | `internal/service/` | 新增 BillingService, PermissionService |
| Controller | `internal/controller/` | 新增学生注册、额度管理、计费查询等端点 |
| Middleware | `internal/middleware/` | 新增 PermissionMiddleware |
| Router | `cmd/gateway/main.go` | 注册新路由 |

### 前端（Frontend Engineer）

| 模块 | 文件/变更 | 说明 |
|------|-----------|------|
| 路由 | `router/index.ts` | 新增角色管理、额度管理页面路由 |
| 页面 | `pages/` | 新增：学生管理、额度分配、角色管理、用量明细 |
| Store | `stores/` | 新增：billingStore, permissionStore |
| API | `api/` | 新增：billing.ts, admin.ts, role.ts |

---

## 第四阶段：审查与测试

| 阶段 | 角色 | 内容 |
|------|------|------|
| Code Review | Reviewer | 所有代码变更审查 |
| 功能测试 | QA | 学生注册、额度分配、计费扣费、权限校验 |
| 验收测试 | QA | 按验收标准逐条验证 |

---

## 验证步骤

1. `go build ./...` — 后端编译通过
2. `pnpm build` — 前端构建通过
3. 启动服务，通过 `curl` 测试：
   - 学生注册 → 生成 JWT
   - Admin 分配额度 → 数据库额度更新
   - 学生调用 API → 扣费成功 → 额度减少
   - 额度不足 → 返回 402/403
4. Admin 前端操作流程完整
