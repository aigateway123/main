# AI Company Task Standard

Version: v1.0

Status: Draft

Owner: AI Project Manager

Last Updated: 2026-07-12

---

## 1. Task Principles

### Principle 1 — Workflow Bound

每个 Task 必须属于一个 Workflow。

禁止无 Workflow 的孤立 Task。

---

### Principle 2 — One Owner

每个 Task 有且仅有一个 Owner。

Owner 对 Task 的交付负责。

---

### Principle 3 — Scale Matched

Task 规模（S0~S4）必须与 Workflow 类型匹配。

禁止 S2 以上 Task 走 S0 Workflow。

---

### Principle 4 — Exit Defined

每个 Task 必须有明确的 Exit Condition。

Exit Condition 未满足不得标记为 Done。

---

### Principle 5 — Dependency Aware

Task 启动前必须确认所有依赖已满足。

禁止在依赖未就绪的情况下启动 Task。

---

### Principle 6 — Traceable

所有 Task 必须有完整的生命周期记录。

包括创建时间、状态变更、完成时间。

---

## 2. Task Lifecycle

```
                    ┌──────────────────┐
                    │    Created       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Ready         │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │  In Progress  │  │   Blocked    │
            └───────┬───────┘  └──────┬───────┘
                    │                 │
                    ▼                 │
            ┌──────────────┐          │
            │   Review     │          │
            └───────┬───────┘          │
                    │                 │
                    ▼                 │
            ┌──────────────┐          │
            │  Acceptance  │          │
            └───────┬───────┘          │
                    │                 │
                    ▼                 │
            ┌──────────────┐          │
            │    Done      │          │
            └──────────────┘          │
                    │                 │
                    ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │  Cancelled   │  │   Blocked    │
            └──────────────┘  └──────────────┘
```

| 状态 | 说明 |
|------|------|
| Created | Task 已创建，等待就绪 |
| Ready | 依赖已满足，可开始执行 |
| In Progress | 执行中 |
| Review | 评审中 |
| Acceptance | 验收中 |
| Done | 完成 |
| Blocked | 阻塞，等待外部条件 |
| Cancelled | 取消 |

---

## 3. Task Priority

### 优先级定义

| 优先级 | 标签 | 说明 | 响应时间 |
|--------|------|------|---------|
| P0 | Critical | 阻断性任务，影响核心功能 | 立即 |
| P1 | High | 重要任务，影响用户体验 | < 4 小时 |
| P2 | Medium | 普通任务 | < 24 小时 |
| P3 | Low | 低优先级任务 | 无限制 |

### Priority 与 S-Level 的关系

| S-Level | 常见 Priority | 说明 |
|---------|--------------|------|
| S0 | P0 / P1 | 微小修改通常紧急 |
| S1 | P1 / P2 | 普通功能 |
| S2 | P2 | 模块开发 |
| S3 | P2 / P3 | 系统升级 |
| S4 | P3 | 战略项目 |

---

## 4. Task Scale

### S-Level 定义（继承 Project Standard）

| 规模 | 说明 | AI Gateway 示例 |
|------|------|----------------|
| S0 | 微小修改 | 修复 Dashboard 显示错误、修改 Provider 配置 |
| S1 | 普通功能 | 新增 API Key 权限控制、优化 Router 策略 |
| S2 | 模块开发 | 开发 Cost Engine、开发 Policy Engine |
| S3 | 系统升级 | 数据库迁移、异步事件架构改造 |
| S4 | 战略项目 | 新 Phase 启动、商业模式调整 |

### S-Level 对应 Workflow

| Task Scale | 可用 Workflow | 对应文档 |
|-----------|--------------|---------|
| S0 | Bug Workflow, Optimization Workflow, Emergency Workflow | 03-workflow-standard.md §4, §5, §7 |
| S1 | Feature Workflow, Bug Workflow, Optimization Workflow, Research Workflow | 03-workflow-standard.md §3, §4, §5, §6 |
| S2 | Feature Workflow, Optimization Workflow, Research Workflow | 03-workflow-standard.md §3, §5, §6 |
| S3 | Feature Workflow, Research Workflow | 03-workflow-standard.md §3, §6 |
| S4 | Feature Workflow, Research Workflow | 03-workflow-standard.md §3, §6 |

### S-Level 预计工期

