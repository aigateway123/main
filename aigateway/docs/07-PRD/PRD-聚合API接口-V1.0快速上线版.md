# PRD: 聚合 API 接口 V1.0 快速上线版

Version: v1.0

Status: Draft

Owner: Product Manager

Last Updated: 2026-07-21

Related Workflow: WF-001-Feature

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| PRD ID | PRD-20260721-002 |
| 版本号 | V1.0.0 |
| 版本代号 | Quick Launch |
| Status | Draft |
| Owner | Product Manager |
| Related Workflow | WF-001-Feature |
| Related Task | TBD |
| Created | 2026-07-21 |
| Last Updated | 2026-07-21 |

---

## 2. Product Background

### 行业背景

2025~2026 年，企业已从"我要接一个模型"进入"我要接十几个模型"的时代。多模型（Multi-Model）成为 AI 基础设施的标配。开发者面临的核心问题不再是某个模型好不好，而是如何用一套统一的方式管理、调用多个模型。

对于 Nova AI Gateway 项目而言，当前处于 Phase P0→P1 过渡期。经过前期开发，后端已完成了 Auth、Provider、Model、API Key、Chat 推理等核心业务的骨架代码，前端已完成了除日志详情页外的所有页面。但当前所有数据使用 InMemory 存储，重启即丢失，无法给真实用户使用。

### 用户痛点

| 痛点 | 描述 |
|------|------|
| API 不统一 | OpenAI、Claude、DeepSeek、Gemini 各有一套 API 格式，开发者需为每个 Provider 写适配代码 |
| 管理分散 | 每个 Provider 需要单独注册、充值、管理 Key，缺乏统一管理入口 |
| 无法持久化 | 当前系统使用 InMemory 存储，重启后所有配置和数据丢失 |
| 部署复杂 | 5 个微服务架构对 MVP 阶段过于复杂，运维成本高 |

### 市场需求

Phase 1（MVP）聚焦 **Free + Pro 开发者**，他们的核心诉求是：
- 一个 OpenAI 兼容的 API 地址 = 访问所有大模型
- 统一的 API Key 管理
- Admin 控制台查看用量
- **数据不丢失**，服务可稳定运行

---

## 3. Problem Statement

Nova AI Gateway 需要尽快上线一个可用的版本，让开发者通过一个统一的 OpenAI 兼容 API 访问多个大模型供应商，并通过管理后台管理配置和查看用量。当前代码骨架已具备 65% 功能，但缺乏数据持久化和一键部署能力，无法面向真实用户。

| 问题 | 影响 |
|------|------|
| 数据使用 InMemory 存储 | 重启服务后所有配置和数据丢失，无法给真实用户使用 |
| 5 个微服务架构过于复杂 | 其中 3 个服务（Router/Policy/Billing）为空壳，增加运维负担 |
| 缺乏一键部署能力 | 当前无法通过 `docker compose up` 快速启动 |
| 缺乏 CORS 支持 | 前端无法正常调用后端 API |

### 核心策略

**「先上线，再重构」**——用最短路径跑通全流程，验证产品价值后再补架构债。

| 原则 | 说明 |
|------|------|
| 能用的不重写 | 现有 InMemory 代码能跑的就用，先用 PostgreSQL 替换存储 |
| 能合并的不拆分 | 5 个微服务精简为 Gateway + Auth 两个服务 |
| 能砍的功能先砍 | 流式响应、限流、独立路由服务等非核心功能砍到 V1.1 |
| Docker Compose 优先 | 不引入 K8S 等复杂设施 |

---

## 4. Goals

### 版本目标

- **上线一个可运行的聚合 API 平台**，开发者通过一个 OpenAI 兼容端点访问所有已配置的 Provider
- **数据持久化**，使用 PostgreSQL 替代 InMemory，重启数据不丢失
- **Docker Compose 一键启动**，降低部署门槛
- 提供 Admin 控制台，支持 5 个管理页面（Dashboard、Provider、Model、API Key、请求日志）
- 支持请求日志记录和 Dashboard 用量统计查看

