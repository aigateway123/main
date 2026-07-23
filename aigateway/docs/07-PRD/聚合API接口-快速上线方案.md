# 聚合 API 接口 — 快速上线方案

Version: v1.0

Status: Draft

Owner: AI Project Manager

Last Updated: 2026-07-21

---

## 1. 核心策略

**「先上线，再重构」**——用最短路径跑通全流程，验证产品价值后再补架构债。

### 策略原则

| 原则 | 说明 |
|------|------|
| 能用的不重写 | 现有 InMemory 代码能跑的就用，不追求一步到位到 PostgreSQL |
| 能合并的不拆分 | 5 个微服务精简为必要的服务，降低运维复杂度 |
| 能砍的功能先砍 | 非核心功能（流式、限流、独立路由服务）一律砍到 V2 |
| Docker Compose 优先 | 不引入 K8S 等复杂设施 |

---

## 2. 现状评估

### 代码完整度

```
                      已有骨架    待完成
Chat 推理接口          ████████░░  80%
Provider CRUD          ██████████  100%
Model CRUD             ██████████  100%
API Key CRUD           ██████████  100%
Auth 登录注册          ██████████  100%
Dashboard 统计         █████████░  90%
请求日志记录           ██████░░░░  60%
数据持久化             ░░░░░░░░░░   0%
Docker Compose 集成    ██░░░░░░░░  20%
前端页面               ████████░░  80%

总进度 ≈ 65%
```

### 关键发现

1. **所有业务逻辑已在 Gateway 服务内完成** — Auth/Router/Policy/Billing 四个独立服务全是空壳，仅跑了个 health check
2. **InMemory 存储能跑但重启丢数据** — MVP 演示可行，给真实用户用需要持久化
3. **前端缺一个页面**（日志详情页），其他都已实现
4. **数据库设计和迁移文件已就绪** — 只需实现 PostgreSQL Repository

---

## 3. 两版方案对比

| 维度 | 🚀 快速上线版 (5~7天) | 🏗 完整 MVP 版 (10~13天) |
|------|:--------------------:|:-----------------------:|
| 目标 | **尽快上线，让用户用起来** | 架构完整，打好基础 |
| 部署服务 | **2 个 Go 服务** (Gateway + Auth) | 5 个 Go 服务 |
| 数据存储 | **PostgreSQL 5 张核心表** | 全部 PostgreSQL |
| 请求日志 | 同步记录，含 Token 数 | 同步记录 + Token + 成本 |
| 前端 | 5 个页面，日志看板用 Dashboard 替代 | 增加日志详情页 |
| 流式响应 | ❌ 不支持 | ❌ 不支持 |
| 架构债 | 中等（后续需拆分服务） | 低 |
| 风险 | 低（已验证的技术方案） | 低 |
| **上线时间** | **5~7 天** | 10~13 天 |

---

## 4. 快速上线版 — 具体计划

### 架构决策

```
快速上线版架构                    后续重构方向
═══════════════════               ═══════════════════
                                   ┌──────────┐
┌──────────┐        ┌──────────┐   │ Router   │
│  Nginx   │ ───→   │ Gateway  │   │ Engine   │
│ (反代+   │        │ (含路由+ │   └──────────┘
│  CORS)   │        │  Auth)   │
└──────────┘        └────┬─────┘   ┌──────────┐
                         │         │ Auth     │
                         ▼         │ Service  │
                   ┌──────────┐    └──────────┘
                   │PostgreSQL│
                   │ Redis    │    ┌──────────┐
                   └──────────┘    │ Policy   │
                                   │ Engine   │
                         ┌─────┐   └──────────┘
                         │OpenAI│
                         │Claude│   ┌──────────┐
                         │Deep- │   │ Billing  │
                         │Seek..│   │ Service  │
                         └─────┘   └──────────┘
```

**关键决策：**

| 决策 | 选择 | 理由 |
|------|------|------|
| 微服务拆分 | **只部署 Gateway + Auth** | 其他 3 个服务为空壳，不增加运维负担 |
| 存储 | **PostgreSQL 5 张核心表** | 用户/Key/Provider/Model/Binding 必须持久化 |
| Auth 服务 | **合并到 Gateway 或独立部署** | Gateway 已有 auth 能力，可以独立也可以合并 |
| 前端 | **5 个页面上线，日志复用 Dashboard** | 日志详情页 V2 再做 |

### Day 1 — PostgreSQL Repository 实现

**目标：** 替换 InMemory，实现 5 张核心表的 PostgreSQL 持久化

| 文件/模块 | 工作量 | 说明 |
|-----------|:------:|------|
| `internal/repository/user_repo_pg.go` | 2h | users 表 CRUD |
| `internal/repository/api_key_repo_pg.go` | 3h | api_keys 表 CRUD + 前缀查询 |
| `internal/repository/provider_repo_pg.go` | 2h | providers 表 CRUD |
| `internal/repository/model_repo_pg.go` | 2h | models 表 CRUD |
| `internal/repository/binding_repo_pg.go` | 3h | model_provider_bindings 表 CRUD |
| `internal/repository/session_repo_pg.go` | 1h | user_sessions 表 |
| `internal/repository/postgres.go` | 2h | DB 连接池 + 初始化 |