| 规模 | 预计工期 | 说明 |
|------|---------|------|
| S0 | < 1 天 | 当日完成 |
| S1 | 1~3 天 | 单 Sprint 内完成 |
| S2 | 3~10 天 | 可跨 Sprint |
| S3 | 2~4 周 | 需单独规划 |
| S4 | > 4 周 | 需拆分为多个 S2 / S3 Task |

---

## 5. Task Status

### 状态与 Workflow 阶段映射

| Task 状态 | 对应 Workflow 阶段 | 说明 |
|-----------|-------------------|------|
| Created | Pending | Task 已创建 |
| Ready | Analyzing / Designing | Task 可开始 |
| In Progress | Developing | 执行中 |
| Review | Reviewing | 评审中 |
| Acceptance | Accepting | 验收中 |
| Done | Done | 完成 |
| Blocked | Blocked | 阻塞 |
| Cancelled | — | 取消 |

### 状态迁移规则

| 当前状态 | 允许的下一个状态 | 条件 |
|----------|----------------|------|
| Created | Ready | 依赖已满足 |
| Created | Cancelled | 需求取消 |
| Ready | In Progress | Task 开始执行 |
| Ready | Blocked | 依赖未就绪 |
| In Progress | Review | 开发完成 + 自测通过 |
| In Progress | Blocked | 遇到阻塞 |
| Review | Acceptance | Review 通过 |
| Review | In Progress | Review 不通过，返回修改 |
| Acceptance | Done | 验收通过 |
| Acceptance | In Progress | 验收不通过，返回修改 |
| Blocked | Ready | 阻塞解除 |
| Blocked | Cancelled | 阻塞无法解除 |

---

## 6. Task Owner

### Owner 分配规则

| Task 类型 | Owner |
|----------|-------|
| Feature (S1) | Product Manager |
| Feature (S2~S4) | Product Manager |
| Bug (S0) | Full Stack Engineer |
| Bug (S1) | Product Manager |
| Optimization (S0) | Full Stack Engineer |
| Optimization (S1~S2) | Architect |
| Research | Architect |
| Emergency | Architect |

### Owner 职责

- 对 Task 的交付结果负责
- 协调 Task 所需资源
- 跟踪 Task 进度，及时更新状态
- 识别并上报阻塞和风险
- 确保 Exit Condition 满足后再标记 Done

### 角色切换规则

Owner 可以将 Task 的执行委托给其他 Agent，但 Owner 本身不变。

Owner 对最终交付结果承担最终责任。

---

## 7. Task Input

### 通用 Input 要求

所有 Task 在启动前必须完成以下 Input 准备：

| Input | S0 | S1 | S2 | S3 | S4 |
|-------|:--:|:--:|:--:|:--:|:--:|
| 需求说明 | ✅ | ✅ | ✅ | ✅ | ✅ |
| PRD | — | ✅ | ✅ | ✅ | ✅ |
| Architecture 方案 | — | — | ✅ | ✅ | ✅ |
| ADR | — | — | 可选 | ✅ | ✅ |
| 影响范围分析 | — | — | ✅ | ✅ | ✅ |
| 技术参考文档 | — | 可选 | ✅ | ✅ | ✅ |

### Input 格式

所有 Input 必须遵循 04-document-standard.md 的文档格式规范。

---

## 8. Task Output

### 通用 Output 要求

| Output | S0 | S1 | S2 | S3 | S4 |
|-------|:--:|:--:|:--:|:--:|:--:|
| 代码变更 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Review Report | ✅ | ✅ | ✅ | ✅ | ✅ |
| Test Report | ✅ | ✅ | ✅ | ✅ | ✅ |
| Architecture 更新 | — | 可选 | ✅ | ✅ | ✅ |
| API 文档更新 | — | ✅ | ✅ | ✅ | ✅ |
| 用户故事更新 | — | ✅ | ✅ | ✅ | ✅ |
| Release Note | — | — | ✅ | ✅ | ✅ |

### Output 格式

所有 Output 必须遵循 04-document-standard.md 的文档格式规范。

---

## 9. Deliverables

### 交付物类型

| 类型 | 说明 | 对应文档 |
|------|------|---------|
| Code | 功能代码 | — |
| PRD | 产品需求文档 | 04-document-standard.md §12 |
| Architecture | 架构设计文档 | 04-document-standard.md §14 |
| API | 接口文档 | 04-document-standard.md §13 |
| ADR | 架构决策记录 | 04-document-standard.md §11 |
| Review Report | 评审报告 | 04-document-standard.md §15 |
| Test Report | 测试报告 | 04-document-standard.md §15 |
| Research Report | 调研报告 | 04-document-standard.md §6 |
| Release Note | 发布说明 | — |