### 非目标（本版本不做）

- ❌ 流式响应（SSE streaming）— V1.1
- ❌ Rate Limiting（请求限流）— V1.1
- ❌ Provider API Key 加密存储 — V1.1
- ❌ 独立 Router Engine 服务 — V1.2
- ❌ 成本/定价引擎 — Phase 2
- ❌ Policy 策略引擎 — Phase 2
- ❌ 多租户/团队管理 — 后续版本
- ❌ REST 响应标准化 — 当前格式够用
- ❌ K8S 容器编排 — 不需要

---

## 5. 版本概览

### 版本命名

| 字段 | 值 |
|------|-----|
| 版本号 | **V1.0.0** |
| 版本代号 | **Quick Launch** |
| 版本定位 | 聚合 API 接口快速上线版 |
| 目标用户 | Free + Pro 开发者 |
| 预估工期 | 5 天 |
| 上线方式 | Docker Compose 单机部署 |

### 功能范围（7 项核心功能）

| 编号 | 功能 | 优先级 | 当前状态 | 备注 |
|:----:|------|:------:|:--------:|------|
| **F1** | 注册 & 登录 | P0 | ✅ 已有骨架 | 用户注册、JWT 登录认证 |
| **F2** | Provider 管理（CRUD） | P0 | ✅ 已有骨架 | 供应商配置增删改查 |
| **F3** | Model 管理（CRUD） | P0 | ✅ 已有骨架 | 逻辑模型增删改查 |
| **F4** | Model-Provider 绑定（含权重配置） | P0 | ✅ 已有骨架 | 将 Model 绑定到 Provider 并配置权重/优先级 |
| **F5** | API Key 管理（创建/吊销） | P0 | ✅ 已有骨架 | API Key 创建、查看、吊销 |
| **F6** | Chat Completions 推理接口（非流式，OpenAI 兼容） | P0 | ⚙️ 80% | 核心推理接口，需完善 Token 解析 |
| **F7** | Dashboard 统计概览 | P0 | ⚙️ 90% | 今日请求数、Token 数、活跃 Key/Provider |

### 完整用户链路

```
注册/登录 → 创建 Provider → 创建 Model → 绑定 Model-Provider
    → 创建 API Key → 使用 API Key 调用 Chat Completions
    → 在 Dashboard 查看用量统计
```

---

## 6. User Story

### 用户角色

| 角色 | 描述 | 权限范围 |
|------|------|---------|
| Admin | 平台管理员，负责配置管理所有资源 | 全部管理功能 |
| Developer | 开发者/API 使用者，通过 API Key 调用推理接口 | 仅调用 Chat API |

### 核心用户故事

#### F1: 注册 & 登录

- 作为 **Admin**，我希望**注册一个账号并登录到 Admin 控制台**，以便**管理我的 Provider、Model 和 API Key 配置**。

#### F2: Provider 管理

- 作为 **Admin**，我希望**在 Admin 后台添加/编辑/删除 Provider（如 OpenAI、Claude、DeepSeek）**，以便**配置可用的模型供应商及其 API 接入信息**。

#### F3: Model 管理

- 作为 **Admin**，我希望**在 Admin 后台添加/编辑/删除逻辑模型**，以便**定义平台支持哪些模型供用户调用**。

#### F4: Model-Provider 绑定

- 作为 **Admin**，我希望**将模型绑定到一个或多个 Provider 上，并配置权重和优先级**，以便**实现模型的自动负载均衡和故障切换**。

#### F5: API Key 管理

- 作为 **Admin**，我希望**在 Admin 后台创建新的 API Key 并随时吊销不再使用的 Key**，以便**控制和管理第三方开发者的 API 访问权限**。

#### F6: Chat Completions 推理接口

- 作为 **Developer**，我希望**使用 OpenAI 兼容的 API 格式发送聊天请求**，以便**无需修改现有代码即可接入平台**。
- 作为 **Developer**，我希望**传递我的 API Key 来认证请求**，以便**确保只有授权用户可以调用 API**。
- 作为 **Developer**，我希望**当绑定的 Provider 故障时自动切换到备用 Provider**，以便**保证服务的可用性**。

