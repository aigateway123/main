# AI Company Engineering Standard

Version: v1.0

Status: Draft

Owner: Architect

Last Updated: 2026-07-12

---

## 1. Development Principles

### Engineering Principles

- **SOLID**: 每个模块遵循单一职责、开闭、里氏替换、接口隔离、依赖反转
- **KISS**: 优先简单方案，禁止过度设计
- **DRY**: 消除重复逻辑，优先复用已有模块
- **YAGNI**: 不要实现当前不需要的功能
- **Clean Architecture**: 依赖方向从外层向内层，业务逻辑不依赖框架
- **DDD (Lightweight)**: MVP 阶段采用轻量化 DDD，不做过度领域建模
- **API First**: 先定义 API 契约，再实现后端逻辑和前端页面

### Performance Goals

| 指标 | 目标 |
|------|------|
| API Gateway 主链路 | < 10ms（不含模型推理时间） |
| Policy Engine 决策 | < 2ms |
| Router 决策 | < 2ms |
| 数据库查询 (99%) | < 10ms |
| 统计/成本/日志 | 全部异步化 |

---

## 2. Repository Structure

```
aigateway/
│
├── backend/                    # Go 后端服务
│   ├── cmd/                    # 各服务入口
│   │   ├── gateway/            # API Gateway 服务
│   │   ├── policy-engine/      # Policy Engine 服务
│   │   ├── router-engine/      # Router Engine 服务
│   │   ├── auth-service/       # Auth 服务
│   │   └── billing-service/    # Billing 服务
│   ├── internal/               # 内部包（各服务共享）
│   │   ├── controller/         # HTTP 处理器
│   │   ├── service/            # 业务逻辑
│   │   ├── repository/         # 数据访问
│   │   ├── dto/                # 数据传输对象
│   │   ├── entity/             # 领域实体
│   │   ├── middleware/         # HTTP 中间件
│   │   ├── config/             # 配置管理
│   │   ├── logger/             # 日志
│   │   ├── errors/             # 错误定义
│   │   └── types/              # 共享类型
│   ├── pkg/                    # 可导出包
│   ├── migrations/             # 数据库迁移
│   ├── scripts/                # 构建脚本
│   ├── Dockerfile
│   └── go.mod
│
├── admin/                      # Vue3 + TypeScript 管理后台
│   ├── src/
│   │   ├── pages/              # 页面
│   │   ├── components/         # 通用组件
│   │   ├── composables/        # 组合式函数
│   │   ├── api/                # API 调用
│   │   ├── stores/             # Pinia 状态
│   │   ├── router/             # 路由
│   │   ├── types/              # TypeScript 类型
│   │   ├── hooks/              # 自定义 Hooks
│   │   └── utils/              # 工具函数
│   ├── Dockerfile
│   └── package.json
│
├── docs/                       # 产品与技术文档
│   ├── 01-product/
│   ├── 02-architecture/
│   ├── 03-api/
│   ├── 04-database/
│   └── 08-release/
│
├── infra/                      # 基础设施
│   ├── docker/                 # Docker Compose 配置
│   │   ├── docker-compose.yml
│   │   └── docker-compose.test.yml
│   ├── nginx/                  # Nginx 配置
│   └── scripts/                # 部署脚本
│       ├── deploy.sh
│       └── init-db.sh
│
├── scripts/                    # 项目级脚本
│   ├── lint.sh
│   └── test.sh
│
├── ai-company/                 # AI Company 框架
│   ├── 01-standards/
│   ├── 02-workflows/
│   ├── 03-agents/
│   ├── 04-skills/
│   ├── 05-templates/
│   ├── 06-knowledge/
│   └── 07-checklists/
│
├── .github/                    # GitHub 配置
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Naming Convention

### File Naming

| 语言 | 规范 | 示例 |
|------|------|------|
| Go | snake_case | `user_service.go` |
| TypeScript/Vue | kebab-case | `user-profile.vue` |
| SQL | snake_case | `create_users_table.sql` |
| Docker | kebab-case | `Dockerfile.gateway` |
| Config | snake_case | `app_config.yaml` |

### Directory Naming

| 语言 | 规范 | 示例 |
|------|------|------|
| All | kebab-case | `auth-service/`, `router-engine/` |

### Go Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| Package | lowercase, short | `user`, `auth`, `provider` |
| Interface | -er 后缀 | `UserRepository`, `ProviderAdapter` |
| Struct | PascalCase | `UserService`, `ApiKey` |
| Method | PascalCase | `CreateUser()`, `GetByID()` |
| Public Variable | PascalCase | `DefaultTimeout` |
| Private Variable | camelCase | `defaultTimeout` |
| Constant | PascalCase | `MaxRetryCount` |
| Environment Variable | UPPER_SNAKE | `DATABASE_URL`, `REDIS_ADDR` |

### Frontend Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| Component | PascalCase | `UserProfile.vue` |
| Page | kebab-case | `user-list.vue` |
| Composable | camelCase, `use` prefix | `useAuth()` |
| Store | camelCase, `use` + `Store` | `useUserStore()` |
| API Function | camelCase | `getUserList()` |
| Type/Interface | PascalCase | `UserInfo`, `ApiResponse` |
| Prop | camelCase | `userId` |
| Emit | kebab-case | `update:model-value` |

### Database Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| Table | snake_case, plural | `users`, `api_keys` |
| Column | snake_case | `created_at`, `user_id` |
| Index | `idx_` prefix | `idx_users_email` |
| Foreign Key | `fk_` prefix | `fk_apikeys_user` |
| Primary Key | `pk_` prefix | `pk_users_id` |

### API Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| URL Path | kebab-case, plural | `/api/v1/users`, `/api-keys` |
| Query Param | camelCase | `?pageSize=20` |
| JSON Field | camelCase | `"userId": 1` |

### Git Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| Branch | `type/description` | `feat/add-router`, `fix/login-error` |
| Tag | `vMAJOR.MINOR.PATCH` | `v1.0.0`, `v1.2.1` |
| Docker Image | `name:tag` | `gateway:v1.0.0` |

---

## 4. Backend Standard (Go)

### Service Layer

```
cmd/
├── gateway/
│   └── main.go
├── policy-engine/
│   └── main.go
├── router-engine/
│   └── main.go
├── auth-service/
│   └── main.go
└── billing-service/
    └── main.go