### 交付物检查规则

- 每个 Task 的 Output 必须对应明确的交付物
- 交付物必须经过 Review
- 交付物必须归档到正确的目录

---

## 10. Acceptance Criteria

### 定义

每个 Task 必须定义明确的验收标准。

验收标准是判断 Task 是否完成的唯一依据。

### 验收标准要素

一个完整的验收标准必须包含：

```
Given [上下文]
When [触发条件]
Then [预期结果]
```

示例：

```
Given 用户拥有有效的 API Key
When 用户调用 /v1/chat/completions
Then 返回 200 状态码和完整响应
```

### 验收标准检查清单

□ 是否满足所有功能需求？

□ 是否满足非功能需求（性能、安全）？

□ 是否通过 Code Review？

□ 是否通过 QA 测试？

□ 是否更新了相关文档？

□ 是否无引入新的 Bug？

---

## 11. Risk

### 风险等级

| 等级 | 说明 | 处理要求 |
|------|------|---------|
| High | 可能导致 Task 失败 | 必须记录并制定缓解方案 |
| Medium | 可能导致 Task 延期 | 必须记录并持续跟踪 |
| Low | 影响可控 | 可选记录 |

### 风险评估要求

| 场景 | 必须评估 |
|------|---------|
| 跨模块依赖 | ✅ |
| 第三方服务变更 | ✅ |
| 技术方案不确定性 | ✅ |
| 资源不足 | ✅ |
| 时间压缩 | ✅ |

### 风险记录格式

```markdown
## 风险记录

| # | 风险描述 | 等级 | 缓解方案 | 状态 |
|---|---------|------|---------|------|
| 1 | DeepSeek API 限流 | Medium | 增加 Provider 重试机制 | 跟踪中 |
```

---

## 12. Dependency

### 依赖类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 模块依赖 | 依赖其他模块完成 | Router 依赖 Provider 接入 |
| 外部依赖 | 依赖第三方服务 | 数据库、Redis、AI API |
| 资源依赖 | 依赖人力资源 | 依赖 Architect 评审 |
| 决策依赖 | 依赖技术决策 | 等待 ADR 批准 |

### 依赖管理规则

- 所有依赖必须在 Task 启动前识别
- 关键依赖必须有备选方案
- 外部依赖必须标注可用性状态
- 依赖解除后必须通知所有相关方

### 依赖记录格式

```markdown
## 依赖列表

| # | 依赖描述 | 类型 | 阻塞对象 | 预计解除时间 | 状态 |
|---|---------|------|---------|------------|------|
| 1 | 等待 PostgreSQL 部署完成 | 外部依赖 | Engineer | 2026-07-15 | 跟踪中 |
```

---

## 13. Blocking

### 阻塞定义

当 Task 无法继续推进时，标记为 Blocked。

### 阻塞类型

| 类型 | 说明 | 升级路径 |
|------|------|---------|
| 依赖阻塞 | 依赖未就绪 | 通知依赖方 Owner |
| 资源阻塞 | 人力资源不足 | 升级到 AI Project Manager |
| 决策阻塞 | 等待决策 | 按 Decision Rule 升级 |
| 技术阻塞 | 技术问题无法解决 | 升级到 Architect |

### 阻塞处理流程

```
Task 无法推进
    │
    ▼
标记为 Blocked
    │
    ▼
记录阻塞原因
    │
    ▼
通知相关方
    │
    ├── 阻塞解除 → 标记为 Ready
    │
    └── 无法解除 → 升级到 AI Project Manager
            │
            ├── AI Project Manager 决策
            │
            └── 无法决策 → 升级到 CEO
```

### 阻塞超时规则

| Task 规模 | 阻塞超时 | 自动升级 |
|-----------|---------|---------|
| S0 | 2 小时 | AI Project Manager |
| S1 | 4 小时 | AI Project Manager |
| S2 | 8 小时 | AI Project Manager |
| S3 | 24 小时 | CEO |
| S4 | 48 小时 | CEO |

---

## 14. Milestone

### 里程碑定义

Milestone 是项目 Roadmap 中的关键节点。

