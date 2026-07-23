# PRD: 聚合 API 接口（MVP）

Version: v1.0

Status: Draft

Owner: Product Manager

Last Updated: 2026-07-21

Related Workflow: WF-001

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| PRD ID | PRD-20260721-001 |
| Version | v1.0 |
| Status | Draft |
| Owner | Product Manager |
| Related Workflow | WF-001 |
| Related Task | TBD |
| Created | 2026-07-21 |
| Last Updated | 2026-07-21 |

---

## 2. Product Background

### 行业背景

2025~2026 年，企业已从"我要接 GPT"进入"我要接十几个模型"的时代。多模型（Multi-Model）成为 AI 基础设施的标配。开发者面临的核心问题不再是某个模型好不好，而是如何用一套统一的方式管理、调用多个模型。

### 用户痛点

| 痛点 | 描述 |
|------|------|
| API 不统一 | OpenAI、Claude、Gemini、DeepSeek 各有一套 API 格式 |
| 管理分散 | 每个 Provider 需要单独注册、充值、管理 Key |
| 稳定性差 | 单 Provider 故障直接影响业务 |
| 成本失控 | 无法追踪各模型的实际消耗 |

### 市场需求

Phase 1 (MVP) 聚焦 **Free + Pro 开发者**，他们的核心诉求是：
- 一个 OpenAI 兼容的 API 地址 = 访问所有大模型
- 统一的 API Key 管理
- Admin 控制台查看用量

---

## 3. Problem Statement

开发者需要一种方式，通过 **一个统一的 OpenAI 兼容 API** 访问多个大模型供应商，并能够通过管理后台查看用量、管理配置。

| 问题 | 影响 |
|------|------|
| 多个 Provider API 不统一 | 开发者需为每个 Provider 写适配代码，开发效率低 |
| 缺乏统一管理入口 | 无法集中管理 API Key、Provider 配置、模型映射 |
| 无法跟踪用量 | 开发者不知道每个模型消耗了多少 Token 和费用 |
| 单点故障风险 | 依赖单一 Provider，故障时业务完全中断 |

---

## 4. Goals

### 产品目标

- 上线一个可运行的聚合 API 接口，开发者通过一个 OpenAI 兼容端点访问所有已配置的 Provider
- 提供 Admin 控制台，支持 Provider、Model、API Key 的 CRUD 管理
- 支持请求日志和用量统计的查看

### 非目标

- ❌ 流式响应（streaming）— 放到 V1.1
- ❌ 智能路由策略（按价格/速度/延迟）— 当前只支持权重+优先级
- ❌ 成本引擎和定价配置 — 属于 Phase 2
- ❌ Policy 策略引擎 — 属于 Phase 2
- ❌ 预算管理和告警 — 属于 Phase 2

---

## 5. Functional Requirements

### 优先级定义

| 优先级 | 说明 |
|--------|------|
| P0 | MVP 必须完成，否则无法上线 |
| P1 | MVP 建议完成，影响用户体验但可后续补 |
| P2 | 锦上添花，MVP 后可快速迭代 |

### P0 — MVP 必做

| # | 需求描述 | 备注 |
|---|---------|------|
| FR-01 | **POST `/api/v1/chat/completions`** — OpenAI 兼容的非流式推理接口 | 已有骨架，需完善 |
| FR-02 | **API Key 认证** — 请求通过 `Authorization: Bearer sk-xxx` 认证 | 已有实现 |
| FR-03 | **Provider 管理** — Admin 后台增删改查 Provider（名称、BaseURL、API Key、权重、优先级） | CRUD 已有 |
| FR-04 | **Model 管理** — Admin 后台增删改查 Model（名称、编码、状态） | CRUD 已有 |
| FR-05 | **Model-Provider 绑定** — Admin 后台将 Model 绑定到 Provider，支持权重配置 | 已有 |
| FR-06 | **Provider 智能选择** — 按优先级+权重自动选择 Provider，失败自动切换 | 已有实现 |
| FR-07 | **请求日志记录** — 每次请求记录 Model、Provider、延迟、状态到数据库 | 已有骨架，需补全 Token/成本 |
| FR-08 | **Admin 登录** — JWT 登录认证 | 已有 |
| FR-09 | **Dashboard 统计** — 今日请求数、Token 数、成本、延迟、活跃 Key/Provider | 已有 |
| FR-10 | **API Key 管理** — Admin 后台创建、查看、吊销 API Key | 已有 |
| FR-11 | **数据持久化** — 使用 PostgreSQL 替代 InMemory 存储所有数据 | 需实现 |
| FR-12 | **Docker Compose 一键启动** — 包含 PostgreSQL + Redis + 5 个后端服务 | 需实现 |
| FR-13 | **数据库迁移自动运行** — 服务启动时自动执行迁移 | 需实现 |
| FR-14 | **CORS 支持** — Admin 前端跨域访问后端 | 需新增 |

