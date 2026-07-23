# AI Project Manager — Workflow

## 全局流程图

```mermaid
graph TD
    Start([需求提出]) --> AIPM{AI Project Manager}
    AIPM --> RA[Requirement Analyzer]
    RA --> Scale{规模评估}
    Scale -->|S0| BugWF[Bug Workflow]
    Scale -->|S1| FeatureWF1[Feature Workflow S1]
    Scale -->|S2| FeatureWF2[Feature Workflow S2]
    Scale -->|S3| FeatureWF3[Feature Workflow S3]
    Scale -->|S4| FeatureWF4[Feature Workflow S4 + CEO]
    Scale -->|Emergency| EmerWF[Emergency Workflow]

    BugWF --> PM_Bug{含 PM?}
    PM_Bug -->|S0 No| Eng_Bug[Engineer → Reviewer → QA]
    PM_Bug -->|S1 Yes| PM_Bug_Eng[PM → Engineer → Reviewer → QA]

    FeatureWF1 --> PM_F1[PM → Engineer → Reviewer → QA]
    FeatureWF2 --> ARC_F2[PM → Architect → Engineer → Reviewer → QA]
    FeatureWF3 --> ARC_F3[PM → Architect → Engineer → Reviewer → QA]
    FeatureWF4 --> ARC_F4[PM → Architect → Engineer → Reviewer → QA]

    Eng_Bug --> Done_Bug([Done])
    PM_Bug_Eng --> Done_Bug
    PM_F1 --> Done_F1([Done])
    ARC_F2 --> Done_F2([Done])
    ARC_F3 --> Done_F3([Done])
    ARC_F4 --> CEO_Approve{CEO 审批} --> Done_F4([Done])
    EmerWF --> Done_Emer([Done])
```

---

## 1. Feature Workflow

适用于新功能开发、模块开发、系统升级等正向需求。

### S1 规模（普通功能）

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant Eng as Engineer
    participant Rev as Reviewer
    participant QA as QA

    AIPM->>PM: 分配 Task + Workflow
    PM->>PM: 撰写 PRD
    PM->>Eng: Handoff PRD
    Eng->>Eng: 开发 + 自测
    Eng->>Rev: Handoff Review
    Rev->>Rev: Code Review
    Rev->>QA: Handoff QA
    QA->>QA: 功能测试 + 回归测试
    QA->>PM: 验收
    PM->>AIPM: 通知 Release
```

### S2~S4 规模（模块开发 / 系统升级 / 战略项目）

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ARC as Architect
    participant Eng as Engineer
    participant Rev as Reviewer
    participant QA as QA

    AIPM->>PM: 分配 Task + Workflow
    PM->>PM: 撰写 PRD
    PM->>ARC: Handoff PRD
    ARC->>ARC: 技术方案 + ADR（如需）
    ARC->>Eng: Handoff Architecture
    Eng->>Eng: 开发 + 自测
    Eng->>Rev: Handoff Review
    Rev->>Rev: Code Review + Architecture Review
    Rev->>QA: Handoff QA
    QA->>QA: 功能测试 + 回归测试
    QA->>PM: 验收
    PM->>AIPM: 通知 Release
```

---

## 2. Bug Workflow

适用于 Bug 修复、错误修正等负向需求。

### S0（微小 Bug）

```mermaid
sequenceDiagram
    participant Eng as Engineer
    participant Rev as Reviewer
    participant QA as QA

    AIPM->>Eng: 分配 Bug Task
    Eng->>Eng: 定位 → 修复 → 自测
    Eng->>Rev: Handoff Review
    Rev->>Rev: Code Review
    Rev->>QA: Handoff QA
    QA->>QA: 验证修复
    QA->>AIPM: 通知 Hotfix Release
```

### S1（普通 Bug）

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant Eng as Engineer
    participant Rev as Reviewer
    participant QA as QA

    AIPM->>PM: 分配 Bug Task
    PM->>PM: 影响范围评估
    PM->>Eng: Handoff
    Eng->>Eng: 定位 → 修复 → 自测
    Eng->>Rev: Handoff Review
    Rev->>Rev: Code Review
    Rev->>QA: Handoff QA
    QA->>QA: 验证修复 + 回归测试
    QA->>PM: 影响确认
    PM->>AIPM: 通知 Release
```

---

## 3. Optimization Workflow

适用于性能优化、成本优化、代码重构等技术改进需求。

### S0（微小优化）

```mermaid
sequenceDiagram
    participant Eng as Engineer
    participant Rev as Reviewer
    participant QA as QA

    AIPM->>Eng: 分配 Optimization Task
    Eng->>Eng: 优化 → 自测
    Eng->>Rev: Handoff Review
    Rev->>Rev: Code Review
    Rev->>QA: Handoff QA
    QA->>QA: 验证效果
    QA->>AIPM: 完成
```

### S1~S2（普通优化 / 大型优化）

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ARC as Architect
    participant Eng as Engineer
    participant Rev as Reviewer
    participant QA as QA

    AIPM->>PM: 分配 Optimization Task
    PM->>ARC: Handoff
    ARC->>ARC: 优化方案
    ARC->>Eng: Handoff
    Eng->>Eng: 优化 + 自测
    Eng->>Rev: Handoff Review
    Rev->>Rev: Code Review
    Rev->>QA: Handoff QA
    QA->>QA: 验证效果 + 回归测试
    QA->>AIPM: 完成
```

---

## 4. Research Workflow

适用于技术调研、方案选型、PoC 等探索性任务。

```mermaid
sequenceDiagram
    participant PM as Product Manager
    participant ARC as Architect

    AIPM->>PM: 分配 Research Task
    PM->>PM: 定义 Research 目标
    PM->>ARC: Handoff
    ARC->>ARC: 调研 → 分析 → 撰写报告
    ARC->>PM: Handoff Research Report
    PM->>ARC: 结论评审
    ARC->>AIPM: ADR（如需）
    AIPM->>AIPM: 完成
```

---

## 5. Emergency Workflow

适用于生产环境紧急问题（服务宕机、安全漏洞、数据丢失等）。

```mermaid
sequenceDiagram
    participant ARC as Architect
    participant Eng as Engineer
    participant Rev as Reviewer
    participant PM as Product Manager

    AIPM->>ARC: 触发 Emergency Workflow
    ARC->>ARC: 影响评估 → 修复方案
    ARC->>Eng: Handoff 方案
    Eng->>Eng: 修复 → 自验
    Eng->>Rev: 快速 Code Review
    Rev->>Eng: Review 通过
    Eng->>ARC: Hotfix Release
    ARC->>AIPM: 服务恢复确认
    Note over AIPM,PM: 24 小时内补交紧急报告
    PM->>PM: 紧急修复报告 → 复盘
    PM->>AIPM: 复盘完成
```

---

## Workflow 调度规则

| Workflow 类型 | 入口 | 出口 | 调度 Agent |
|--------------|------|------|-----------|
| Feature (S1) | AI Project Manager → PM | Release → Done | AI Project Manager |
| Feature (S2~S4) | AI Project Manager → PM | Release → Done | AI Project Manager |
| Bug (S0) | AI Project Manager → Engineer | Hotfix → Done | AI Project Manager |
| Bug (S1) | AI Project Manager → PM | Release → Done | AI Project Manager |
| Optimization (S0) | AI Project Manager → Engineer | Done | AI Project Manager |
| Optimization (S1~S2) | AI Project Manager → PM | Done | AI Project Manager |
| Research | AI Project Manager → PM | Done | AI Project Manager |
| Emergency | AI Project Manager → Architect | Done | AI Project Manager |
