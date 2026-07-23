# AI Company Workflow Standard

Version: v1.0

Status: Draft

Owner: AI Project Manager

Last Updated: 2026-07-12

---

## 1. Workflow Design Principles

### Principle 1 — Trigger First

每个 Workflow 必须有明确的 Trigger。

无 Trigger 不得启动 Workflow。

Trigger 未满足不得推进。

---

### Principle 2 — Document Handoff

所有阶段之间必须通过文档交接。

禁止口头或非文档化交接。

上游 Agent 的输出是下游 Agent 的唯一输入。

---

### Principle 3 — Single Entry

所有需求必须通过 AI Project Manager 进入。

禁止任何 Agent 绕过 AI Project Manager 直接启动 Workflow。

---

### Principle 4 — Fail Return

任何阶段失败必须返回上一阶段。

禁止从失败阶段原地重试。

---

### Principle 5 — MVP Compatible

Workflow 设计必须支持一人公司场景。

当人力资源不足时，允许同一 Agent 承担多个角色，但必须在 Workflow 实例中明确记录角色切换。

禁止跳过阶段。

---

### Principle 6 — Scale Aware

Workflow 必须根据需求规模（S0~S4）自动匹配复杂度。

禁止小型需求走完整重型 Workflow。

禁止大型需求走简化 Workflow。

---

## 2. Workflow Lifecycle

所有 Workflow 遵循统一的阶段生命周期：

```
Trigger
   │
   ▼
  Pending ──→ Analyzing ──→ Designing ──→ Developing ──→ Reviewing ──→ Testing ──→ Accepting ──→ Releasing ──→ Done
   │              │              │               │              │             │              │              │
   └── Blocked ───┴── Blocked ───┴─── Blocked ───┴── Blocked ──┴── Blocked ─┴── Blocked ──┴── Blocked ──┴── Rolled Back
                        │
                        ▼
                     Failed（返回上一阶段）
```

| 状态 | 说明 |
|------|------|
| Pending | 已接收，等待处理 |
| Analyzing | 需求分析中 |
| Designing | 方案设计中 |
| Developing | 开发中 |
| Reviewing | 评审中 |
| Testing | 测试中 |
| Accepting | 产品验收中 |
| Releasing | 发布中 |
| Done | 完成 |
| Blocked | 阻塞，等待外部输入 |
| Failed | 失败，返回上一阶段 |
| Rolled Back | 回滚 |

---

## 3. Feature Workflow

适用于新功能开发、模块开发、系统升级等正向需求。

### 规模映射

| 规模 | 适用说明 |
|------|----------|
| S0 | 不适用（微小修改走 Bug Workflow） |
| S1 | 普通功能 |
| S2 | 模块开发 |
| S3 | 系统升级 |
| S4 | 战略项目 |

### S1 规模

| 属性 | 内容 |
|------|------|
| **Trigger** | PRD 完成 + AI Project Manager 分配 |
| **Input** | 需求说明、PRD、Project Standard |
| **Responsible Agent** | PM → Engineer → Reviewer → QA |
| **Architect** | 不参与 |
| **Output** | 功能代码、Review Report、Test Report |
| **Exit Condition** | QA 通过 + Product Acceptance 确认 |

---

#### S1 流程

```
Trigger: PRD Ready
    │
    ▼
PM: PRD → 用户故事
    │
    ▼
Engineer: 开发 → 自测
    │
    ▼
Reviewer: Code Review
    │
    ▼
QA: 功能测试 → 回归测试
    │
    ▼
Product Acceptance
    │
    ▼
Release
    │
    ▼
Done
```

---

### S2~S4 规模

| 属性 | 内容 |
|------|------|
| **Trigger** | PRD 完成 + AI Project Manager 分配 |
| **Input** | 需求说明、PRD、Project Standard、技术参考文档 |
| **Responsible Agent** | PM → Architect → Engineer → Reviewer → QA |
| **Architect** | 必须参与 |
| **Output** | Architecture.md + 功能代码 + Review Report + Test Report |
| **Exit Condition** | Architect 确认架构合规 + QA 通过 + Product Acceptance 确认 |

---

#### S2~S4 流程