### P1 — 强烈建议

| # | 需求描述 | 备注 |
|---|---------|------|
| FR-15 | **请求日志 Token 解析** — 从 Provider 响应中提取 Input/Output Token 数 | 当前是 0 |
| FR-16 | **请求日志查看页面** — Admin 前端查看请求历史和详情 | 前端缺少此页面 |
| FR-17 | **Provider 状态探活** — 快速检测 Provider 是否可用 | 健康检查 |
| FR-18 | **REST API 标准化响应** — 统一返回 `{code, message, data, traceId}` 格式 | 部分接口未对齐 |

### P2 — 后续迭代

| # | 需求描述 | 备注 |
|---|---------|------|
| FR-19 | 流式响应 (`stream: true`) | 性能提升 |
| FR-20 | 请求级限流（Rate Limiting） | 防滥用 |
| FR-21 | Provider API Key 加密存储 | 安全加固 |
| FR-22 | 请求错误映射到标准错误码 | 体验优化 |
| FR-23 | Router Engine 独立服务 | 架构一致性 |

---

## 6. Non-functional Requirements

| 类型 | 要求 | 验收标准 |
|------|------|---------|
| 性能 | Gateway 主链路 < 10ms（不含模型推理） | 无 Provider 调用时策略路由耗时 < 10ms |
| 性能 | 路由选择 < 2ms | Provider 选择逻辑耗时 < 2ms |
| 可用性 | Provider 故障自动切换 | 绑定 2+ Provider，主 Provider 断开时自动切换到备用 |
| 兼容性 | OpenAI 兼容 API | 使用 OpenAI SDK 可无缝接入 |
| 安全性 | API Key 认证 | 所有推理接口必须校验 API Key |
| 部署 | 单机 Docker Compose 一键启动 | `docker compose up -d` 后所有服务可访问 |

---

## 7. Architecture & Flow

### 请求处理流程

```
用户请求 (OpenAI 格式)
    │
    ▼
┌─────────────────────────────┐
│  Nginx (反向代理 / CORS)    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Gateway (端口 8080)        │
│  ├── 1. 校验 API Key        │
│  ├── 2. 解析请求体 (model)   │
│  ├── 3. Router 选择 Provider│
│  │    └── 按优先级+权重排序  │
│  ├── 4. 转发请求到 Provider  │
│  ├── 5. 记录请求日志         │
│  └── 6. 返回响应            │
└─────────────────────────────┘
```

### Provider 选择逻辑

```
1. 根据 model_code 查找 Model
2. 查找 Model 绑定的所有激活 Provider
3. 按优先级 (Priority, 越小越优先) + 权重 (Weight, 越大越优先) 排序
4. 依次尝试，第一个可用的返回
5. 如果请求失败，自动尝试下一个（失败切换）
```

### 服务架构

```
Docker Compose
    │
    ├── Nginx          → 反向代理 (端口 80/443)
    ├── Gateway        → API 入口 (端口 8080)
    ├── Auth Service   → 认证服务 (端口 8081)
    ├── Router Engine  → 路由服务 (端口 8082)
    ├── Policy Engine  → 策略引擎 (端口 8083, MVP 占位)
    ├── Billing Service→ 计费服务 (端口 8085, MVP 占位)
    ├── PostgreSQL 15  → 数据库 (端口 5432)
    └── Redis 7        → 缓存 (端口 6379)
```