每个 Phase 包含一个或多个 Milestone。

### Milestone 规则

- 每个 Milestone 必须对应明确的交付物
- Milestone 必须设定截止日期
- Milestone 延期必须通知 AI Project Manager
- Milestone 完成后必须进行复盘

### Milestone 与 Task 的关系

```
Roadmap Phase
    │
    ├── Milestone 1（例如：Provider 接入完成）
    │       │
    │       ├── Task: 接入 OpenAI Provider
    │       ├── Task: 接入 Claude Provider
    │       └── Task: 接入 DeepSeek Provider
    │
    └── Milestone 2（例如：Router MVP 完成）
            │
            ├── Task: 实现 Router 核心逻辑
            ├── Task: 实现权重路由策略
            └── Task: 实现失败切换
```

### Milestone 检查清单

□ 所有关联 Task 是否已完成？

□ 交付物是否已归档？

□ 是否已通过 Product Acceptance？

□ 是否有遗留风险需要跟踪？

---

## 15. Sprint

### Sprint 定义

Sprint 是 AI Company 的迭代周期单位。

### Sprint 周期

| 类型 | 周期 | 适用场景 |
|------|------|---------|
| 标准 Sprint | 1 周 | 正常开发 |
| 快速 Sprint | 3 天 | Bug 修复、紧急任务 |
| 里程碑 Sprint | 2 周 | Phase 结束前的整合 |

### Sprint 规划规则

- 每个 Sprint 由 AI Project Manager 规划
- Sprint 开始前必须完成 Sprint Planning
- Sprint 结束时必须进行 Sprint Review
- 每个 Sprint 必须有明确的 Sprint Goal

### Sprint Planning 内容

```
Sprint Goal: [本 Sprint 要完成的目标]

Sprint Duration: [开始日期] ~ [结束日期]

Tasks:
  - [Task ID] | [Task 名称] | [Owner] | [预计工时]

Risk:
  - [风险描述]
```

### Sprint 容量规则

| 角色 | 每周建议 Task 数 | 说明 |
|------|----------------|------|
| Full Stack Engineer | 3~5 个 S1 Task | 或 1 个 S2 Task |
| Architect | 2~3 个 Task | 含架构评审时间 |
| Product Manager | 3~4 个 Task | 含需求分析时间 |
| Reviewer | 不限 | 异步执行 |
| QA | 不限 | 按 Task 分配 |

---

## 16. Task Template

```markdown
# Task: [Task 标题]

Task ID: [Workflow ID]-[序号]

Workflow ID: [关联 Workflow 实例 ID]

Scale: [S0 / S1 / S2 / S3 / S4]

Priority: [P0 / P1 / P2 / P3]

Status: [Created / Ready / In Progress / Review / Acceptance / Done / Blocked / Cancelled]

Owner: [Agent Name]

Created: YYYY-MM-DD

Deadline: YYYY-MM-DD

---

## Description

[Task 描述]

## Inputs

- [ ] 需求说明
- [ ] PRD（如需）
- [ ] Architecture 方案（如需）

## Acceptance Criteria

- [ ] 验收标准 1
- [ ] 验收标准 2

## Deliverables

- [ ] [交付物路径]

## Dependencies

- [ ] [依赖描述]

## Risks

- [ ] [风险描述]

---

## Status History

| 日期 | 状态 | 说明 |
|------|------|------|
| YYYY-MM-DD | Created | Task 创建 |
| YYYY-MM-DD | Done | Task 完成 |
```

---

## 17. Task Checklist

### 创建检查

□ Task 是否关联到 Workflow？

□ Scale（S0~S4）是否已确认？

□ Priority 是否已分配？

□ Owner 是否已指定？

□ Deadline 是否已设定？

□ Acceptance Criteria 是否已定义？

---

### 执行检查

□ Input 是否已准备完整？

□ 依赖是否已满足？

□ 是否有新的风险需要记录？

□ 是否已更新状态？

---

### 完成检查

□ 所有 Acceptance Criteria 是否已满足？

□ 所有 Deliverables 是否已交付？

□ Review 是否通过？

□ 文档是否已更新？

□ Task 是否已标记为 Done？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | AI Project Manager |

---

# End

本规范是 AI Company 所有 Task 的统一标准。

所有 Task 实例必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。

如与 Workflow Standard 冲突：Workflow Standard 优先。

如与 Document Standard 冲突：Document Standard 优先。