#### F7: Dashboard 统计概览

- 作为 **Admin**，我希望**在 Dashboard 上查看今日请求总数、Token 消耗量、活跃 Provider 和 API Key 统计**，以便**快速了解平台的使用概况**。

---

## 7. Functional Requirements

### 优先级定义

| 优先级 | 说明 |
|--------|------|
| P0 | V1.0 必须完成，否则无法上线 |
| P1 | V1.0 建议完成，影响用户体验但可后续补 |
| P2 | 后续版本迭代 |

### P0 — V1.0 必做

| # | 需求描述 | 功能归属 | 备注 |
|---|---------|:--------:|------|
| FR-01 | **POST `/api/v1/auth/register`** — 用户注册 | F1 | 已有实现 |
| FR-02 | **POST `/api/v1/auth/login`** — 用户登录，返回 JWT Token | F1 | 已有实现 |
| FR-03 | **Provider CRUD** — Admin 后台增删改查 Provider（名称、BaseURL、API Key、权重、优先级、状态） | F2 | Controller/Service/Repository 已有 |
| FR-04 | **Model CRUD** — Admin 后台增删改查 Model（名称、编码、状态） | F3 | Controller/Service/Repository 已有 |
| FR-05 | **Model-Provider 绑定** — Admin 后台将 Model 绑定到 Provider，支持权重和优先级配置 | F4 | Controller/Service/Repository 已有 |
| FR-06 | **API Key 管理** — Admin 后台创建、查看、吊销 API Key（格式: `sk-` 前缀） | F5 | Controller/Service/Repository 已有 |
| FR-07 | **POST `/api/v1/chat/completions`** — OpenAI 兼容的非流式推理接口 | F6 | 已有骨架（80%） |
| FR-08 | **API Key 认证** — 请求通过 `Authorization: Bearer sk-xxx` 认证，无效 Key 返回 401 | F6 | 已有实现 |
| FR-09 | **Provider 智能选择** — 按优先级+权重自动选择 Provider，失败自动切换 | F6 | 已有实现 |
| FR-10 | **Dashboard 统计** — 今日请求数、Token 数、活跃 Key/Provider | F7 | 已有实现（90%） |
| FR-11 | **请求日志记录** — 每次推理请求记录 Model、Provider、延迟、状态到数据库 | F6/F7 | 已有骨架，需补全 |
| FR-12 | **数据持久化** — 使用 PostgreSQL 替代 InMemory，5 张核心表 + request_logs | 全部 | **需新增实现** |
| FR-13 | **Docker Compose 一键启动** — 整合 Gateway + Auth + PostgreSQL + Redis + Nginx | 全部 | **需新增实现** |
| FR-14 | **数据库迁移自动运行** — 服务启动时自动执行未完成的迁移 | 全部 | **需新增实现** |
| FR-15 | **CORS 支持** — Admin 前端跨域访问后端 | 全部 | **需新增** |

### P1 — 强烈建议

| # | 需求描述 | 功能归属 | 备注 |
|---|---------|:--------:|------|
| FR-16 | **请求日志 Token 解析** — 从 Provider 响应中提取 Input/Output Token 数 | F6/F7 | 当前为 0 |
| FR-17 | **请求日志列表页面** — Admin 前端查看请求日志列表和详情 | F7 | 前端缺少此页面 |
| FR-18 | **初始化种子数据** — 首次启动时插入默认 Provider（如 OpenAI）配置 | F2 | 减少上手成本 |
| FR-19 | **Provider 状态探活** — 快速检测 Provider 是否可用 | F2 | 健康检查 |

### P2 — V1.1 迭代

| # | 需求描述 | 功能归属 | 备注 |
|---|---------|:--------:|------|
| FR-20 | 流式响应 (`stream: true`) | F6 | V1.1 |
| FR-21 | 请求级限流（Rate Limiting） | 新增 | V1.1 |
| FR-22 | Provider API Key 加密存储 | F2 | V1.1 |
| FR-23 | REST API 标准化响应格式 | 全部 | V1.1 |

