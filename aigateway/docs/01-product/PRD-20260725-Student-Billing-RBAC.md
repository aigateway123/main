# PRD: 学生账号体系 + 计费模块 + 权限体系

Version: v1.3

Status: Draft

Owner: Product Manager

Last Updated: 2026-07-25

Related Workflow: P1-Iteration-001

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| PRD ID | PRD-20260725-001 |
| Version | v1.3 |
| Status | Draft |
| Owner | Product Manager |
| Related Workflow | P1-Iteration-001 |
| Related Task | P1 迭代 #001 |
| Created | 2026-07-25 |
| Last Updated | 2026-07-25 |

---

## 2. Product Background

### 行业背景

AI Gateway 的目标是成为面向企业和 AI 开发者的大模型统一接入平台。在教育场景中，高校和培训机构需要为学生提供模型 API 的访问能力，同时需要控制成本、分配额度、监控用量。

当前各大模型厂商（OpenAI、DeepSeek 等）不提供精细化的子账号管理办法，教育机构需要一个中间平台来实现：
- 为学生创建独立账号
- 为不同学生分配不同额度
- 按实际用量计费
- 精细控制学生可使用的模型范围

### 用户需求

- **管理员**需要能在后台批量创建和管理学生账号，精细化控制资源分配
- **学生**需要能登录系统，查看自己的额度和使用情况
- **学校/培训机构**需要一套完整的计费体系来控制预算和成本

---

## 3. Problem Statement

AI Gateway MVP 版本只支持管理员单角色，没有学生账号体系、计费模块和权限控制，无法满足教育场景的多用户、精细化管理的需求。

| 问题 | 影响 |
|------|------|
| 无法区分学生和 Admin 角色 | 学生登录后可以访问管理后台所有功能，存在安全风险 |
| 没有额度分配机制 | Admin 无法控制学生使用成本，存在预算超支风险 |
| 没有计费功能 | 无法按实际用量扣费，缺乏成本核算能力 |
| 没有权限控制 | 所有用户拥有相同权限，无法实现职责分离 |

---

## 4. Goals

### 产品目标

- **目标 1**：Admin 可在后台创建和管理学生账号
- **目标 2**：Admin 可为学生账号分配费用额度（如 $10/账号）
- **目标 3**：系统按模型调用用量自动扣费，额度不足时拒绝 API 调用
- **目标 4**：建立完整 RBAC 权限体系，Admin 和 Student 拥有不同功能权限
- **目标 5**：Admin 可指定学生可用模型列表

### 非目标

- <ins>本次不做</ins> 学生分组/班级管理
- <ins>本次不做</ins> 自动充值/续费
- <ins>本次不做</ins> 套餐订阅模式
- <ins>本次不做</ins> 多租户隔离
- <ins>本次不做</ins> 详细财务报表

---

## 5. Business Value

| 价值 | 衡量方式 | 预期效果 |
|------|---------|---------|
| 支持教育场景 | 学生账号数 | 支持 100+ 学生同时使用 |
| 成本可控 | 预算超支次数 | 降低至 0 |
| 管理效率 | 账号管理操作耗时 | 单人可管理 1000+ 学生 |
| 安全合规 | 越权访问事件 | 降低至 0 |

### ROI 分析

- 投入成本：约 3~5 人天开发
- 预期收益：支持教育机构客户接入，扩大产品适用场景
- 预期 ROI：高（低投入、高场景覆盖）

---

## 6. User Story

### 核心用户故事

1. **作为**学生，**我希望**Admin 帮我创建账号后能登录系统，**以便**使用模型 API
2. **作为**学生，**我希望**查看我的剩余额度和历史用量，**以便**规划使用
3. **作为**学生，**我希望**当额度不足时收到明确提示，**以便**及时联系管理员
4. **作为**管理员，**我希望**查看所有学生账号并分配额度，**以便**控制成本
5. **作为**管理员，**我希望**为学生指定可用模型列表，**以便**限制使用范围
6. **作为**管理员，**我希望**管理角色和权限，**以便**控制不同用户的功能访问
7. **作为**管理员，**我希望**查看全平台用量报表，**以便**了解整体使用情况

