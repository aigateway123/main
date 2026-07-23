# AI Gateway 项目规划

> Nova AI Gateway — 面向企业和 AI 开发者的大模型统一接入平台，提供模型聚合、智能路由、成本优化、Agent Runtime 以及行业 AI 能力。

---

## 一、项目概述

**项目名称**：Nova AI Gateway

**一句话介绍**：面向企业和 AI 开发者的大模型统一接入平台，提供模型聚合、智能路由、成本优化、Agent Runtime 以及行业 AI 能力。

---

## 二、项目背景

### 行业变化

| 年份 | 趋势 |
|------|------|
| 2023 | 企业："我要接 GPT" |
| 2024 | 企业："我要接 GPT + Claude" |
| 2025 | 企业："我要接十几个模型" |
| 2026 | 企业："我要根据成本、速度、效果自动选择模型" |

整个 AI 行业已经进入 **Multi-Model（多模型时代）**。企业需要的不再是 GPT API，而是 **AI Infrastructure**。

### 企业真正遇到的问题

| 问题 | 描述 |
|------|------|
| 模型越来越多 | OpenAI、Claude、Gemini、Qwen、DeepSeek… |
| API 不统一 | 参数、返回值、能力各不相同 |
| 成本越来越高 | 不同模型价格差异巨大 |
| 稳定性不足 | 单一 Provider 故障影响业务 |
| 权限混乱 | 多团队、多项目难管理 |
| 日志缺失 | 无法追踪 Token 消耗与问题定位 |

---

## 三、系统架构

### 整体产品定位

```
              AI Infrastructure Platform
    ┌───────────────────────────────────────┐
    │           Developer Portal            │
    └───────────────────────────────────────┘
                      │
      ┌───────────────┼──────────────────────┐
      │               │                      │
      ▼               ▼                      ▼
   API Gateway    Skill Platform        Agent Runtime
      │               │                      │
      └──────────────┬┴──────────────────────┘
                     ▼
                Policy Engine
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Router Engine  Billing Engine  Auth Engine
                     │
                     ▼
              Provider Layer
                     │
     OpenAI  Claude  Gemini  DeepSeek  Qwen  GLM
```

### 部署架构

```
              Internet
                  │
           Cloudflare
                  │
     ┌────────────┴──────────────┐
     ▼                           ▼
Production                   Test
4C8G                         2C4G
Ubuntu                       Ubuntu
Docker                       Docker
```

全部使用 **Docker Compose**，第一阶段不要 K8S。

### 整个系统架构 (Docker)

```
Docker
├── Nginx
├── Gateway
├── Policy Engine
├── Router Engine
├── Auth Service
├── Billing Service
├── PostgreSQL
├── Redis
└── MinIO（可选）
```

### 核心产品架构

```
AI Platform
│
├── Web Console
├── Admin Console
├── API Gateway
├── Policy Engine
├── Router Engine
├── Provider Adapter
├── Billing Engine
├── Event Bus
├── Cost Engine
├── Usage Engine
├── Log Engine
├── Notification
└── MCP Gateway（以后）
```

### 核心架构建议

建议将系统拆分为 **5 个独立服务**：

```
API Gateway
    │
    ├─────────────┼──────────────┐
    │             │              │
    ▼             ▼              ▼
Policy Engine   Router Engine  Auth Service
    │
    ▼
Provider Adapter
    │
    ▼
OpenAI / Claude / Gemini ...
（异步）
    │
    ▼
Event Queue
    │
    ▼
Cost Service  Usage Service  Log Service  Billing Service
```

**优势**：
1. 主链路极快（通常增加不到 5ms）
2. 日志、成本、统计不会拖慢请求
3. 后续增加企业功能（预算、审计、计费）不用修改 Gateway 核心
4. 以后用户从 100 增长到 10 万，扩展也比较容易

**性能目标**：
- API Gateway 主链路：<10ms（不含模型推理时间）
- Policy Engine：<2ms
- Router：<2ms
- 99% 的请求不访问数据库
- 所有统计、成本、日志全部异步化

---

## 四、产品功能

### 首页（Dashboard）

运营每天都会看的页面，展示整个 AI 平台运行情况。

```
              Campus AI Portal
    ┌──────────────────────────┐
    │ 登录                     │
    │ API Key                  │
    │ Token 使用量             │
    │ 模型列表                 │
    │ 配额                     │
    │ 文档                     │
    └──────────────────────────┘
              │
              ▼
       AI Gateway(API)
              │
    Router + Provider
              │
  Claude/OpenAI/Gemini/Qwen...
```

#### 今日数据
- 今日请求数
- 今日 Token
- 今日收入
- 今日成本
- 今日利润

#### 实时数据
- 在线用户
- 活跃 API Key
- 当前 QPS
- 平均延迟
- 成功率
- 失败率