---

## 8. Non-functional Requirements

| 类型 | 要求 | 验收标准 |
|------|------|---------|
| 性能 | Gateway 主链路 < 10ms（不含模型推理耗时） | 无 Provider 调用时策略路由耗时 < 10ms |
| 性能 | Provider 路由选择 < 2ms | 路由选择逻辑平均耗时 < 2ms |
| 可用性 | Provider 故障自动切换 | 绑定 2+ Provider 时，主 Provider 不可用自动切换到备用 |
| 兼容性 | OpenAI 兼容 API | 使用 OpenAI SDK（Python/Node.js）可无缝接入 |
| 安全性 | API Key 认证 | 所有 `/api/v1/chat/completions` 请求必须校验 API Key |
| 安全性 | 密码安全 | 密码使用 bcrypt 哈希存储 |
| 持久化 | PostgreSQL 数据持久化 | 重启容器后所有数据完整可读 |
| 部署 | Docker Compose 一键启动 | `docker compose up -d` 后所有服务可访问 |

---

## 9. User Flow

### 主流程：从注册到调用 API 的完整链路

```
1. 用户访问 Admin 控制台
    │
    ▼
2. 注册账号 → 登录（JWT）
    │
    ▼
3. 创建 Provider（如 OpenAI）
    │  ├── 填写名称、BaseURL、API Key
    │  └── 设置权重和优先级
    │
    ▼
4. 创建 Model（如 gpt-4o）
    │
    ▼
5. 绑定 Model → Provider（设置权重）
    │
    ▼
6. 创建 API Key（格式: sk-xxxxxxxx）
    │
    ▼
7. 使用 API Key 调用推理接口
    │  ├── POST /api/v1/chat/completions
    │  ├── Authorization: Bearer sk-xxx
    │  └── { model: "gpt-4o", messages: [...] }
    │
    ▼
8. 查看 Dashboard 统计
       ├── 今日请求数
       ├── Token 消耗量
       └── 活跃 Provider / API Key
```

### 异常流程

| 异常场景 | 处理方式 |
|---------|---------|
| 无效 API Key | 返回 `401 Unauthorized`，错误信息: "invalid API key" |
| 请求的 Model 不存在 | 返回 `400 Bad Request`，错误信息: "model not found" |
| 所有绑定的 Provider 不可用 | 返回 `502 Bad Gateway`，错误信息: "no available provider" |
| Provider 返回错误 | 自动尝试下一个可用 Provider（失败切换），全部失败则返回最后一个错误 |
| 未登录访问管理页面 | 重定向到登录页 |

---

## 10. API Impact

### 对外接口（面向开发者）

| 接口 | Method | 变更类型 | 说明 |
|------|--------|:--------:|------|
| `/api/v1/chat/completions` | POST | ✅ 完善 | OpenAI 兼容推理接口（非流式） |

### 对内接口（面向 Admin）