### 用户角色

| 角色 | 描述 | 权限范围 |
|------|------|---------|
| Admin | 系统管理员，拥有全部管理功能 | 所有功能权限 |
| Student | 学生用户，仅能使用 API 和查看个人用量 | 受限功能权限 |

---

## 7. Functional Requirements

| # | 需求描述 | 优先级 | 备注 |
|---|---------|--------|------|
| FR-1 | Admin 创建学生账号：Admin 在后台创建学生账号，设置邮箱/密码/昵称，创建后角色为 Student | P0 | 不支持自主注册 |
| FR-2 | 登录时返回用户角色信息，前端根据角色展示不同界面 | P0 | — |
| FR-3 | Admin 可在后台查看所有学生列表 | P0 | — |
| FR-4 | Admin 可为学生分配/调整费用额度 | P0 | 单位：美元 |
| FR-5 | 系统在 API 调用完成后自动计算费用并扣减额度 | P0 | 计费公式：input_tokens × input_price + output_tokens × output_price |
| FR-5.1 | 流式场景（SSE）也需统计 token 用量并计费 | P0 | 从流式响应的最后一块 SSE 数据中提取 usage 字段 |
| FR-6 | 额度不足时拒绝 API 调用，返回 402 Payment Required | P0 | 含清晰错误提示 |
| FR-7 | 学生可查看个人额度余额和用量历史 | P0 | — |
| FR-8 | Admin 可查看全平台用量统计报表 | P0 | — |
| FR-9 | 定义 Admin 和 Student 两种角色 | P0 | RBAC 基础 |
| FR-10 | Admin 可创建/编辑/删除自定义角色 | P1 | 扩展 RBAC |
| FR-11 | Admin 可为角色分配功能权限 | P1 | — |
| FR-12 | Admin 可为学生指定可用模型列表 | P0 | 多选模型 |
| FR-13 | API 调用时校验学生可用的模型范围 | P0 | — |
| FR-14 | 学生登录后前端只显示与 Student 角色相关的页面 | P0 | 前端权限控制 |
| FR-15 | 后台接口增加权限校验中间件 | P0 | 后端权限控制 |
| FR-16 | Admin 可启用/禁用学生账号 | P1 | — |
| FR-17 | 模型定价在 Admin 后台可配置，Admin 可动态修改每个模型的计价标准 | P0 | 不写死，修改后即时生效 |
| FR-17.1 | 模型定价支持峰谷计价（如 DeepSeek 白天/夜间不同价格） | P0 | 按时间段配置不同价格 |
| FR-18 | 计算费用时根据调用时间自动匹配对应的定价策略 | P0 | 支持普通定价和峰谷定价两种模式 |

### 优先级定义

| 优先级 | 说明 |
|--------|------|
| P0 | MVP 必须完成 |
| P1 | 重要，建议完成 |
| P2 | 锦上添花 |

---

## 8. Non-functional Requirements

| 类型 | 要求 | 验收标准 |
|------|------|---------|
| 性能 | 计费扣费 < 50ms | 99% 的扣费操作在 50ms 内完成 |
| 安全 | 权限校验不通过返回 403 | 所有受保护接口均有权限校验 |
| 可用性 | 学生注册流程 < 3 步完成 | 注册后直接登录可用 |
| 并发 | 同一账号并发扣费不出现负额度 | 乐观锁/事务保证数据一致性 |
| 精度 | 费用计算保留 6 位小数 | 数据库存储 decimal(16,6) |

---

## 9. User Flow

### 主流程 1：Admin 创建学生账号 → 学生使用 API

```
Admin 登录 → 进入学生管理页
    │
    ▼
点击「创建学生」→ 填写邮箱/密码/昵称
    │
    ▼
系统创建 Student 角色账号 → 生成初始 API Key
    │
    ▼
Admin 设置该学生的可用额度和可用模型
    │
    ▼
学生收到账号信息 → 登录系统
    │
    ▼
前端展示学生界面（API Keys、用量、额度）
    │
    ▼
学生使用 API Key 调用模型
    │
    ▼
系统记录日志 → 计算费用 → 扣减额度
    │
    ▼
额度不足 → 返回 402 错误提示
```