#### 模型排行榜
- GPT / Claude / DeepSeek / Gemini / Qwen

### 用户管理（Users）

管理所有注册用户。

**页面字段**：

| 字段 | 说明 |
|------|------|
| User ID | 唯一 ID |
| 昵称 | 用户名称 |
| 邮箱 | 登录账号 |
| 组织 | 所属组织 |
| 套餐 | Free / Pro / Enterprise |
| 余额 | 账户余额 |
| API 数量 | 拥有多少 Key |
| 请求次数 | 累计请求 |
| 状态 | 正常/禁用 |

**操作**：
- 创建用户
- 禁用用户
- 重置密码
- 调整余额
- 修改套餐
- 查看调用记录

### 组织管理（Organizations

每家公司对应一个组织，包含：
- 成员
- 额度
- 预算
- 权限

管理员可以：
- 新增组织
- 删除组织
- 邀请成员
- 设置管理员

### 认证中心（Authentication）

支持：
- 学校邮箱注册
- Google 登录（如果有国际高校）
- GitHub 登录（计算机专业学生）
- 邮箱验证码登录

后续接入：CAS（校园统一认证）、SSO

### API Keys

每个用户可以创建多个 Key，格式：`sk-campus-xxxxx`

| 字段 | 说明 |
|------|------|
| Key 名称 | 开发环境 |
| Key 前缀 | sk-xxxx |
| 所属用户 | 谁的 |
| 权限 | 只读/全部 |
| 状态 | 启用 |
| 创建时间 | 什么时候 |
| 最近调用 | 多久前 |

进入详情可看到：Token、花费、最近 100 次请求、IP 地址、错误率

### 供应商 Provider

支持：Claude / OpenAI / Gemini / DeepSeek / Qwen

每个 Provider 配置：
- Base URL
- API Key
- Timeout
- Weight
- Priority
- QPS
- Retry
- Enable

### 模型（Models）

**核心概念**：
- **Model** = 逻辑模型（如 GPT5、Claude Sonnet）
- **Provider** = 真实供应商（如 OpenAI、Azure、OpenRouter）

每个 Model 可以配置多个 Provider，支持权重分配。

### 智能路由（Router）

Gateway 核心功能。支持多种路由策略：

| 策略 | 说明 |
|------|------|
| 最低价格 | 选择价格最低的 Provider |
| 最快速度 | 选择响应最快的 Provider |
| 权重 | 按权重比例分配请求 |
| 轮询 | 依次轮询 Provider |
| 失败切换 | Provider 失败时自动切换 |

路由示例：

```
GPT5 → OpenAI (Weight 80) → Azure (Weight 20)
```

```
Claude → Anthropic → OpenRouter → AWS Bedrock
```

### 用量分析（Usage）

统计今日各模型/Provider 的用量，包括：
- Token 消耗
- 请求次数
- 图片数
- 音频时长
- 费用

### 额度配置（Quotas）

| 套餐 | 额度 |
|------|------|
| Free | 100 次/天 |
| Pro | Claude 120 万 Token / GPT 80 万 Token |
| Enterprise | 无限 |

支持限制：Token / Requests / Images / Audio

### Logs（日志）

每一次请求都在这里记录，方便排查。

| 字段 | 说明 |
|------|------|
| 时间 | 请求时间 |
| 用户 | 请求用户 |
| API Key | 使用的 Key |
| 模型 | 使用的模型 |
| Provider | 使用的供应商 |
| Prompt 长度 | Input Token 数 |
| Completion 长度 | Output Token 数 |
| 耗时 | 请求耗时 |
| IP | 请求 IP |
| 状态 | 成功/失败 |
| 错误 | 错误信息 |

还能查看 Request / Response 原文。

### Cost（成本）

商业核心功能，很多平台都没有。

支持按 **用户、模型、Provider** 统计成本、收入和利润。

示例：
- GPT (OpenAI)：收入 ¥100，成本 ¥70，利润 ¥30
- DeepSeek：利润率 90%

系统可自动优先选择利润高的模型。

### Announcement（公告）

运营发布通知，用户登录即可看到。

- 系统升级
- 模型更新
- 维护通知
- 新模型上线

### Billing（计费）

商业化必备模块。

- 套餐管理
- 订单管理
- 充值
- 退款
- 优惠券
- 发票

### System Settings（系统设置）

统一管理平台配置：
- 默认模型
- Token 汇率/价格
- 默认超时时间
- 默认重试次数
- SMTP 邮件配置
- 第三方登录配置
- Webhook
- API 限流参数

### Audit Log（审计日志）

记录所有后台操作。

### 策略引擎（Policy Engine）

**一句话理解**：管理员 A 修改了 OpenAI Provider 的 Weight 从 100 改成 20。

