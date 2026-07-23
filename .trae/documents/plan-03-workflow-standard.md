# Plan: 设计 03-workflow-standard.md

## 审核结果

### 与 AI Gateway 项目规划文档的一致性检查

阅读 `AI Gateway 项目规划.md` 后，未发现与即将设计的 Workflow Standard 有直接冲突。但有以下注意事项：

| # | 注意点 | 说明 |
|---|--------|------|
| 1 | **Roadmap Phase 约束** | 当前 Phase P0~P2 的模块范围（Gateway、Router、Policy Engine 等）会影响 Workflow 中 Agent Dispatch 的具体职责，但 Workflow Standard 本身是通用标准，不受影响 |
| 2 | **架构建议可引用** | 规划文档中的"5 独立服务"架构建议、异步事件架构等，可在 Optimization Workflow 中引用 |
| 3 | **不冲突** | 规划文档未定义任何 Workflow 相关内容，新标准不产生矛盾 |

### 与已有 Standards 的一致性检查

| # | 现有约束 | 新标准需遵守 |
|---|---------|-------------|
| 1 | **Project Standard §3**: 通用流程 + S0~S4 规模 | 所有 Workflow 必须兼容 S0~S4 体系 |
| 2 | **Project Standard §3**: "任何阶段失败必须返回上一阶段" | 所有 Workflow 的 Exception Handling 必须遵守 |
| 3 | **Project Standard §3**: "禁止跳过流程" | Emergency Workflow 需要特殊处理（允许简化但不可完全跳过） |
| 4 | **Project Standard §2.3**: "MVP First" | Workflow 设计应避免过重，支持快速迭代 |
| 5 | **Agent Standard §2 Principle 3**: "Workflow Driven" | 所有 Agent 必须按照 Workflow 工作 |
| 6 | **Agent Standard §2 Principle 6**: Standards 优先级 | Workflow Standard = 第 3 优先级（位于 Project Standard、Agent Standard 之后） |
| 7 | **Agent Standard §4**: Document Handoff | Handoff Rules 必须基于文档交接 |
| 8 | **Agent Standard §5**: Agent Lifecycle | Workflow 必须兼容 Read Standards → Read Workflow → Read Inputs → Execute → Self Check → Handoff 生命周期 |

---

## 设计方案

### 文件信息
- **文件名**: `ai-company/01-standards/03-workflow-standard.md`
- **版本**: v1.0
- **状态**: Draft

### 目录结构

```
# AI Company Workflow Standard

Version: v1.0 | Status: Draft | Owner: AI Project Manager

## 1. Workflow Design Principles

## 2. Workflow Lifecycle

## 3. Feature Workflow
    - Trigger, Input, Output, Responsible Agent, Exit Condition

## 4. Bug Workflow
    - Trigger, Input, Output, Responsible Agent, Exit Condition

## 5. Optimization Workflow
    - Trigger, Input, Output, Responsible Agent, Exit Condition

## 6. Research Workflow
    - Trigger, Input, Output, Responsible Agent, Exit Condition

## 7. Emergency Workflow
    - Trigger, Input, Output, Responsible Agent, Exit Condition

## 8. Workflow State Machine
    - States: Pending → Analyzing → Designing → Developing → Reviewing → Testing → Accepting → Releasing → Done
    - Failure states: Blocked, Rolled Back

## 9. Agent Dispatch Rules
    - 每种 Workflow 类型对应的 Agent 调度矩阵

## 10. Handoff Rules

## 11. Approval Rules

## 12. Rollback Rules

## 13. Exception Handling

## 14. Workflow Naming Convention

## 15. Workflow Checklist
```

### 各 Workflow 与 S0~S4 的映射关系

| Workflow 类型 | S0 | S1 | S2 | S3 | S4 |
|--------------|:--:|:--:|:--:|:--:|:--:|
| Feature | - | ✅ | ✅ | ✅ | ✅ |
| Bug | ✅ | ✅ | - | - | - |
| Optimization | ✅ | ✅ | ✅ | - | - |
| Research | - | ✅ | ✅ | ✅ | ✅ |
| Emergency | ✅ | ✅ | - | - | - |

### 各 Workflow 的 Agent Dispatch 矩阵

| Workflow | PM | Architect | Engineer | Reviewer | QA |
|----------|:--:|:---------:|:--------:|:--------:|:--:|
| Feature(S1) | ✅ | - | ✅ | ✅ | ✅ |
| Feature(S2+) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bug(S0) | - | - | ✅ | ✅ | ✅ |
| Bug(S1) | ✅ | - | ✅ | ✅ | ✅ |
| Optimization | ✅ | ✅ | ✅ | ✅ | ✅ |
| Research | ✅ | ✅ | - | - | - |
| Emergency | - | ✅ | ✅ | - | - |

## Verification

1. 确认无任何条款与 Project Standard 冲突
2. 确认无任何条款与 Agent Standard 冲突
3. 确认每种 Workflow 都定义了 Trigger / Input / Output / Responsible Agent / Exit Condition
4. 确认所有 Workflow 支持一人公司 + 多 Agent 协作场景
5. 确认 Emergency Workflow 有适当的简化机制但未完全跳过流程