### 主流程 2：Admin 分配额度

```
Admin 登录 → 进入控制台
    │
    ▼
导航到「学生管理」页面
    │
    ▼
查看所有学生列表
    │
    ▼
点击某个学生 → 进入详情页
    │
    ▼
在「额度管理」中设置可用额度和可用模型
    │
    ▼
保存 → 额度生效
```

### 主流程 3：Admin 管理角色权限

```
Admin 登录 → 进入控制台
    │
    ▼
导航到「角色管理」页面
    │
    ▼
查看角色列表（Admin / Student 默认角色）
    │
    ▼
点击角色 → 查看/编辑功能权限（勾选/取消）
    │
    ▼
保存 → 权限生效
```

### 计费详细流程

#### 非流式请求

```
模型 API 请求进入 Gateway
    │
    ▼
Gateway 转发请求到 Provider 并等待完整响应
    │
    ▼
Provider 返回完整 JSON 响应（含 usage 字段）
    │
    ▼
解析响应中的 usage: { prompt_tokens, completion_tokens }
    │
    ▼
系统从 model_pricing 表查询该模型的定价策略

 【普通定价】
 ├─ input_price  = model_pricing.price_per_input_token
 ├─ output_price = model_pricing.price_per_output_token

 【峰谷定价（如 DeepSeek）】
 ├─ 判断当前时间是否在 peak_start ~ peak_end 时段内
 ├─ 高峰时段 → input_price = peak_price_per_input
 │              output_price = peak_price_per_output
 └─ 低谷时段 → input_price = offpeak_price_per_input
                output_price = offpeak_price_per_output
    │
    ▼
计算本次费用：
 cost = input_tokens × input_price + output_tokens × output_price
    │
    ▼
开启数据库事务：
 ├─ 1. 查询用户当前额度 quota_balance（带行锁 FOR UPDATE）
 ├─ 2. 如果 quota_balance >= cost → 扣减：quota_balance = quota_balance - cost
 ├─ 3. 插入 quota_transactions 记录（type = 'deduction', amount = -cost）
 ├─ 4. 更新 users.quota_balance
 └─ 5. 提交事务
    │
    ▼
记录 request_logs（含 cost_amount 字段）
    │
    ▼
返回正常响应给客户端
```

#### 流式请求（SSE）

```
模型 API 请求进入 Gateway
    │
    ▼
Gateway 转发请求到 Provider
    │
    ▼
Provider 开始以 SSE 逐块返回数据
    │
    ▼
Gateway 逐块透传 SSE 数据到客户端（不阻塞）
    │
    ▼
同时，Gateway 在内存中缓存 SSE 最后一块数据
    │
    ▼
检测到 SSE 数据块中包含 "usage" 字段
（格式: data: {"usage": {"prompt_tokens": 150, "completion_tokens": 42}}）
    │
    ▼
提取 prompt_tokens 和 completion_tokens
    │
    ▼
后续扣费流程与非流式一致（查询定价 → 计算费用 → 事务扣减）
```

### 额度不足处理

```
请求进入 → 计算预估最大费用 max_cost
    │
    ▼
查询用户当前额度 quota_balance
    │
    ▼
比较 quota_balance 与 max_cost
    │
    ├── quota_balance >= max_cost → 正常处理（流程同上）
    │
    └── quota_balance < max_cost
            │
            ▼
        返回 402 Payment Required
        {
          "code": "QUOTA_EXCEEDED",
          "message": "账户额度不足，请联系管理员充值",
          "balance": 0.50,
          "estimated_cost": 1.20
        }
```

### 异常流程

| 异常场景 | 处理方式 |
|---------|---------|
| Admin 创建学生时邮箱已存在 | 返回 409 Conflict，提示邮箱已被使用 |
| API 调用时额度不足 | 返回 402 Payment Required，含余额和预估费用 |
| 学生调用未授权的模型 | 返回 403 Forbidden，提示模型不可用 |
| 并发扣费导致额度竞争 | 使用行锁 SELECT FOR UPDATE + 事务保证一致性 |
| 计费计算异常（如模型无定价） | 返回 500，记录错误日志，人工干预 |