#### Cost Engine 是什么？

AI 平台的大脑，负责告诉 Router："这次走 Claude" / "这次走 DeepSeek" / "这次走 GPT"。

```
用户请求 → Cost Engine（决策中心）→ Router → Provider → 返回结果
```

#### Cost Engine 页面配置

**① 成本中心（Cost Center）**

| 功能 | 说明 |
|------|------|
| Model | 模型名称 |
| Provider | 供应商 |
| Input Cost | 输入价格 |
| Output Cost | 输出价格 |
| 更新时间 | 自动同步 |

后台支持手动修改、自动同步价格、历史价格记录。

**② 定价中心（Pricing）**

采购价 ≠ 售价。后台支持：
- 固定价格
- 成本 × 倍数（如售价 = 成本 × 1.5）
- 最低利润率（如 30%）

**③ 利润分析（Profit Analytics）**

按模型分析收入、成本、利润、毛利率。

| 模型 | 收入 | 成本 | 利润 | 毛利率 |
|------|------|------|------|--------|
| GPT | ¥300 | ¥260 | ¥40 | 13% |
| Claude | ¥500 | ¥350 | ¥150 | 30% |
| DeepSeek | ¥400 | ¥80 | ¥320 | 80% |

**④ 成本优化（Optimization）**

后台给出优化建议，例如：
- GPT 用于普通聊天 12000 次 → 建议改用 DeepSeek，预计每月节省 ¥3800
- Claude 用于摘要 → 建议 Qwen Max，预计节省 28%

**⑤ Budget（预算管理）**

- 部门预算：研发 ¥5000 / 运营 ¥3000 / 市场 ¥2000
- 超过 90% 提醒
- 超过 100% 自动限制

**⑥ Alerts（成本预警）**

实时监控异常：
- OpenAI 成本比昨天上涨 300% → 报警
- 某 API Key 一分钟调用 10000 次 → 报警
- 某用户今日消费 ¥5000，超过日均 20 倍 → 报警

**⑦ 策略中心（Policies）**

- VIP 用户允许 GPT、Claude、Gemini
- 免费用户优先 DeepSeek，每天最多 100 次
- 夜间 22:00 以后优先便宜模型
- QPS > 500 时优先最快 Provider
- 利润率低于 20% 禁止使用
- Prompt 长度 > 50000 token 自动走 Claude

**⑧ 报表中心（Reports）**

- 日报：收入、成本、利润、调用次数、Top10 用户、Top10 模型
- 周报：新增用户、API 收入、利润变化、成本变化、模型排行
- 月报：利润趋势、ROI、成本占比、客户排行
- 支持导出 Excel

**ROI 分析**

- A 公司：收入 5000，成本 4200，利润 800
- B 公司：收入 2000，成本 500，利润 1500

**模型推荐**

后台自动分析，一键修改 Router 配置。

#### MVP 阶段必须做的功能

| 功能 | MVP | V2 | V3 |
|------|-----|----|-----|
| 成本计算 | ✅ | | |
| 售价配置 | ✅ | | |
| 利润分析 | ✅ | | |
| 成本趋势图 | ✅ | | |
| 预算管理 | ✅ | | |
| 成本预警 | ✅ | | |
| 自动优化建议 | | ✅ | |
| 自动调价 | | ✅ | |
| 智能模型推荐 | | | ✅ |
| AI 自动策略生成 | | | ✅ |

### 增加 Policy Engine 请求时间处理方案

一次 AI 请求的耗时分析：

```
用户 → 网络(20ms) → Gateway(5ms) → Policy Engine(2ms) → Router(2ms) → Anthropic API(1500ms) → 返回 → Gateway(2ms)
总耗时 ≈ 1530ms
```

**关键结论**：真正慢的是大模型推理（~1500ms），不是 Gateway。Policy Engine 的决策时间应控制在 **1~5ms**。

---

## 五、Roadmap

### Phase 0 — 项目初始化（2 周）

| 项目 | 内容 |
|------|------|
| 产品目标 | 项目初始化 |
| 核心功能 | 产品定位、域名、服务器、Docker、CI/CD、数据库、Redis、Cloudflare |
| 技术重点 | 开发环境、测试环境、生产环境 |
| 商业目标 | 开始开发 |
| 是否上线 | ❌ |

### Phase 1 — AI Gateway MVP（4~6 周）

| 项目 | 内容 |
|------|------|
| 产品目标 | AI Gateway MVP |
| 核心功能 | 登录注册、API Key、Provider、Models、Gateway、Router、Dashboard、Admin |
| 技术重点 | OpenAI API 兼容、Provider Adapter |
| 商业目标 | 第一批种子用户 |
| 是否上线 | ✅ |