| 接口 | Method | 变更类型 | 说明 |
|------|--------|:--------:|------|
| `/api/v1/auth/register` | POST | ✅ 已有 | 注册 |
| `/api/v1/auth/login` | POST | ✅ 已有 | 登录 |
| `/api/v1/auth/profile` | GET | ✅ 已有 | 个人信息 |
| `/api/v1/api-keys` | GET | ✅ 已有 | 获取 API Key 列表 |
| `/api/v1/api-keys` | POST | ✅ 已有 | 创建 API Key |
| `/api/v1/api-keys/{id}` | GET | ✅ 已有 | 查看 API Key 详情 |
| `/api/v1/api-keys/{id}/revoke` | PATCH | ✅ 已有 | 吊销 API Key |
| `/api/v1/providers` | GET | ✅ 已有 | 获取 Provider 列表 |
| `/api/v1/providers` | POST | ✅ 已有 | 创建 Provider |
| `/api/v1/providers/{id}` | GET | ✅ 已有 | 查看 Provider 详情 |
| `/api/v1/providers/{id}` | PUT | ✅ 已有 | 更新 Provider |
| `/api/v1/providers/{id}` | DELETE | ✅ 已有 | 删除 Provider |
| `/api/v1/models` | GET | ✅ 已有 | 获取 Model 列表 |
| `/api/v1/models` | POST | ✅ 已有 | 创建 Model |
| `/api/v1/models/{id}` | GET | ✅ 已有 | 查看 Model 详情 |
| `/api/v1/models/{id}` | PUT | ✅ 已有 | 更新 Model |
| `/api/v1/models/{id}` | DELETE | ✅ 已有 | 删除 Model |
| `/api/v1/models/{id}/bind` | POST | ✅ 已有 | 绑定 Provider 到 Model |
| `/api/v1/bindings/{id}` | DELETE | ✅ 已有 | 解绑 Provider |
| `/api/v1/dashboard` | GET | ✅ 已有 | Dashboard 统计概览 |
| `/api/v1/dashboard/recent-logs` | GET | ✅ 已有 | 最近请求日志 |
| `/api/v1/usage/logs` | GET | ✅ 已有 | 请求日志列表 |

### 向后兼容

- 本版本为初始上线版本，不存在向后兼容问题
- 接口格式保持与现有实现一致，不引入破坏性变更

---

## 11. Database Impact

### 核心表（5 张 + 扩展表）

| 表名 | 变更类型 | 说明 | MVP 必要性 |
|------|:--------:|------|:----------:|
| `users` | ✅ 已有迁移 | 系统用户表 | ✅ |
| `api_keys` | ✅ 已有迁移 | API Key 表，前缀查询 | ✅ |
| `providers` | ✅ 已有迁移 | 供应商配置表 | ✅ |
| `models` | ✅ 已有迁移 | 逻辑模型表 | ✅ |
| `model_provider_bindings` | ✅ 已有迁移 | 模型-Provider 绑定关系表（含权重配置） | ✅ |
| `user_sessions` | ✅ 已有迁移 | 用户会话表 | ✅ |
| `request_logs` | ⏸ 待新增迁移 | 请求日志表 + 索引（迁移 003） | ✅ |

### 待新增迁移

| 迁移文件 | 内容 | 优先级 |
|---------|------|:------:|
| `003_request_logs.up.sql` | 创建 `request_logs` 表，包含 model、provider、latency_ms、status、input_tokens、output_tokens、created_at 等字段 | P0 |
| `003_request_logs.down.sql` | 回滚脚本 | P0 |

### 迁移计划

1. 新增 `migrations/003_request_logs.up.sql` 和 `.down.sql`
2. 实现迁移运行器 `internal/database/migrator.go`，启动时自动执行未完成的迁移
3. 实现 PostgreSQL Repository 层，替代现有 InMemory 实现
4. 通过环境变量 `STORAGE_DRIVER=postgres|memory` 切换存储方式

---

## 12. Risks

| # | 风险描述 | 等级 | 可能性 | 影响 | 缓解方案 |
|:-:|---------|:----:|:------:|:----:|---------|
| 1 | Provider API Key 明文存储泄露 | 中 | 中 | 中 | V1.0 阶段仅限内网使用，V1.1 实施加密存储 |
| 2 | 大量请求导致日志表写入压力 | 中 | 低 | 中 | MVP 阶段请求量小，先同步写入，V1.1 异步化 |
| 3 | 不同 Provider 响应格式不兼容 | 中 | 中 | 高 | MVP 只支持 OpenAI 兼容格式的 Provider |
| 4 | InMemory → PostgreSQL 迁移引入数据不一致 | 低 | 中 | 中 | MVP 无生产数据，直接切换即可 |
| 5 | Docker Compose 服务启动顺序问题 | 低 | 低 | 高 | 配置健康检查（healthcheck）确保依赖顺序 |
| 6 | 前端联调发现接口不兼容 | 低 | 中 | 中 | Day 4 预留联调修复时间 |

---

## 13. 实施计划（5 天）

### 总览