---

## 10. Wireframe

### 页面 1：登录页

```
┌─────────────────────────────────┐
│          Nova AI Gateway         │
│                                 │
│     ┌───────────────────┐       │
│     │   邮箱             │       │
│     └───────────────────┘       │
│     ┌───────────────────┐       │
│     │   密码             │       │
│     └───────────────────┘       │
│                                 │
│     [ 登录 ]                    │
│                                 │
│     没有账号？联系管理员创建    │
└─────────────────────────────────┘
```

### 页面 2：学生控制台（侧边栏导航）

```
┌──────────────┬──────────────────────────────────┐
│  Nova AI G/W │  欢迎回来，张三                    │
│──────────────│                                   │
│  📊 仪表盘   │  ┌──────────┐ ┌──────────┐       │
│  🔑 API Keys │  │ 剩余额度  │ │ 今日用量  │       │
│  📈 用量明细 │  │  $8.50   │ │  $0.32   │       │
│  ⚙️ 个人信息  │  └──────────┘ └──────────┘       │
│              │                                   │
│              │  ┌──────────────────────────┐     │
│              │  │  最近 7 天用量趋势图      │     │
│              │  │  ▁▃▅▇▆▄▂                 │     │
│              │  └──────────────────────────┘     │
│              │                                   │
│              │  ┌──────────────────────────┐     │
│              │  │  API Keys 列表            │     │
│              │  │  sk-campus-xxxx... 活跃  │     │
│              │  │  sk-campus-yyyy... 活跃  │     │
│              │  └──────────────────────────┘     │
└──────────────┴──────────────────────────────────┘
```

### 页面 3：Admin 学生管理页

```
┌──────────────┬──────────────────────────────────┐
│  Nova AI G/W │  学生管理                        │
│──────────────│                                   │
│  📊 仪表盘   │  ┌─搜索──────┐ [筛选] [导出]     │
│  🔑 API Keys │  │ 搜索邮箱/名 │                  │
│  🏢 学生管理  │  └──────────┘                   │
│  👥 角色管理  │                                   │
│  🏪 Providers│  ┌──────────────────────────────┐│
│  📦 Models   │  │ 邮箱      额度    模型  状态  ││
│  📈 用量报表  │  │ stu1@...  $10/剩余$8  gpt4  ✓││
│              │  │ stu2@...  $20/剩余$15  all   ✓││
│              │  │ stu3@...  $5/剩余$0   dpsk  ⛔││
│              │  └──────────────────────────────┘│
│              │                                   │
│              │  [点击学生 → 编辑详情对话框]      │
│              │  ┌──────────────────────┐        │
│              │  │ 额度: [$   10.00 ]   │        │
│              │  │ 可用模型: [☑ gpt4]  │        │
│              │  │          [☑ dpsk]   │        │
│              │  │ 状态: [● 启用 ○ 禁用]│        │
│              │  │ [保存]    [取消]    │        │
│              │  └──────────────────────┘        │
└──────────────┴──────────────────────────────────┘
```

### 页面 4：Admin 角色管理页

```
┌──────────────┬──────────────────────────────────┐
│  Nova AI G/W │  角色管理                        │
│──────────────│                                   │
│  ...         │  ┌───────────┐ ┌───────────┐     │
│  👥 角色管理  │  │  Admin    │ │  Student  │     │
│              │  │  内置角色  │ │  内置角色  │     │
│              │  └───────────┘ └───────────┘     │
│              │                                   │
│              │  当前角色：Student                 │
│              │  ┌─功能权限列表──────────────┐    │
│              │  │ ☑ 查看仪表盘              │    │
│              │  │ ☑ 管理 API Key           │    │
│              │  │ ☐ 管理 Providers         │    │
│              │  │ ☐ 管理 Models            │    │
│              │  │ ☐ 管理学生账号            │    │
│              │  │ ☐ 管理角色权限            │    │
│              │  │ ☑ 查看个人用量            │    │
│              │  └───────────────────────────┘   │
│              │                                   │
│              │  [保存] [+ 新建角色]              │
└──────────────┴──────────────────────────────────┘
```

