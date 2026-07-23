# Plan: 设计 06-decision-standard.md

## 一致性检查

### 与 AI Gateway 项目规划文档
- 项目规划文档**未定义决策机制相关内容**，无冲突
- 规划文档中的 Roadmap Phase 和架构决策可作为 Decision Matrix 的参考场景

### 与已有 Standards 的一致性检查

| # | 现有约束 | 新标准需遵守 |
|---|---------|-------------|
| 1 | **Project Standard §4**: 8 角色职责定义 | 必须继承，不可修改职责边界 |
| 2 | **Project Standard §4**: Decision Rule（产品→CEO, 架构→Architect, 开发→Full Stack, 测试→QA, 流程→PM） | 必须兼容并细化 |
| 3 | **Project Standard §4**: "任何 Agent 不允许自行决定超出职责范围的事项" | 必须在 Decision Principles 中体现 |
| 4 | **Agent Standard §9**: Agent 不得决定产品方向/Roadmap/商业模式/Standards | 必须在 Decision Levels 中体现 |
| 5 | **Agent Standard §9**: 冲突升级机制 | 必须继承 |
| 6 | **03-workflow-standard §11**: Approval Rules（8 场景 + 5 角色超时） | 必须兼容 |
| 7 | **03-workflow-standard §12**: Rollback 决策规则 | 必须引用 |
| 8 | **03-workflow-standard §13**: Exception Handling 升级链 | 必须兼容 |

## 设计方案

### 文件信息
- **文件名**: `ai-company/01-standards/06-decision-standard.md`
- **版本**: v1.0
- **状态**: Draft
- **Owner**: CEO

### 目录结构（15 章节）

| # | 章节 | 核心内容 |
|---|------|---------|
| 1 | Decision Principles | 6 条原则 |
| 2 | Decision Levels | 4 级决策层级（Strategic/Tactical/Operational/Technical） |
| 3 | Decision Matrix | 40+ 决策场景 × 决策者 矩阵表（核心章节） |
| 4 | CEO Authority | 细化 CEO 决策范围（含不可委托事项） |
| 5 | AI Project Manager Authority | Sprint/Milestone/Workflow/Agent 调度决策 |
| 6 | Requirement Analyzer Authority | 需求分析/规模/风险/Workflow 匹配 |
| 7 | Product Manager Authority | PRD/用户故事/产品设计/验收标准 |
| 8 | Architect Authority | 技术方案/选型/架构/ADR |
| 9 | Engineer Authority | 开发实现/技术债务/局部重构 |
| 10 | Reviewer Authority | 代码质量/架构合规/评审结论 |
| 11 | QA Authority | 测试策略/质量标准/验收结论 |
| 12 | Escalation Rules | 多级升级链 + 超时规则 |
| 13 | Conflict Resolution | 冲突处理流程 + 仲裁规则 |
| 14 | ADR Rules | 必须形成 ADR 的场景 + ADR 格式 |
| 15 | Decision Checklist | 决策前/决策中/决策后检查 |

### Decision Matrix 设计（示例条目）

| 决策事项 | 决策者 | 需要咨询 | 需要通知 | 决策层级 |
|---------|--------|---------|---------|---------|
| 产品方向调整 | CEO | — | 全员 | Strategic |
| Roadmap Phase 变更 | CEO | AI Project Manager | 全员 | Strategic |
| Standards 修改 | CEO | 相关 Owner | 全员 | Strategic |
| Sprint 规划 | AI Project Manager | — | 全员 | Tactical |
| Workflow 选择 | AI Project Manager | Requirement Analyzer | — | Tactical |
| 需求规模评估 | Requirement Analyzer | — | AI Project Manager | Operational |
| PRD 内容 | PM | — | 相关方 | Operational |
| 技术方案 | Architect | — | 相关方 | Technical |
| 代码实现 | Engineer | — | Reviewer | Technical |
| Code Review 结论 | Reviewer | — | Engineer | Technical |
| 测试验收 | QA | — | PM | Operational |
| 紧急上线 | Architect | — | AI Project Manager | Tactical |

## Verification

1. Decision Matrix 覆盖 8 个角色的所有决策场景
2. 与 Project Standard §4 角色职责完全一致，不添加新职责
3. 与 Agent Standard §9 禁止事项完全一致
4. 与 Workflow Standard §11 审批规则兼容
5. ADR Rules 与 Project Standard "所有技术选型必须形成 ADR" 一致
6. Escalation Rules 与 Workflow Standard §13 Exception Handling 兼容