| 天数 | 里程碑 | 交付物 | 预估工作量 |
|:----:|--------|--------|:----------:|
| Day 1 | **M1: PostgreSQL Repository 实现** | 5 张核心表的 PG 持久化实现 | 15h |
| Day 2 | **M2: 日志持久化 + 迁移运行器** | request_logs 表迁移 + 自动迁移器 + Token 解析 | 8h |
| Day 3 | **M3: Docker Compose 集成** | Gateway/Auth Dockerfile + docker-compose + Nginx | 8h |
| Day 4 | **M4: CORS + 联调 + 修复** | CORS 中间件 + 前端联调 + 种子数据 | 5h |
| Day 5 | **M5: 测试 + 部署上线** | 端到端测试 + 部署检查 + 正式上线 | 6h |
| **合计** | | | **~42h** |

### Day 1 — PostgreSQL Repository 实现

**目标：** 替换 InMemory，实现 5 张核心表的 PostgreSQL 持久化

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| `internal/repository/postgres.go` | 2h | DB 连接池 + 初始化 + 环境变量读取 |
| `internal/repository/user_repo_pg.go` | 2h | users 表 CRUD |
| `internal/repository/api_key_repo_pg.go` | 3h | api_keys 表 CRUD + 前缀查询 |
| `internal/repository/provider_repo_pg.go` | 2h | providers 表 CRUD |
| `internal/repository/model_repo_pg.go` | 2h | models 表 CRUD |
| `internal/repository/binding_repo_pg.go` | 3h | model_provider_bindings 表 CRUD |
| `internal/repository/session_repo_pg.go` | 1h | user_sessions 表 CRUD |

**设计原则：**
- 使用 `database/sql` 标准库 + PostgreSQL driver，不引入 ORM
- Repository 接口不变，只新增 PostgreSQL 实现
- 通过环境变量 `STORAGE_DRIVER=postgres|memory` 切换存储方式
- 所有 Repository 实现 Repository 接口，便于后续测试

### Day 2 — 日志持久化 + 迁移运行器

**目标：** 请求日志落 PG + 启动自动迁移 + Token 解析

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| 新增 `003_request_logs` 迁移 | 1h | request_logs 表 + 索引 |
| 实现迁移运行器 | 3h | 启动时自动执行未完成的迁移 |
| `internal/repository/log_repo_pg.go` | 2h | 请求日志 PG 实现 |
| `chat_controller.go` Token 解析 | 2h | 从 OpenAI 响应体提取 input/output token 数 |

### Day 3 — Docker Compose 集成

**目标：** 一键启动所有服务

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| Gateway Dockerfile | 2h | 多阶段构建，Go 1.22 |
| Auth Service Dockerfile | 1h | 同上 |
| Nginx 配置 | 2h | 反向代理 + CORS + 健康检查 |
| `infra/docker/docker-compose.yml` | 3h | 整合 Gateway + Auth + PostgreSQL + Redis + Nginx |

### Day 4 — CORS + 联调 + 修复

**目标：** 前端能正常调用后端

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| CORS 中间件 | 1h | 允许前端跨域，支持 OPTIONS 预检请求 |
| 前端联调修复 | 3h | 确保所有 5 个页面 API 调用正常 |
| 初始化种子数据 | 1h | 首次启动时插入默认 Provider（OpenAI）配置 |

### Day 5 — 测试 + 部署上线

**目标：** 上线！

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| 端到端测试 | 3h | 完整链路：注册 → 登录 → 创建 Key → 创建 Provider → 创建 Model → 绑定 → 调用 Chat → 查看 Dashboard |
| 部署检查清单 | 1h | 服务器准备、环境变量、域名、SSL 证书 |
| 正式部署 | 2h | 上传、启动、验证 |

---

## 14. Architecture

### 快速上线版架构（V1.0）