### 交互说明

- 所有用户共用同一套登录页，根据角色返回不同界面
- Admin 创建的账号首次登录后建议修改密码
- 额度编辑通过对话框（Modal）完成，保存后即时生效
- 角色权限编辑通过勾选框（Checkbox）完成，保存后即时生效
- 所有列表页支持搜索和分页

---

## 11. API Impact

| 接口 | Method | 变更类型 | 说明 |
|------|--------|---------|------|
| `/api/v1/auth/register` | POST | 废弃 | 不再支持自主注册，保留 Admin 专用接口 |
| `/api/v1/auth/login` | POST | 修改 | 返回体中新增 `role` 字段 |
| `/api/v1/auth/profile` | GET | 修改 | 返回体中新增 `role`、`quota` 信息 |
| `/api/v1/admin/users` | GET | 新增 | Admin 查看学生列表（分页/搜索） |
| `/api/v1/admin/users` | POST | 新增 | Admin 创建学生账号（邮箱/密码/昵称） |
| `/api/v1/admin/users/{id}/quota` | GET/PUT | 新增 | Admin 查看/设置学生额度 |
| `/api/v1/admin/users/{id}/models` | GET/PUT | 新增 | Admin 查看/设置学生可用模型 |
| `/api/v1/admin/users/{id}/status` | PUT | 新增 | Admin 启用/禁用学生账号 |
| `/api/v1/admin/roles` | GET/POST | 新增 | Admin 角色管理 CRUD |
| `/api/v1/admin/roles/{id}` | GET/PUT/DELETE | 新增 | Admin 角色详情/更新/删除 |
| `/api/v1/admin/roles/{id}/permissions` | PUT | 新增 | Admin 更新角色功能权限 |
| `/api/v1/admin/permissions` | GET | 新增 | Admin 获取所有功能权限列表 |
| `/api/v1/billing/quota` | GET | 新增 | 当前用户查看自己的额度余额 |
| `/api/v1/billing/usage` | GET | 新增 | 当前用户查看用量明细（分页） |
| `/api/v1/admin/pricing` | GET | 新增 | Admin 查看所有模型定价列表 |
| `/api/v1/admin/pricing/{modelId}` | GET/PUT | 新增 | Admin 查看/修改指定模型的定价 |
| `/api/v1/billing/admin/summary` | GET | 新增 | Admin 查看全平台用量汇总 |
| `/api/v1/billing/admin/usage` | GET | 新增 | Admin 查看全平台用量明细 |

### 向后兼容

- 所有新增接口均为全新端点，无兼容性问题
- `register` 接口废弃，但仍保留供内部测试使用
- 修改的接口（login/profile）在原有基础上**增加字段**，不影响旧客户端
- 原有 Admin 用户（admin@nova.com）登录后自动拥有 Admin 角色
- 迁移脚本为现有 users 表的所有用户设置默认角色（Admin）和默认额度（$0）

---

## 12. Database Impact

| 表名 | 变更类型 | 说明 |
|------|---------|------|
| `users` | 修改 | 新增 `role_id` 外键、`quota_balance` 字段 |
| `roles` | 新增 | 角色表（id, name, description, is_system, created_at, updated_at, deleted_at） |
| `permissions` | 新增 | 功能权限表（id, code, name, description, module, created_at） |
| `role_permissions` | 新增 | 角色-权限关联表（role_id, permission_id） |
| `user_model_permissions` | 新增 | 用户-模型授权表（user_id, model_id, created_at） |
| `quota_transactions` | 新增 | 额度交易记录表（user_id, amount, type, reference_id, created_at） |
| `model_pricing` | 新增 | 模型定价表（model_id, price_per_input_token, price_per_output_token, currency, pricing_type, peak_start, peak_end, peak_price_per_input, peak_price_per_output, offpeak_price_per_input, offpeak_price_per_output, updated_at） |