---

## 8. Data Model

### 核心表（已有迁移文件）

| 表名 | 说明 | MVP 必要性 |
|------|------|:----------:|
| `users` | 用户 | ✅ |
| `organizations` | 组织 | ⏸ (预留) |
| `api_keys` | API Key | ✅ |
| `providers` | 供应商配置 | ✅ |
| `models` | 逻辑模型 | ✅ |
| `model_provider_bindings` | 模型-Provider 绑定 | ✅ |
| `user_sessions` | 用户会话 | ✅ |
| `request_logs` | 请求日志 | ✅（需要追加 `cost_amount` 字段） |

### 待新增迁移

| 迁移 | 内容 | 优先级 |
|------|------|:------:|
| `003_request_logs` | 补充 `request_logs` 表和索引 | P0 |
| `004_seed_data` | 初始种子数据（可选） | P1 |

---

## 9. API Impact

### 对外接口（面向开发者）

| 接口 | Method | 变更类型 | 说明 |
|------|--------|:--------:|------|
| `/api/v1/chat/completions` | POST | 完善 | OpenAI 兼容推理接口 |

### 对内接口（面向 Admin）

| 接口 | Method | 变更类型 | 说明 |
|------|--------|:--------:|------|
| `/api/v1/auth/register` | POST | ✅ 已有 | 注册 |
| `/api/v1/auth/login` | POST | ✅ 已有 | 登录 |
| `/api/v1/auth/profile` | GET | ✅ 已有 | 个人信息 |
| `/api/v1/api-keys` | GET/POST | ✅ 已有 | API Key 管理 |
| `/api/v1/api-keys/{id}/revoke` | PATCH | ✅ 已有 | 吊销 Key |
| `/api/v1/providers` | GET/POST | ✅ 已有 | Provider 管理 |
| `/api/v1/providers/{id}` | GET/PUT | ✅ 已有 | Provider 详情/修改 |
| `/api/v1/models` | GET/POST | ✅ 已有 | Model 管理 |
| `/api/v1/models/{id}` | GET/PUT | ✅ 已有 | Model 详情/修改 |
| `/api/v1/models/{id}/bind` | POST | ✅ 已有 | 绑定 Provider |
| `/api/v1/bindings/{id}` | DELETE | ✅ 已有 | 解绑 Provider |
| `/api/v1/dashboard` | GET | ✅ 已有 | Dashboard 统计 |
| `/api/v1/dashboard/recent-logs` | GET | ✅ 已有 | 最近请求 |
| `/api/v1/usage/logs` | GET | ✅ 已有 | 请求日志列表 |

---

## 10. UI / Pages

### MVP 页面清单

| 页面 | 路由 | 状态 | 说明 |
|------|------|:----:|------|
| 登录页 | `/login` | ✅ 已有 | Admin 登录 |
| Dashboard | `/dashboard` | ✅ 已有 | 用量概览 |
| Provider 管理 | `/providers` | ✅ 已有 | CRUD Provider |
| Model 管理 | `/models` | ✅ 已有 | CRUD Model + Provider 绑定 |
| API Key 管理 | `/api-keys` | ✅ 已有 | CRUD API Key |
| 请求日志页 | `/usage/logs` | ❌ 需新增 | 请求日志列表 |

---

## 11. Implementation Plan

### Milestone

| 里程碑 | 交付物 | 负责人 | 预估工作量 |
|--------|--------|--------|:----------:|
| M1: 后端数据持久化 | PostgreSQL Repository 实现 + 迁移运行器 + 日志表迁移 | Backend Engineer | 3~4天 |
| M2: API 完善 | Token 解析 + CORS + 响应标准化 + 错误码对齐 | Backend Engineer | 2~3天 |
| M3: Docker Compose 集成 | 5 服务 Dockerfile + docker-compose + Nginx 配置 | Backend Engineer | 2天 |
| M4: Admin 前端 | 日志查看页面 + 与后端联调 | Frontend Engineer | 1~2天 |
| M5: 集成测试 + 部署 | 端到端测试 + 部署上线 | QA + DevOps | 1~2天 |
| **合计** | | | **~10~13 天** |