```
                          用户 / 开发者
                              │
                          HTTPS
                              │
                              ▼
                    ┌──────────────────┐
                    │  Nginx (443→80)  │
                    │  反代 + CORS     │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │  Gateway   │  │  Admin    │  │ Auth      │
       │  :8080     │  │  (Vue3)   │  │ Service   │
       │  (含路由)  │  │  :5173    │  │ :8081     │
       └─────┬─────┘  └───────────┘  └─────┬─────┘
             │                              │
             └──────────────┬───────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │  :5432       │
                    └──────────────┘
                    ┌──────────────┐
                    │  Redis       │
                    │  :6379       │
                    └──────────────┘
```

### 关键架构决策

| 决策 | 快速上线版选择 | 后续演进方向 |
|------|--------------|-------------|
| 微服务拆分 | 只部署 Gateway + Auth 两个服务 | V1.2 拆分 Router Engine |
| 服务部署 | 合并部署在一个 Docker Compose 中 | 保持单机，不引入 K8S |
| 数据存储 | PostgreSQL 5 张核心表 + request_logs | 后续可能引入读写分离 |
| 路由逻辑 | 在 Gateway 服务内部实现 | V1.2 拆分为独立 Router Engine |
| Nginx | 反向代理 + CORS | 后续增加 SSL termination |

---

## 15. Acceptance Criteria

### 功能验收标准（Given/When/Then 格式）

#### F1: 注册 & 登录

- **AC-01** Given 用户访问 Admin 控制台，When 填写注册信息并提交，Then 成功创建账号并跳转到登录页
- **AC-02** Given 已注册用户，When 输入正确的邮箱和密码登录，Then 返回 JWT Token 并跳转到 Dashboard
- **AC-03** Given 未注册用户，When 输入错误的登录凭据，Then 返回 401 Unauthorized

#### F2: Provider 管理

- **AC-04** Given Admin 已登录，When 在 Provider 列表页点击"新增"，填写名称、BaseURL、API Key 并提交，Then 新的 Provider 出现在列表中
- **AC-05** Given 存在 Provider，When 点击编辑并修改配置，Then 修改内容保存成功
- **AC-06** Given 存在未绑定的 Provider，When 点击删除，Then Provider 从列表中移除

#### F3: Model 管理

- **AC-07** Given Admin 已登录，When 在 Model 列表页新增 Model（名称 + 编码），Then 新的 Model 出现在列表中
- **AC-08** Given 存在 Model，When 编辑 Model 的属性（如状态启用/禁用），Then 修改生效

#### F4: Model-Provider 绑定

- **AC-09** Given 存在 Model 和多个 Provider，When 将 Model 绑定到 2+ Provider 并设置权重，Then 绑定关系正确保存
- **AC-10** Given Model 已绑定 Provider，When 调用 Chat API 时指定该 Model，Then 按权重分配请求到对应的 Provider

#### F5: API Key 管理

- **AC-11** Given Admin 已登录，When 在 API Key 管理页点击"创建 Key"，Then 生成一个 `sk-` 前缀的 Key
- **AC-12** Given 存在活跃的 API Key，When 点击"吊销"，Then Key 状态变为已吊销，无法用于 API 调用
- **AC-13** Given 已吊销的 API Key，When 使用该 Key 调用 Chat API，Then 返回 401

#### F6: Chat Completions 推理接口

- **AC-14** Given 有效的 API Key 和已配置的 Model，When 发送 `POST /api/v1/chat/completions` 请求（OpenAI 格式），Then 返回 OpenAI 兼容格式的响应
- **AC-15** Given API Key 无效或缺失，When 调用 Chat API，Then 返回 401
- **AC-16** Given 请求的 Model 不存在，When 调用 Chat API，Then 返回 400 错误
- **AC-17** Given Model 绑定了多个 Provider 且主 Provider 不可用，When 调用 Chat API，Then 自动切换到备选 Provider 并返回成功响应

#### F7: Dashboard 统计概览

- **AC-18** Given 已有请求日志，When 访问 Dashboard 页，Then 正确展示今日请求总数、Token 消耗量、活跃 Provider 和 API Key 数量
- **AC-19** Given 没有任何请求日志，When 访问 Dashboard 页，Then 展示空状态提示而不是报错