### 迁移计划

- **Migration 005**：新增 roles、permissions、role_permissions、user_model_permissions 表 + 种子数据
- **Migration 006**：新增 quota_transactions、model_pricing 表 + 修改 users 表添加字段
- **先导出模型定价数据脚本**：为现有模型设置默认价格

---

## 13. Risks

| # | 风险描述 | 等级 | 可能性 | 影响 | 缓解方案 |
|---|---------|------|--------|------|---------|
| 1 | 并发扣费导致额度计算错误 | 高 | 中 | 高（额度透支） | 使用数据库乐观锁 + 重试机制 |
| 2 | 现有 Admin 用户缺少角色 | 中 | 高 | 中（无法登录） | 迁移脚本为现有用户设置默认 Admin 角色 |
| 3 | API Key 未关联用户额度 | 中 | 中 | 高（绕过计费） | API Key 验证时检查关联用户额度 |
| 4 | 学生注册后无默认额度 | 低 | 低 | 中（无法使用） | 注册后默认额度为 0，需 Admin 分配 |

---

## 14. Milestone

| 里程碑 | 交付物 | 截止日期 | 负责人 |
|--------|--------|---------|--------|
| M1: 需求评审 | PRD 确认 | 2026-07-26 | PM |
| M2: 架构设计 | ADR + DB 迁移 + API 文档 | M1 + 1天 | Architect |
| M3: 后端实现 | 所有新 API + 计费逻辑 + 权限中间件 | M2 + 2天 | Backend Engineer |
| M4: 前端实现 | 学生端 + Admin 端新页面 | M3 + 1天 | Frontend Engineer |
| M5: 测试验收 | 功能测试 + 产品验收 | M4 + 1天 | QA + PM |

---

## 15. Acceptance Criteria

- [ ] **AC-1**：Admin 可在后台创建学生账号，创建后角色为 Student，学生可凭账号登录
- [ ] **AC-2**：学生登录后只能看到学生界面的功能（仪表盘、API Keys、用量），看不到管理功能
- [ ] **AC-3**：Admin 登录后能看到全部管理功能
- [ ] **AC-4**：Admin 可在学生管理页查看所有学生列表，支持搜索和分页
- [ ] **AC-5**：Admin 可为学生设置额度，保存后学生端即时看到更新
- [ ] **AC-6**：学生调用 API 后额度按模型定价自动扣减
- [ ] **AC-7**：Given 学生额度为 $0, When 该学生调用 API, Then 返回 402 错误
- [ ] **AC-8**：Admin 可为学生指定可用模型，学生只能调用被授权的模型
- [ ] **AC-9**：Given 学生未获授权模型 X, When 该学生调用模型 X, Then 返回 403 错误
- [ ] **AC-10**：Admin 可在角色管理中查看/编辑 Student 和 Admin 角色的功能权限
- [ ] **AC-11**：Admin 可新建自定义角色并分配功能权限
- [ ] **AC-12**：所有 PM 需求已完成
- [ ] **AC-13**：非功能需求达标（并发、性能、精度）
- [ ] **AC-14**：安全评审已通过（权限校验无遗漏）
- [ ] **AC-15**：API 文档已更新
- [ ] **AC-16**：数据库迁移已完成，现有数据无丢失

---

## 16. Open Questions

| # | 问题 | 提出者 | 状态 | 结论 |
|---|------|--------|------|------|
| 1 | 模型定价做成 Admin 后台可配置，初始值参考各厂商官网定价 | PM | 已解决 | Admin 可在后台随时修改 |

---

## 17. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-25 | v1.0 | 初始版本 | Product Manager |
| 2026-07-25 | v1.1 | 修改：学生自主注册改为 Admin 创建；补充计费详细流程 | Product Manager |
| 2026-07-25 | v1.2 | 补充流式请求（SSE）token 统计方案 | Product Manager |
| 2026-07-25 | v1.3 | 补充：定价后台可配置 + 支持峰谷计价（如 DeepSeek） | Product Manager |

---

# End

本 PRD 依据 AI Company PRD Template 设计。