internal/
├── controller/       # HTTP handler, 参数解析, 响应返回
├── service/          # 业务逻辑, 事务管理
├── repository/       # 数据访问 (PostgreSQL/Redis/API)
├── dto/              # 请求/响应 DTO
├── entity/           # 领域实体
├── middleware/       # Auth, Logger, Recovery, CORS, Rate Limit
├── config/           # 配置加载 (env, yaml)
├── logger/           # 日志封装
├── errors/           # 统一错误定义
└── types/            # 共享类型定义
```

### Layer Rules

| Layer | 依赖方向 | 禁止事项 |
|-------|---------|---------|
| Controller → Service | Controller 调用 Service | Controller 不可直接访问 Repository |
| Service → Repository | Service 调用 Repository | Service 不可直接处理 HTTP |
| Repository → DB | Repository 访问数据库 | Repository 不可包含业务逻辑 |
| Entity → 无依赖 | 纯数据结构 | Entity 不可包含框架代码 |

### Dependency Injection

- 使用构造函数注入
- 接口定义在 consumer 侧
- 禁止使用全局变量

```go
type UserService struct {
    repo UserRepository
}
func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}
```

### Error Handling

- 使用 `internal/errors` 定义业务错误码
- Service 层返回业务错误，不返回 HTTP 状态码
- Controller 层将业务错误转换为 HTTP 响应

### Context

- 所有 Service 和 Repository 方法必须接收 `context.Context`
- 使用 context 传递 TraceID、超时控制、取消信号

### Backend 禁止事项

- 禁止使用 `log.Println` / `fmt.Println` — 必须使用 Logger
- 禁止全局变量管理状态
- 禁止循环依赖
- 禁止在 Controller 中写业务逻辑
- 禁止在 Repository 中写业务逻辑
- 禁止未处理错误（未检查的 `_`）

---

## 5. Frontend Standard (Vue3 + TypeScript)

### Directory Structure

```
src/
├── pages/                    # 页面级组件
│   ├── dashboard/
│   ├── users/
│   ├── api-keys/
│   ├── providers/
│   ├── models/
│   ├── router/
│   ├── usage/
│   ├── cost/
│   └── settings/
├── components/               # 通用组件
│   ├── common/               # Button, Modal, Table
│   └── business/             # 业务通用组件
├── composables/              # 组合式函数
│   ├── useAuth.ts
│   ├── usePagination.ts
│   └── useApiKey.ts
├── api/                      # API 调用
│   ├── user.ts
│   ├── provider.ts
│   └── router.ts
├── stores/                   # Pinia 状态
│   ├── userStore.ts
│   └── appStore.ts
├── router/                   # Vue Router
│   └── index.ts
├── types/                    # TypeScript 类型
│   ├── user.ts
│   └── api.ts
├── hooks/                    # 自定义 Hooks
├── utils/                    # 工具函数
│   ├── format.ts
│   └── validators.ts
└── App.vue
```

### Component Rules

- 每个 `.vue` 文件只包含一个组件
- 使用 `<script setup lang="ts">`
- Props 必须定义类型
- Emits 必须定义类型

### State Management

- 使用 Pinia 管理全局状态
- 页面级状态使用 composables
- 禁止组件间直接修改对方状态

### Frontend 禁止事项

- 禁止使用 `any` 类型（除第三方库无类型定义）
- 禁止在组件内直接调用 API（必须通过 `api/` 层）
- 禁止硬编码 API URL
- 禁止在模板中写复杂逻辑
- 禁止样式重复定义（优先复用组件）
- 禁止未使用的 import

---

## 6. API Standard

### REST API 规范

| 规则 | 标准 |
|------|------|
| URL | `/api/v1/resources` |
| Method | GET / POST / PUT / DELETE / PATCH |
| Request Body | JSON |
| Response Body | JSON |
| Pagination | `?page=1&pageSize=20` |

### HTTP Status

| 场景 | Status |
|------|--------|
| Success | 200 OK |
| Created | 201 Created |
| No Content | 204 No Content |
| Bad Request | 400 Bad Request |
| Unauthorized | 401 Unauthorized |
| Forbidden | 403 Forbidden |
| Not Found | 404 Not Found |
| Conflict | 409 Conflict |
| Too Many Requests | 429 Too Many Requests |
| Internal Error | 500 Internal Server Error |

### Response Format

```json
{
    "code": 0,
    "message": "success",
    "data": {},
    "traceId": "xxx"
}
```

### Error Code Format

- 业务错误码：`[服务缩写][三位数字]`
- 示例：`AUTH001`, `GATEWAY001`, `BILL001`

### Authentication

- 使用 `Authorization: Bearer sk-xxx` 传递 API Key
- 使用 JWT 传递用户身份
- Admin 后台使用 Session 或 JWT

### API 禁止事项

- 禁止在 URL 中包含敏感信息
- 禁止返回明文密码或 API Key
- 禁止无认证的写操作
- 禁止响应中包含未使用的字段

---

## 7. Database Standard (PostgreSQL)

### Table Rules

- 所有表必须有 `id` (BIGSERIAL PRIMARY KEY)
- 所有表必须有 `created_at` / `updated_at`
- 所有表使用 `deleted_at` 实现软删除
- 表名使用 snake_case 复数

### Column Rules

| 类型 | 规范 | 示例 |
|------|------|------|
| ID | `id` BIGSERIAL | `id` |
| 时间 | `_at` TIMESTAMPTZ | `created_at`, `updated_at` |
| 布尔 | `_flag` BOOLEAN | `is_active_flag` |
| 状态 | `_status` VARCHAR | `user_status` |
| 金额 | DECIMAL(10,4) | `amount` |

### Migration Rules

- 使用 golang-migrate 或 goose
- 迁移文件命名：`YYYYMMDDHHMMSS_description.up.sql`
- 每个迁移只做一件事
- 禁止修改已合并的迁移文件

### Query Rules

- 禁止在循环中执行 SQL
- 复杂查询必须使用 EXPLAIN ANALYZE 检查
- 使用参数化查询，禁止拼接 SQL

---

## 8. Redis Standard

### Key Naming

```
[service]:[module]:[entity]:[id]:[field]
```

示例：

```
gateway:apikey:user:123:tokens
policy:quota:user:456:limit
```

### TTL Rules

| 数据类型 | TTL | 说明 |
|---------|-----|------|
| Session | 24 小时 | 用户登录态 |
| Cache | 5 分钟 | 热点数据 |
| Rate Limit | 1 秒 ~ 1 小时 | 按场景 |
| Lock | 10 秒 | 分布式锁 |

### Cache Strategy

- Cache-Aside 模式
- 写入时更新缓存（非删除）
- 批量失效使用 key pattern

---

## 9. Error Handling Standard

### 错误类型

| 类型 | 说明 | 处理方式 |
|------|------|---------|
| Business Error | 业务逻辑错误 | 返回错误码 + 消息 |
| System Error | 系统异常 | 记录日志 + 返回 500 |
| HTTP Error | 外部请求失败 | 重试 + Fallback |
| Validation Error | 参数校验失败 | 返回 400 + 字段错误 |

### Log Level

| Level | 使用场景 |
|-------|---------|
| DEBUG | 开发调试 |
| INFO | 请求开始/结束 |
| WARN | 可恢复的错误 |
| ERROR | 需要人工介入的错误 |
| FATAL | 服务无法启动 |

### Retry Strategy

- 临时错误：最多重试 3 次，指数退避
- 幂等请求：可以安全重试
- 非幂等请求：禁止自动重试

---

## 10. Logging Standard

### Log Format

```json
{
    "time": "2026-07-12T10:00:00Z",
    "level": "INFO",
    "traceId": "trace-xxx",
    "service": "gateway",
    "message": "request completed",
    "duration": "1500ms",
    "status": 200
}
```

### 必须记录的日志

| 类型 | 内容 |
|------|------|
| 请求日志 | Method, Path, Status, Duration, UserID |
| 错误日志 | Error, Stack, TraceID, Request |
| 审计日志 | Who, What, When, Resource |
| 安全日志 | Login, Logout, Permission Denied |

---

## 11. Security Standard

| 项目 | 规范 |
|------|------|
| API Key | 哈希存储 (bcrypt)，传输使用 HTTPS |
| JWT | 签名使用 HS256 或 RS256，过期时间 < 24h |
| RBAC | 角色：admin / user / read-only |
| Input Validation | 所有用户输入必须校验 |
| SQL Injection | 使用参数化查询，禁止拼接 SQL |
| Rate Limit | 每 API Key 1000 req/min |
| Secret Management | 使用环境变量，禁止硬编码 |

---

## 12. Performance Standard

| 项目 | 目标 |
|------|------|
| Gateway 响应 | < 10ms（不含模型推理） |
| API 超时 | 30s（含模型推理） |
| DB 连接池 | 最大 50 |
| Redis 连接池 | 最大 100 |
| 并发请求 | 支持 1000 QPS |
| 异步任务 | Event Queue 异步处理 |

---

## 13. Git Standard

### Branch Strategy

| Branch | 用途 | 来源 |
|--------|------|------|
| `main` | 生产分支 | 保护分支 |
| `feat/*` | 功能开发 | main |
| `fix/*` | Bug 修复 | main |
| `refactor/*` | 重构 | main |
| `docs/*` | 文档更新 | main |

### Commit Message

```
<type>(<scope>): <description>

feat(gateway): add provider weight router
fix(auth): fix api key validation
docs(readme): update deployment guide
```

### Merge Rules

- 禁止直接 push main
- PR 必须经过 Review
- 合并前必须解决冲突

---

## 14. Testing Standard

| 类型 | 覆盖要求 | 工具 |
|------|---------|------|
| Unit Test | 核心逻辑 > 80% | Go testing |
| Integration Test | 关键路径 | Testcontainers |
| API Test | 所有 API | Postman / Hoppscotch |
| Smoke Test | 上线前 | 手动 |

### Unit Test Rules

- 测试文件与被测试文件同目录：`user_service.go` / `user_service_test.go`
- 使用表格驱动测试
- Mock 外部依赖，测试业务逻辑

---

## 15. Code Review Standard

### Review Checklist

□ 代码是否正确？

□ 是否有测试覆盖？

□ 是否有性能隐患？

□ 是否有安全漏洞？

□ 是否符合命名规范？

□ 是否有重复代码？

□ 是否有错误处理？

□ 文档是否已更新？

---

## 16. Dependency Management

| 语言 | 工具 | 规范 |
|------|------|------|
| Go | go mod | 锁定版本，定期更新 |
| TypeScript | npm/pnpm | 锁定版本，定期审计 |

### Upgrade Strategy

- 安全更新：立即升级
- 功能更新：Sprint 规划时评估
- 大版本更新：需要测试验证

---

## 17. Configuration Standard

### Environment Files

| 文件 | 用途 | 是否提交 |
|------|------|---------|
| `.env.example` | 配置模板 | ✅ |
| `.env.development` | 本地开发 | ❌ |
| `.env.test` | 测试环境 | ❌ |
| `.env.production` | 生产环境 | ❌ |

### 禁止事项

- 禁止提交 `.env` 文件到 Git
- 禁止在代码中硬编码配置
- 禁止在日志中输出敏感配置

---

## 18. AI Coding Rules

AI 开发 Agent 在生成代码时必须遵守以下规则：

### 代码质量

- 不允许生成重复代码。发现已有相似逻辑时，优先复用
- 必须遵循项目目录结构，不得在错误位置创建文件
- 必须遵循 Naming Convention（Go snake_case, Vue kebab-case）
- 必须生成可测试代码：函数不可过长，依赖可 Mock
- 必须包含基本的错误处理，禁止忽略错误

### 设计约束

- 禁止过度设计。不做未来可能需要的抽象
- 禁止生成未使用的代码、变量、import、函数
- 禁止跳过 Review 阶段
- 禁止创建无关的辅助文件

### 文档约束

- 新增或修改 API 必须同步更新 API 文档
- 新增或修改数据库表必须同步更新迁移文件
- 新增配置项必须更新 `.env.example`

### 安全约束

- 禁止在代码中硬编码 API Key 或 Token
- 禁止输出敏感信息到日志
- 禁止在 URL 或响应中暴露内部信息

---

## 19. Coding Checklist

### Backend Checklist

□ 是否遵循 Layer 依赖方向？

□ Controller 是否只处理 HTTP 不包含业务逻辑？

□ Service 是否包含完整业务逻辑和事务？

□ 是否使用 context.Context？

□ 错误是否已处理？

□ 是否有单元测试？

### Frontend Checklist

□ 组件是否使用 `<script setup lang="ts">`？

□ Props 和 Emits 是否定义了类型？

□ API 调用是否在 `api/` 层？

□ 是否有未使用的 import？

□ 是否有硬编码的文本？

### API Checklist

□ URL 是否符合 REST 规范？

□ 是否使用正确的 HTTP Method？

□ 响应格式是否统一？

□ 是否有认证和权限校验？

□ 是否有输入校验？

### Database Checklist

□ 表是否有 `created_at` / `updated_at`？

□ 是否有必要的索引？

□ 迁移文件是否可回滚？

□ 查询是否使用参数化？

### Review Checklist

□ 代码是否符合所有 Standards？

□ 是否有测试覆盖？

□ 是否有安全漏洞？

□ 是否有性能隐患？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | Architect |

---

# End

本规范是 AI Company 所有工程开发的统一标准。

所有开发 Agent 必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。

如与 Review Standard 冲突：Review Standard 优先。