```
Trigger: PRD Ready
    │
    ▼
PM: PRD → 用户故事
    │
    ▼
Architect: 技术方案 → ADR（如需）
    │
    ▼
Engineer: 开发 → 自测
    │
    ▼
Reviewer: Code Review → Architecture Review
    │
    ▼
QA: 功能测试 → 回归测试
    │
    ▼
Product Acceptance
    │
    ▼
Release
    │
    ▼
Done
```

---

## 4. Bug Workflow

适用于 Bug 修复、错误修正等负向需求。

### 规模映射

| 规模 | 适用说明 |
|------|----------|
| S0 | 微小 Bug（文案错误、样式错位、简单逻辑错误） |
| S1 | 普通 Bug（功能异常、数据错误、流程阻断） |
| S2+ | 不适用（应转为 Feature Workflow） |

### S0 规模

| 属性 | 内容 |
|------|------|
| **Trigger** | Bug Report 确认 + AI Project Manager 分配 |
| **Input** | Bug Report（含复现步骤、预期行为、实际行为）、环境信息 |
| **Responsible Agent** | Engineer → Reviewer → QA |
| **PM** | 不参与 |
| **Architect** | 不参与 |
| **Output** | 修复代码、Review Report、Test Report |
| **Exit Condition** | QA 验证 Bug 已修复 |

---

#### S0 流程

```
Trigger: Bug Report Confirmed
    │
    ▼
Engineer: 定位 → 修复 → 自测
    │
    ▼
Reviewer: Code Review
    │
    ▼
QA: 验证修复 → 回归测试
    │
    ▼
Release（Hotfix）
    │
    ▼
Done
```

---

### S1 规模

| 属性 | 内容 |
|------|------|
| **Trigger** | Bug Report 确认 + AI Project Manager 评估 |
| **Input** | Bug Report（含复现步骤、预期行为、实际行为）、影响范围分析 |
| **Responsible Agent** | PM → Engineer → Reviewer → QA |
| **Architect** | 不参与 |
| **Output** | 修复代码 + 影响范围说明 + Review Report + Test Report |
| **Exit Condition** | QA 验证 Bug 已修复 + PM 确认影响范围已控制 |

---

#### S1 流程

```
Trigger: Bug Report Confirmed
    │
    ▼
PM: 影响范围评估
    │
    ▼
Engineer: 定位 → 修复 → 自测
    │
    ▼
Reviewer: Code Review
    │
    ▼
QA: 验证修复 → 回归测试
    │
    ▼
PM: 影响确认
    │
    ▼
Release
    │
    ▼
Done
```

---

## 5. Optimization Workflow

适用于性能优化、成本优化、代码重构等技术改进需求。

### 规模映射

| 规模 | 适用说明 |
|------|----------|
| S0 | 微小优化（单行代码优化、配置调整） |
| S1 | 普通优化（模块级性能/成本优化） |
| S2 | 大型优化（架构级重构、数据库优化） |
| S3+ | 不适用（应转为 Feature Workflow） |

### S0 规模

| 属性 | 内容 |
|------|------|
| **Trigger** | 优化建议确认 + AI Project Manager 分配 |
| **Input** | 优化建议（含当前数据、预期效果） |
| **Responsible Agent** | Engineer → Reviewer → QA |
| **PM** | 不参与 |
| **Architect** | 不参与 |
| **Output** | 优化代码、效果对比报告 |
| **Exit Condition** | 优化效果可量化验证 |

---

### S1~S2 规模

| 属性 | 内容 |
|------|------|
| **Trigger** | 优化建议确认 + AI Project Manager 分配 |
| **Input** | 优化建议（含当前数据、预期效果、技术方案） |
| **Responsible Agent** | PM → Architect → Engineer → Reviewer → QA |
| **Output** | 优化方案 + 优化代码 + 效果对比报告 + Test Report |
| **Exit Condition** | 优化效果达成预期目标 + QA 确认无回归 |

---

## 6. Research Workflow

适用于技术调研、方案选型、PoC（概念验证）等探索性任务。

### 规模映射

| 规模 | 适用说明 |
|------|----------|
| S0 | 不适用 |
| S1 | 单项技术调研（如：DeepSeek API 调研） |
| S2 | 方案选型（如：消息队列选型、数据库选型） |
| S3 | 系统级调研（如：Kubernetes 可行性调研） |
| S4 | 战略级调研（如：私有化部署方案） |

