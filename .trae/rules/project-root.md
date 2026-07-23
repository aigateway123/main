---
alwaysApply: true
description: "AI Gateway 项目根规则 — 技术栈、架构、Phase、开发原则"
---

# AI Gateway 项目根规则

## 项目信息

| 字段 | 内容 |
|------|------|
| 项目名称 | Nova AI Gateway |
| 项目定位 | 面向企业和 AI 开发者的大模型统一接入平台 |
| 当前阶段 | Phase P0（项目初始化）→ P1（AI Gateway MVP）→ P2（Policy Platform） |
| 部署方式 | Docker Compose（第一阶段不使用 K8S） |

## 技术栈

| 层 | 技术 | 参考标准 |
|----|------|---------|
| 后端 | Go 1.22+ | [11-coding-standard.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/ai-company/01-standards/11-coding-standard.md) §4 |
| 前端 | Vue3 + TypeScript + Pinia | 同上 §5 |
| 数据库 | PostgreSQL 15+ | 同上 §7 |
| 缓存 | Redis 7+ | 同上 §8 |
| API 风格 | REST + JSON | 同上 §6 |
| 包管理 | Go Modules + pnpm | 同上 §16 |

## 架构约束

- **5 个独立服务**：API Gateway、Policy Engine、Router Engine、Auth Service、Billing Service
- **分层架构**：Controller → Service → Repository（依赖方向由外向内）
- **异步化**：日志、成本、统计全部异步处理（Event Queue）
- **性能目标**：Gateway 主链路 < 10ms、Policy Engine < 2ms、Router < 2ms
- **99% 的请求不访问数据库**（优先使用缓存）

完整架构参考 [AI Gateway 项目规划.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/docs/01-product/AI%20Gateway%20项目规划.md)。

## 开发原则

1. **MVP First** — 优先完成最小可运行产品，禁止过度设计
2. **Documentation First** — 代码不能领先文档
3. **API First** — 先定义 API 契约，再实现后端和前端
4. **Reuse Before Build** — 优先复用已有模块，避免重复造轮子
5. **Design Before Coding** — 没有设计不得开始编码
6. **Business First** — 任何功能必须服务商业目标
7. **Cost Awareness** — 始终考虑 API 成本、运维成本、开发成本
8. **Quality First** — 所有产出必须经过 Review + QA + Acceptance

## 代码规范引用

所有开发必须遵循以下 Standards（按优先级排序）：

| 优先级 | Standard | 内容 |
|--------|----------|------|
| 最高 | [01-project-standard.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/ai-company/01-standards/01-project-standard.md) | 项目总纲、MVP 原则、决策机制 |
| 高 | [11-coding-standard.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/ai-company/01-standards/11-coding-standard.md) | 命名、目录结构、层依赖 |
| 高 | [02-agent-standard.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/ai-company/01-standards/02-agent-standard.md) | Agent 角色与协作 |
| 中 | [03-workflow-standard.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/ai-company/01-standards/03-workflow-standard.md) | 工作流定义 |
| 中 | [07-review-standard.md](file:///Users/fuxiansheng/Desktop/AI Gateway/aigateway/ai-company/01-standards/07-review-standard.md) | 评审规范 |

## 当前开发范围

允许开发（P0 ~ P2）：
- 登录注册、Gateway、Provider、Models、API Keys
- Router、Dashboard、Usage、Logs
- Cost Engine、Pricing、Quota、Alert、Budget、Policy Engine

不允许提前开发：
- Skill Marketplace、Workflow Platform、Agent Runtime
- Memory、MCP、Multi Tenant、Enterprise Version