### Phase 2 — Policy Platform（4 周）

| 项目 | 内容 |
|------|------|
| 产品目标 | Policy Platform |
| 核心功能 | Policy Engine、Pricing、Quota、Usage、Cost、Alert、Budget |
| 技术重点 | 策略缓存、规则引擎、异步事件 |
| 商业目标 | 企业开始接入 |
| 是否上线 | ✅ |

### Phase 3 — Developer Platform（4~6 周）

| 项目 | 内容 |
|------|------|
| 产品目标 | Developer Platform |
| 核心功能 | Playground、API Docs、SDK、Webhook、Prompt Library、Workflow(Beta) |
| 技术重点 | SDK、OpenAPI、开发者体验 |
| 商业目标 | 开发者生态 |
| 是否上线 | ✅ |

### Phase 4 — Skill Marketplace（6 周）

| 项目 | 内容 |
|------|------|
| 产品目标 | Skill Marketplace |
| 核心功能 | Skill 管理、Skill 发布、Skill 安装、Skill 收费、版本管理 |
| 技术重点 | Marketplace、权限系统 |
| 商业目标 | Skill 收入 |
| 是否上线 | ✅ |

### Phase 5 — Agent Runtime（8 周）

| 项目 | 内容 |
|------|------|
| 产品目标 | Agent Runtime |
| 核心功能 | Agent、Memory、Tool Calling、Knowledge Base、Workflow、多 Agent |
| 技术重点 | MCP、RAG、任务编排 |
| 商业目标 | 企业 AI 项目 |
| 是否上线 | ✅ |

### Phase 6 — Enterprise AI Platform（持续迭代）

| 项目 | 内容 |
|------|------|
| 产品目标 | Enterprise AI Platform |
| 核心功能 | 企业权限、SSO、组织管理、私有部署、计费、审计、监控 |
| 技术重点 | Kubernetes、高可用、私有化 |
| 商业目标 | 企业客户 |
| 是否上线 | ✅ |

### 各 Phase 模块开发对照表

| 模块 | P0 | P1 | P2 | P3 | P4 | P5 | P6 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 登录注册 | ✅ | | | | | | |
| 用户中心 | ✅ | | | | | | |
| API Keys | | ✅ | | | | | |
| Provider 管理 | | ✅ | | | | | |
| Model 管理 | | ✅ | | | | | |
| AI Gateway | | ✅ | | | | | |
| Router | | ✅ | | | | | |
| Dashboard | | ✅ | | | | | |
| Logs | | ✅ | | | | | |
| Policy Engine | | | ✅ | | | | |
| Pricing | | | ✅ | | | | |
| Quota | | | ✅ | | | | |
| Cost Engine | | | ✅ | | | | |
| Usage Analytics | | | ✅ | | | | |
| Budget | | | ✅ | | | | |
| Alerts | | | ✅ | | | | |
| API Playground | | | | ✅ | | | |
| API Docs | | | | ✅ | | | |
| SDK | | | | ✅ | | | |
| Prompt Library | | | | ✅ | | | |
| Workflow（基础） | | | | ✅ | | | |
| Skill 管理 | | | | | ✅ | | |
| Skill Marketplace | | | | | ✅ | | |
| Skill 收费 | | | | | ✅ | | |
| Agent Runtime | | | | | | ✅ | |
| Memory | | | | | | ✅ | |
| Tool Calling | | | | | | ✅ | |
| MCP | | | | | | ✅ | |
| Knowledge Base | | | | | | ✅ | |
| 企业组织 | | | | | | | ✅ |
| 企业权限 | | | | | | | ✅ |
| SSO | | | | | | | ✅ |
| 审计日志 | | | | | | | ✅ |
| 私有化部署 | | | | | | | ✅ |
| 多租户 | | | | | | | ✅ |

### 各阶段资源采购表

| Phase | 服务器 | 域名 | 第三方服务 | AI API |
|:-----:|--------|------|-----------|--------|
| P0 | 新加坡测试 + 新加坡生产 | 2 个域名（官网、API） | Cloudflare、GitHub、Cursor | OpenAI、Claude、Gemini、DeepSeek |
| P1 | 保持现有 | 无新增 | PostgreSQL、Redis | 增加 Qwen、GLM |
| P2 | 保持现有 | 无新增 | 邮件、短信（可选） | 完善模型供应商 |
| P3 | 可增加对象存储 | 无新增 | API 文档、监控 | 无 |
| P4 | 根据 Skill 增长扩容 | 无新增 | 支付系统 | 无 |
| P5 | 如负载增长可升级为 8C16G | 无新增 | 向量数据库（可选） | 无 |
| P6 | Kubernetes 或多节点部署 | 企业专属域名（按需） | 企业级监控、日志、CI/CD | 企业自定义模型 |