| 属性 | 内容 |
|------|------|
| **Trigger** | Research Task 确认 + AI Project Manager 分配 |
| **Input** | Research 题目、背景说明、评估标准 |
| **Responsible Agent** | PM → Architect |
| **Engineer** | 不参与（除非需要 PoC） |
| **Reviewer** | 不参与 |
| **QA** | 不参与 |
| **Output** | Research Report（含结论、建议、风险） |
| **Exit Condition** | PM + Architect 确认 Research Report 完成 |

---

#### Research 流程

```
Trigger: Research Task Assigned
    │
    ▼
PM: Research 目标定义
    │
    ▼
Architect: 调研 → 分析 → 撰写报告
    │
    ▼
PM + Architect: 结论评审
    │
    ▼
ADR（如需）
    │
    ▼
Done
```

---

## 7. Emergency Workflow

适用于生产环境紧急问题（服务宕机、安全漏洞、数据丢失等）。

### 规模映射

| 规模 | 适用说明 |
|------|----------|
| S0 | 微小紧急问题（非关键功能异常） |
| S1 | 紧急问题（核心功能异常、安全漏洞） |
| S2+ | 不适用（应升级为独立项目） |

### 核心规则

1. Emergency Workflow 允许跳过 PRD 和完整 QA 阶段
2. 但必须经过 **Review** 和 **快速验证**
3. 紧急修复后 24 小时内必须补充紧急报告
4. 禁止未经过 Review 直接上线

| 属性 | 内容 |
|------|------|
| **Trigger** | 紧急事件确认 + AI Project Manager 手动触发 |
| **Input** | 事件描述、影响范围、严重级别 |
| **Responsible Agent** | Architect → Engineer |
| **PM** | 不参与（事后补充报告） |
| **Reviewer** | 必须参与（快速 Review） |
| **QA** | 不参与（由 Engineer 自验证 + Reviewer 确认） |
| **Output** | 修复代码 + 紧急修复报告（24 小时内补交） |
| **Exit Condition** | 服务恢复 + 紧急报告提交 |

---

#### Emergency 流程

```
Trigger: Emergency Event Confirmed
    │
    ▼
Architect: 影响评估 → 修复方案
    │
    ▼
Engineer: 修复 → 自验
    │
    ▼
Reviewer: 快速 Code Review（可异步）
    │
    ▼
Hotfix Release
    │
    ▼
服务恢复确认
    │
    ▼
（24 小时内）
    │
    ▼
PM: 紧急修复报告 → 复盘
    │
    ▼
Done
```

---

## 8. Workflow State Machine

### 全局状态定义

```
                    ┌─────────────────────────────┐
                    │         Trigger              │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                  ┌──────│   Pending     │──────┐
                  │      └──────┬───────┘      │
                  │             │              │
                  ▼             ▼              ▼
           ┌──────────┐  ┌───────────┐  ┌──────────┐
           │ Blocked  │  │ Analyzing │  │  Done    │
           └──────────┘  └─────┬─────┘  └──────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Designing   │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌────────────┐        ┌──────────┐
             │ Developing │        │ Blocked  │
             └──────┬─────┘        └──────────┘
                    │
                    ▼
             ┌────────────┐
             │ Reviewing  │
             └──────┬─────┘
                    │
                    ▼
             ┌────────────┐
             │  Testing   │
             └──────┬─────┘
                    │
                    ▼
             ┌──────────────┐
             │  Accepting   │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │  Releasing   │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │     Done     │
             └──────────────┘
```

### 状态转移规则

| 当前状态 | 允许的下一个状态 | 条件 |
|----------|----------------|------|
| Pending | Analyzing | 需求已通过 Requirement Analyzer |
| Pending | Done | 拒绝需求 |
| Analyzing | Designing | 分析完成 |
| Analyzing | Blocked | 缺少必要信息 |
| Analyzing | Failed | 需求不合法 |
| Blocked | 返回原状态 | 阻塞解除 |
| Designing | Developing | 设计评审通过 |
| Designing | Failed | 设计不通过，返回 Analyzing |
| Developing | Reviewing | 开发完成 + 自测通过 |
| Developing | Failed | 开发失败，返回 Designing |
| Reviewing | Testing | Review 通过 |
| Reviewing | Failed | Review 不通过，返回 Developing |
| Testing | Accepting | 测试通过 |
| Testing | Failed | 测试不通过，返回 Developing |
| Accepting | Releasing | 验收通过 |
| Accepting | Failed | 验收不通过，返回 Testing 或 Developing |
| Releasing | Done | 发布完成 |
| Releasing | Rolled Back | 发布失败 |

