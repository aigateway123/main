# AI 开发前准备工作清单

> 基于 AI Gateway 项目现状（Phase P0 启动前），需要提前建设的规范性文档清单。

---

## 一、当前项目状态总览

| 维度 | 状态 | 说明 |
|------|------|------|
| `ai-company/01-standards/` (11项标准) | ✅ 已完成 | Project/Coding/Agent/Workflow 等标准齐全 |
| `ai-company/03-agents/` (9个Agent) | ✅ 已完成 | PM、架构师、工程师等Agent定义齐全 |
| `ai-company/06-templates/` (10个模板) | ✅ 已完成 | PRD/Architecture/API 等模板齐全 |
| `docs/01-product/` (项目规划) | ✅ 已完成 | 含AI Gateway项目规划 |
| `docs/仓库/` (仓库文档) | ✅ 部分完成 | 含AI Company MVP落地版、通用prompt |
| `.trae/rules/` (Workspace Rules) | ❌ 缺失 | 仅有一个空的 git-commit-message.md |
| `infra/` (基础设施) | ❌ 空目录 | docker-compose.yml、nginx配置、部署脚本均无 |
| `.env.example` | ❌ 缺失 | 项目根目录无环境变量模板 |
| `.gitignore` | ❌ 缺失 | 项目根目录无 gitignore |
| `backend/` (Go代码) | ❌ 空目录 | go.mod、main.go 等未初始化 |
| `admin/` (前端代码) | ❌ 空目录 | package.json 等未初始化 |
| `.github/workflows/` (CI/CD) | ❌ 空目录 | 无 CI 流程 |
| `docs/ADR/` (架构决策) | ❌ 空目录 | 无架构决策记录 |
| `docs/API/` (API文档) | ❌ 空目录 | 无API契约 |
| `docs/Database/` (数据库文档) | ❌ 空目录 | 无数据库设计 |
| `docs/Architecture/` (架构文档) | ❌ 空目录 | 无架构总览 |

---

## 二、准备工作清单（按优先级排序）

### 第一优先 — AI协作基础设施

| # | 文档 | 路径 | 说明 |
|---|------|------|------|
| 1 | 项目根规则 | `.trae/rules/project-root.md` | 技术栈、架构约束、开发原则（Always Apply） |
| 2 | AI Company 规则 | `.trae/rules/ai-company.md` | Agent协作流程、角色边界、决策升级机制 |
| 3 | Commit 信息规范 | `.trae/rules/git-commit-message.md` | 完善当前空模板，填入提交格式规范 |

**目的**：这些是 AI 在 IDE 中行为的"宪法"——没有它们，AI 可能生成不符合项目规范的代码。

---

### 第二优先 — 基础设施定义

| # | 文档 | 路径 | 说明 |
|---|------|------|------|
| 4 | Docker Compose | `infra/docker/docker-compose.yml` | 定义 PostgreSQL + Redis 本地开发环境 |
| 5 | Nginx 配置 | `infra/nginx/nginx.conf` | 反向代理配置模板 |
| 6 | 部署脚本 | `infra/scripts/deploy.sh` | 生产部署脚本 |
| 7 | 环境变量模板 | `.env.example` | 所有环境变量模板（DB/Redis/AI Keys/JWT等） |
| 8 | Git 忽略规则 | `.gitignore` | 排除 .env、二进制、node_modules 等 |

**目的**：AI 生成的代码需要能实际运行。没有基础设施定义，AI 无法验证代码可用性。

---

### 第三优先 — 架构决策记录

| # | 文档 | 路径 | 说明 |
|---|------|------|------|
| 9 | ADR-001: Monorepo 结构 | `docs/ADR/ADR-001-monorepo-structure.md` | 记录 monorepo 结构、5个服务拆分决策 |
| 10 | ADR-002: 技术栈选型 | `docs/ADR/ADR-002-tech-stack.md` | 记录 Go + Vue3 + PostgreSQL + Redis 选型理由 |
| 11 | 架构总览 | `docs/Architecture/architecture-overview.md` | 系统架构总览，引用项目规划文档 |

**目的**：AI Company 工作要求所有重要技术方案必须先形成 ADR 再开发。这些文档让 AI 知道"为什么这样设计"。

---

### 第四优先 — 数据库与API契约

| # | 文档 | 路径 | 说明 |
|---|------|------|------|
| 12 | 数据库总览 | `docs/Database/schema-overview.md` | 数据库表结构概览、ER图描述 |
| 13 | 初始化迁移 | `backend/migrations/` | 初始化数据库迁移文件（建表SQL） |
| 14 | API 总览 | `docs/API/api-overview.md` | API 总览：认证方式、响应格式、错误码定义 |

**目的**：API First 原则要求先定义接口再写代码。这些文档是前后端 AI Agent 的协作契约。

---

### 第五优先 — CI/CD与开发体验

| # | 文档 | 路径 | 说明 |
|---|------|------|------|
| 15 | CI 流程 | `.github/workflows/ci.yml` | 基础 CI：lint + build + test |
| 16 | 开发环境脚本 | `infra/scripts/setup-dev.sh` | 本地开发环境一键初始化脚本 |

**目的**：保障代码质量和开发效率。

---

## 三、执行路线图

```
第一步（15分钟）：完善 Workspace Rules
  └── .trae/rules/project-root.md + ai-company.md + git-commit-message.md
       ↓
第二步（20分钟）：基础设施定义
  └── docker-compose.yml + .env.example + .gitignore + nginx.conf
       ↓
第三步（15分钟）：架构决策记录
  └── ADR-001 + ADR-002 + 架构总览
       ↓
第四步（20分钟）：数据库与API契约
  └── schema-overview.md + 初始化迁移 + API总览
       ↓
第五步（10分钟）：CI/CD与开发脚本
  └── ci.yml + setup-dev.sh
       ↓
完成后 → 进入 Phase P1：AI Gateway MVP 实际开发
```

## 四、完成标准

完成以上全部 16 项文档后，AI 能够：

1. **理解项目规范**（Rules）→ 生成的代码符合项目风格
2. **本地运行**（docker-compose + .env）→ 可以验证代码
3. **知道设计原因**（ADR + Architecture）→ 不会重复提问
4. **有接口契约**（API + Database）→ 前后端可并行开发
5. **能自动验证**（CI + scripts）→ 提交前自动检查质量

---

## 附录：参考资料

- [AI Gateway 项目规划.md](../01-product/AI%20Gateway%20项目规划.md)
- [01-project-standard.md](../../ai-company/01-standards/01-project-standard.md)
- [11-coding-standard.md](../../ai-company/01-standards/11-coding-standard.md)
- [AI Company MVP 1.0落地版.md](./AI%20Company%20MVP%201.0%E8%90%BD%E5%9C%B0%E7%89%88.md)