**设计原则：**
- 使用 `database/sql` + `lib/pq`，不引入 ORM（后续重构时再考虑）
- Repository 接口不变，只新增 PostgreSQL 实现
- 通过环境变量切换存储方式（`STORAGE_DRIVER=postgres|memory`）

### Day 2 — Request Log 持久化 + 迁移运行器

**目标：** 请求日志落 PG + 启动自动迁移

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| 新增 `003_request_logs` 迁移 | 1h | request_logs 表 + 索引 |
| 实现迁移运行器 | 3h | 启动时自动执行未完成的迁移 |
| `request_log_repo_pg.go` | 2h | 请求日志 PG 实现 |
| `chat_controller.go` Token 解析 | 2h | 从 OpenAI 响应体提取 token 数 |

### Day 3 — Docker Compose 集成

**目标：** 一键启动所有服务

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| Gateway Dockerfile | 2h | 多阶段构建，Go 1.22 |
| Auth Service Dockerfile | 1h | 同上 |
| Nginx 配置 | 2h | 反向代理 + CORS + 健康检查 |
| `infra/docker/docker-compose.yml` | 3h | 整合所有服务 + 依赖顺序 + 健康检查 |

### Day 4 — CORS + 联调 + 修复

**目标：** 前端能正常调用后端

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| CORS 中间件 | 1h | 允许前端跨域 |
| 前端联调修复 | 3h | 确保所有 API 调用正常 |
| 初始化种子数据 | 1h | 首次启动时插入默认 Provider 配置 |

### Day 5 — 集成测试 + 部署上线

**目标：** 上线！

| 任务 | 工作量 | 说明 |
|------|:------:|------|
| 端到端测试 | 3h | 注册→登录→创建Key→创建Provider→调用Chat→查看Dashboard |
| 部署检查清单 | 1h | 服务器准备、环境变量、域名、SSL |
| 部署 | 2h | 上传、启动、验证 |

### 总工作量

```
Day 1: PostgreSQL Repo 实现       ████████████████░░░░  15h
Day 2: 日志持久化 + 迁移运行器     ████████░░░░░░░░░░░░   8h
Day 3: Docker Compose 集成         ████████░░░░░░░░░░░░   8h
Day 4: CORS + 联调 + 修复          █████░░░░░░░░░░░░░░░   5h
Day 5: 测试 + 部署                  ██████░░░░░░░░░░░░░░   6h
                                   ───────────────────
                                   合计约 42h ≈ 5~7天
```

---

## 5. 快速上线版要做的事（精确清单）

### 必须做的（P0）

```
□ PostgreSQL Repository 实现 (5张核心表 + request_logs)
   ├── internal/repository/postgres.go          — DB 连接池
   ├── internal/repository/user_repo_pg.go
   ├── internal/repository/api_key_repo_pg.go
   ├── internal/repository/provider_repo_pg.go
   ├── internal/repository/model_repo_pg.go
   ├── internal/repository/binding_repo_pg.go
   ├── internal/repository/session_repo_pg.go
   └── internal/repository/log_repo_pg.go

□ 数据库迁移
   ├── migrations/003_request_logs.up.sql
   └── internal/database/migrator.go            — 自动迁移运行器

□ 基础设施
   ├── Dockerfile (gateway)
   ├── Dockerfile (auth-service)
   ├── infra/docker/docker-compose.yml          — 整合所有服务
   ├── infra/nginx/gateway.conf                 — 反代 + CORS
   └── internal/middleware/cors.go              — CORS 中间件

□ 核心逻辑完善
   ├── chat_controller.go — Token 解析（从响应体提取）
   └── main.go — 支持 STORAGE_DRIVER 环境变量切换存储
```

### 不用做的（刻意砍掉）

```
✗ Router Engine 独立部署         → 路由逻辑留在 Gateway 内
✗ Policy Engine                  → Phase 2 再启动
✗ Billing Service                → Phase 2 再启动
✗ 流式响应 (streaming)           → V1.1 迭代
✗ Rate Limiting                  → V1.1 迭代
✗ 日志详情页（前端）             → Dashboard 足够看概况
✗ Provider API Key 加密存储      → V1.1 安全加固
✗ REST 响应标准化               → 当前格式够用
✗ K8S / 容器编排                 → 不需要
```

---

## 6. 快速上线版架构图

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
       │            │  │  :5173    │  │ :8081     │
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

---

## 7. 后续重构路线图

上线后的演进路线（按优先级排序）：

| 阶段 | 内容 | 预估 |
|:----:|------|:----:|
| **V1.0** | 🚀 快速上线版（本文档） | 5~7天 |
| **V1.1** | 流式响应 + Rate Limiting + 日志详情页 | 1周 |
| **V1.2** | 拆分 Router Engine 独立服务 + 缓存 Redis | 1周 |
| **V2.0** | Policy Engine + Cost Engine + Pricing（Phase 2） | 2~3周 |
| **V2.1** | Budget + Alert + 审计日志 | 1周 |
| **V3.0** | Billing Service + 多租户 | 2周 |

### 重构优先级建议

```
上线后第1周 → 流式响应（用户刚需）
上线后第2周 → Rate Limiting + 安全加固
上线后第3周 → Router Engine 拆分（架构健康度）
上线后第4周 → 进入 Phase 2 Policy Platform
```

---

## 8. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-21 | v1.0 | 初始版本 | AI Project Manager |

---

# End