#### 系统级验收

- **AC-20** Given Docker Compose 已配置，When 执行 `docker compose up -d`，Then 所有服务（Nginx、Gateway、Auth、PostgreSQL、Redis）成功启动
- **AC-21** Given 服务已运行，When 重启所有容器，Then 之前创建的所有数据（用户、Provider、Model、Key）仍然存在
- **AC-22** Given Admin 前端，When 通过浏览器访问 Nginx 地址，Then 前端页面正常加载且所有 API 调用正常

---

## 16. 后续规划

### V1.1 — 体验增强（上线后第 1~2 周）

| 功能 | 说明 | 预估 |
|------|------|:----:|
| 流式响应（SSE streaming） | 支持 `stream: true` 参数，流式返回 | 3天 |
| Rate Limiting（请求限流） | 基于 API Key 的请求频率限制 | 2天 |
| Provider API Key 加密存储 | 使用 AES 对 Provider 的 API Key 加密存储 | 1天 |
| 日志详情页（前端） | 独立的请求日志详情查看页面 | 2天 |
| REST 响应标准化 | 统一 `{code, message, data, traceId}` 格式 | 1天 |
| **合计** | | **~9天** |

### V1.2 — 架构健康（上线后第 3~4 周）

| 功能 | 说明 | 预估 |
|------|------|:----:|
| 拆分 Router Engine 独立服务 | 将路由逻辑从 Gateway 拆出 | 3天 |
| Redis 缓存集成 | 缓存 Provider 配置、路由结果，减少数据库查询 | 2天 |
| 请求日志异步写入 | 引入消息队列，日志异步落库 | 2天 |
| Provider 自动探活 | 定期检查 Provider 健康状态 | 1天 |
| **合计** | | **~8天** |

### V2.0 — Phase 2 Policy Platform（上线后第 5~8 周）

| 功能 | 说明 | 预估 |
|:----:|------|:----:|
| Policy Engine | 策略引擎，支持自定义路由策略（按价格/速度/延迟） | 5天 |
| Cost Engine | 成本引擎，追踪每个请求的实际费用 | 3天 |
| Pricing 配置 | 定价管理，支持按 Model/Token 定价 | 3天 |
| Budget 管理 | 预算额度设置和跟踪 | 2天 |
| Alert 告警 | 预算超支、Provider 故障告警 | 2天 |
| 审计日志 | 操作审计日志 | 2天 |
| **合计** | | **~17天** |

### 演进路线总览

```
V1.0 ──→ V1.1 ──→ V1.2 ──→ V2.0
│         │         │         │
│ 上线    体验增强   架构健康   Phase 2
│         │         │         │
│ 7 项    流式响应   拆分      Policy Engine
│ 核心功能  限流     Router    Cost Engine
│         API Key   Redis     Pricing
│         加密      缓存      Budget/Alert
│         日志详情   异步日志
│
时间线:
├── 第 1 周 ──→ 第 2~3 周 ──→ 第 4~5 周 ──→ 第 6~9 周
```

---

## 17. Open Questions

| # | 问题 | 提出者 | 状态 | 结论 |
|:-:|------|--------|:----:|------|
| 1 | Auth Service 是否合并到 Gateway？ | Architect | 待讨论 | V1.0 保持独立部署，降低后续拆分成本 |
| 2 | Nginx 是否必须？还是直接暴露 Gateway 端口？ | Backend Engineer | 待讨论 | 建议加 Nginx，为后续 HTTPS 做准备 |
| 3 | 是否需要强制使用 PostgreSQL？还是允许部分表继续使用 InMemory？ | Backend Engineer | 待讨论 | 核心 5 张表 + 日志表必须用 PG，Session 可继续 InMemory |
| 4 | Dashboard 数据是否需要实时？还是可接受几分钟延迟？ | Product Manager | 待讨论 | V1.0 实时查询，V1.1 改为异步聚合 |

---

## 18. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-21 | v1.0 | 初始版本 — V1.0 Quick Launch 完整 PRD | Product Manager |

---

# End