### 实施顺序

```
M1 ──→ M2 ──→ M3 ──→ M4 ──→ M5
          │
          └──→ M3 和 M4 可并行
```

---

## 12. Acceptance Criteria

### 功能验收

- [ ] 用户通过 `POST /api/v1/chat/completions` 发送 OpenAI 格式请求，返回正确响应
- [ ] 用户使用 `Authorization: Bearer sk-xxx` 认证，无效 Key 返回 401
- [ ] Admin 后台可创建/编辑/删除 Provider
- [ ] Admin 后台可创建/编辑/删除 Model
- [ ] Admin 后台可将 Model 绑定到 Provider 并设置权重
- [ ] Model 绑定多个 Provider 时，主 Provider 故障自动切换到备用
- [ ] 每次推理请求记录日志，包含 Token 数、延迟、状态
- [ ] Dashboard 正确展示统计指标
- [ ] API Key 可创建、查看、吊销
- [ ] 重启服务后数据不丢失（PostgreSQL 持久化）

### 非功能验收

- [ ] `docker compose up -d` 一键启动所有服务
- [ ] Admin 前端可正常登录和操作
- [ ] 路由选择耗时 < 2ms
- [ ] API 响应符合统一格式 `{code, message, data, traceId}`

---

## 13. Existing Code vs. TODO 对照表

| 模块 | 已有内容 | 待完成 |
|------|---------|--------|
| **Chat 推理** | 非流式推理骨架、API Key 校验、Provider 选择、请求转发 | 从响应解析 Token 数、计算成本 |
| **Provider** | Controller/Service/Repository CRUD，InMemory 实现 | PostgreSQL Repository 实现 |
| **Model** | Controller/Service/Repository CRUD，InMemory 实现 | PostgreSQL Repository 实现 |
| **API Key** | Controller/Service/Repository CRUD，InMemory 实现 | PostgreSQL Repository 实现 |
| **Auth** | 注册、登录、Profile，InMemory 实现 | PostgreSQL Repository 实现 |
| **Usage/Dashboard** | Dashboard 统计、Recent Logs、Log 列表，InMemory 实现 | PostgreSQL Repository 实现 |
| **数据库** | 001/002 迁移文件 | 003_request_logs 迁移 + 启动自动迁移 |
| **Docker** | PostgreSQL + Redis compose | 5 个 Go 服务的 Dockerfile + compose 集成 |
| **前端** | Login/Dashboard/Provider/Model/ApiKeys 页面 | 日志详情页 |
| **Nginx** | 空目录 | CORS 代理配置 |
| **基础设施** | — | 迁移运行器、健康检查 |

---

## 14. Risks

| # | 风险描述 | 等级 | 可能性 | 缓解方案 |
|---|---------|:----:|:------:|---------|
| 1 | Provider API Key 明文存储泄露 | 中 | 中 | MVP 阶段仅限内网使用，V2 加密 |
| 2 | 大量请求导致日志表写入压力 | 中 | 低 | MVP 阶段请求量小，先同步写入，V2 异步化 |
| 3 | 不同 Provider 响应格式不兼容 | 中 | 中 | MVP 只支持 OpenAI 兼容格式的 Provider |
| 4 | InMemory → PostgreSQL 迁移引入数据不一致 | 低 | 中 | MVP 无生产数据，直接切换即可 |

---

## 15. Open Questions

| # | 问题 | 状态 | 结论 |
|---|------|:----:|------|
| 1 | MVP 阶段是否需要支持流式响应？ | 待讨论 | 建议 P1，需评估 SSE 实现成本 |
| 2 | 是否需要 Nginx？还是直接暴露 Gateway 端口？ | 待讨论 | 建议加 Nginx，为后续 HTTPS 做准备 |
| 3 | 是否需要独立的 Router Engine 服务？ | 待讨论 | 当前路由逻辑在 Gateway 内，MVP 可接受 |

---

## 16. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-21 | v1.0 | 初始版本 | Product Manager |

---

# End