### 失败回退规则

- Failed 状态必须返回**上一阶段**，不可跨阶段回退
- 连续失败 3 次必须升级到 AI Project Manager
- 连续失败 5 次必须升级到 CEO

---

## 9. Agent Dispatch Rules

### 调度矩阵

| Workflow 类型 | PM | Architect | Engineer | Reviewer | QA |
|--------------|:--:|:---------:|:--------:|:--------:|:--:|
| Feature (S1) | ✅ 必须 | — | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| Feature (S2~S4) | ✅ 必须 | ✅ 必须 | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| Bug (S0) | — | — | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| Bug (S1) | ✅ 必须 | — | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| Optimization (S0) | — | — | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| Optimization (S1~S2) | ✅ 必须 | ✅ 必须 | ✅ 必须 | ✅ 必须 | ✅ 必须 |
| Research | ✅ 必须 | ✅ 必须 | — | — | — |
| Emergency | — | ✅ 必须 | ✅ 必须 | ✅ 必须 | — |

### 一人公司场景

当人力资源不足时，按以下规则合并角色：

| 角色组合 | 允许场景 | 限制 |
|---------|---------|------|
| PM + Engineer | 单人开发 | 开发前必须先完成 PRD，不得边写边设计 |
| Architect + Engineer | 单人开发 | 架构方案必须先形成 ADR |
| Engineer + Reviewer | 单人开发 | 自 Review 后必须等待 > 30 分钟再确认 |
| QA + Engineer | **禁止** | QA 必须由独立视角执行，不可自测自验 |

---

## 10. Handoff Rules

### 基本规则

1. 所有 Handoff 必须通过文档完成
2. 下游 Agent 收到文档后必须确认接收
3. 下游 Agent 拒绝接收时，上游 Agent 必须修复问题
4. Handoff 文档必须包含：版本号、发送 Agent、接收 Agent、时间戳

### Handoff 文档格式

```markdown
## Handoff Record

- From: [Agent Name]
- To: [Agent Name]
- Timestamp: [YYYY-MM-DD HH:mm]
- Version: [v1.0]
- Status: [Handoff Sent / Handoff Accepted / Handoff Rejected]

## 交付物清单

- [ ] [交付物路径 1]
- [ ] [交付物路径 2]

## 备注

[补充说明]
```

### Handoff 流程

```
Agent A 完成输出
    │
    ▼
Agent A 生成 Handoff Record
    │
    ▼
Agent A → AI Project Manager（通知 Handoff）
    │
    ▼
AI Project Manager → Agent B（通知任务）
    │
    ▼
Agent B 读取 Handoff Record + 交付物
    │
    ├── Agent B 接受 → 开始执行
    │
    └── Agent B 拒绝 → 返回 Handoff Record + 拒绝原因
                          │
                          ▼
                     Agent A 修复后重新 Handoff
```

---

## 11. Approval Rules

### 需要审批的场景

| 场景 | 审批人 | 说明 |
|------|--------|------|
| PRD 确认 | PM | PRD 完成即视为自动确认 |
| 架构方案 | Architect | 大型方案需形成 ADR |
| Code Review | Reviewer | 所有代码变更必须 Review |
| QA 验收 | QA | 测试通过即视为自动确认 |
| 产品验收 | PM | 功能符合 PRD |
| 紧急上线 | Architect | Emergency Workflow 必须 |
| 跨 Phase 变更 | CEO | 影响 Roadmap 的变更 |
| Standards 修改 | CEO | 任何 Standards 变更 |

### 审批超时规则

| 角色 | 超时时间 | 自动规则 |
|------|---------|---------|
| Reviewer | 4 小时 | 自动升级到 Architect |
| QA | 4 小时 | 自动升级到 PM |
| PM | 8 小时 | 自动升级到 AI Project Manager |
| Architect | 8 小时 | 自动升级到 AI Project Manager |
| CEO | 24 小时 | 自动视为暂缓 |

