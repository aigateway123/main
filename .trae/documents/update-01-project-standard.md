# Plan: 更新 01-project-standard.md

## Summary
根据审核结果，对 `01-project-standard.md` 进行 8 项修正，使内容与 `AI Gateway 项目规划.md` 保持一致。

## Changed Items

### 修正 1：项目名称
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **改动**: 顶级标题 `# AI Gateway Project Standard` → 保持不变（用户确认使用 AI Gateway，不使用 Nova）
- **定位部分**：「AI Gateway 是一个面向 AI 开发者与企业的统一 AI 基础设施平台」→ 保持不变

### 修正 2：MVP 第一阶段增补 登录注册 / Gateway / Admin
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 1.2 节「项目目标」→「第一阶段（MVP）」
- **改动**: 在 Provider 接入 上方补充「登录注册」，在 Router 下方补充「Gateway」「Admin」
- **结果**:
  ```
  - 登录注册
  - Provider 接入
  - Model 管理
  - API Key 管理
  - Gateway（核心代理层）
  - Router
  - Admin（管理后台）
  - Dashboard
  - Usage
  - Logs
  ```

### 修正 3：从 P0~P2 范围移除 Billing
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 2.1 节「当前开发范围」
- **改动**: 从允许列表中移除 `Billing`

### 修正 4：在 Phase 2 范围增补 Pricing / Quota / Alert / Budget
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 2.1 节「当前开发范围」
- **改动**: 在 Cost Engine 和 Policy Engine 之间补充 `Pricing`、`Quota`、`Alert`、`Budget`
- **结果**:
  ```
  - Cost Engine
  - Pricing
  - Quota
  - Alert
  - Budget
  - Policy Engine
  ```

### 修正 5：Monitoring → Logs + Usage + Alerts
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 1.2 节「项目目标」→「第二阶段」
- **改动**: `Monitoring` → `Logs + Usage + Alerts`

### 修正 6：Plugin Marketplace → Skill Marketplace
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 2.2 节「当前不开发内容」
- **改动**: `- Plugin Marketplace` → `- Skill Marketplace（Phase 4 开发）`

### 修正 7：第三阶段补充 Agent Runtime
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 1.2 节「项目目标」→「第三阶段」
- **改动**: 在 Skill Marketplace 下方补充：
  ```
  - Agent Runtime（Phase 5）
  ```

### 修正 8：表述统一
- **文件**: `aigateway/ai-company/01-standards/01-project-standard.md`
- **位置**: 第 1.1 节「项目定位」
- **改动**: 
  - 「策略路由」→「智能路由」
  - 「成本控制」→「成本优化」

## Verification
- 逐项检查 8 处修改是否全部落位
- 确认 Markdown 格式正确，无语法错误