---

## 12. Rollback Rules

### 触发 Rollback 的场景

| 场景 | 触发条件 | 决策者 |
|------|---------|--------|
| 发布失败 | Release 阶段异常 | Engineer |
| 线上 Bug | 发布后 1 小时内发现 Bug | Architect |
| 兼容性问题 | 发布后发现兼容性断裂 | Architect |
| 性能回退 | 性能指标下降超过 20% | PM |

### Rollback 流程

```
Rollback Triggered
    │
    ▼
Architect: 评估影响范围
    │
    ▼
Engineer: 执行 Rollback
    │
    ▼
QA: 验证 Rollback 结果
    │
    ▼
PM: 确认服务恢复
    │
    ▼
记录 Rollback 原因 → 创建 Bug / Feature Workflow
    │
    ▼
Done
```

### Rollback 规则

- Rollback 完成后必须在 24 小时内创建修复 Workflow
- 同一模块连续 Rollback 2 次必须升级到 Architect 评估
- 同一模块连续 Rollback 3 次必须升级到 CEO

---

## 13. Exception Handling

### 异常类型

| 异常类型 | 说明 | 处理方式 |
|---------|------|---------|
| 需求不清晰 | 需求信息不足以开始分析 | 返回需求方补充（Blocked 状态） |
| 设计不通过 | 技术方案评审不通过 | 返回 Designing 阶段重试 |
| 开发失败 | 功能开发未通过自测 | 返回 Designing 阶段 |
| Review 不通过 | Code Review 发现严重问题 | 返回 Developing 阶段 |
| 测试不通过 | QA 测试未通过 | 返回 Developing 阶段 |
| 验收不通过 | 产品验收未通过 | 返回 Developing 或 Testing 阶段 |
| 发布失败 | Release 异常 | 执行 Rollback Rules |
| 连续失败 | 同一阶段失败 3 次 | 升级到 AI Project Manager |
| 严重失败 | 同一阶段失败 5 次 | 升级到 CEO |

### 异常处理原则

1. **Fail Fast**: 尽早发现，尽早返回
2. **No Silent Failure**: 任何失败必须记录
3. **Escalation Chain**: Engineer → Reviewer → Architect → AI Project Manager → CEO
4. **Post-mortem**: 任何 S2+ 的失败必须在修复后 48 小时内完成复盘报告

---

## 14. Workflow Naming Convention

### Workflow 实例命名

格式：

```
[Workflow Type]-[S-Level]-[Short Description]-[YYYYMMDD]
```

示例：

```
feature-s2-add-pricing-engine-20260712
bug-s0-fix-login-typo-20260712
optimization-s1-optimize-router-latency-20260712
research-s2-database-sharding-20260712
emergency-s1-auth-service-down-20260712
```

### Workflow 文件命名

格式：

```
[workflow-type]-workflow-[s-level].md
```

示例：

```
feature-workflow-s1.md
bug-workflow-s0.md
emergency-workflow-s1.md
```

### Handoff 文档命名

格式：

```
handoff-[from-agent]-to-[to-agent]-[workflow-id].md
```

示例：

```
handoff-architect-to-engineer-feature-s2-pricing-20260712.md
```

---

## 15. Workflow Checklist

### 启动前检查

□ Trigger 是否已满足？

□ Input 是否已准备完整？

□ Responsible Agent 是否已分配？

□ Workflow 类型是否匹配需求？

□ 需求规模（S0~S4）是否已确认？

---

### 执行中检查

□ 当前阶段是否按 Workflow 推进？

□ 是否有阶段被跳过？

□ 每个阶段的输出是否已形成文档？

□ Handoff 是否已通过 AI Project Manager？

□ 是否有异常需要升级？

---

### 完成检查

□ Output 是否已交付？

□ Exit Condition 是否已满足？

□ 所有阶段的文档是否已归档？

□ 是否有需要记录的复盘事项？

□ Workflow 实例是否已标记为 Done？

---

# End

本规范是 AI Company 所有 Workflow 的统一标准。

所有 Workflow 实例必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。
