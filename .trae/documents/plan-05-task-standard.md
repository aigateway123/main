# Plan: 设计 05-task-standard.md

## 一致性检查

### 与 AI Gateway 项目规划文档
- 项目规划文档**未定义任务管理相关内容**，无冲突
- 规划文档中的 Roadmap Phase 和模块划分可作为 Task Scale 的参考

### 与已有 Standards 的一致性检查

| # | 现有约束 | 新标准需遵守 |
|---|---------|-------------|
| 1 | **Project Standard §3**: S0~S4 定义 | Task Scale 必须继承 S0 微小修改 / S1 普通功能 / S2 模块开发 / S3 系统升级 / S4 战略项目 |
| 2 | **Project Standard §3**: 统一流程 | Task 是 Workflow 中的原子单元 |
| 3 | **Project Standard §4**: AI Project Manager 负责 Sprint / Milestone | Task Standard 必须定义 Sprint 和 Milestone 规则 |
| 4 | **03-workflow-standard §2**: Workflow Lifecycle | Task Status 必须与 Workflow 阶段兼容 |
| 5 | **03-workflow-standard §3**: Feature Workflow (S1 Trigger = PRD Ready) | Task Input 必须匹配 Workflow 的 Input |
| 6 | **04-document-standard §6**: Owner Rule | Task Owner 必须引用 Project Standard 中的 Agent 角色 |
| 7 | **04-document-standard §16**: Checklist Rule | Task Checklist 格式必须兼容 |

## 设计方案

### 文件信息
- **文件名**: `ai-company/01-standards/05-task-standard.md`
- **版本**: v1.0
- **状态**: Draft
- **Owner**: AI Project Manager

### 目录结构（17 章节 + 附录）

| # | 章节 | 核心内容 |
|---|------|---------|
| 1 | Task Principles | 6 条设计原则 |
| 2 | Task Lifecycle | Pending → In Progress → Review → Done → Blocked → Cancelled |
| 3 | Task Priority | P0 Critical / P1 High / P2 Medium / P3 Low |
| 4 | Task Scale | S0~S4 各规模定义 + 对应 Workflow 映射表 |
| 5 | Task Status | 状态定义 + 状态迁移规则 |
| 6 | Task Owner | Owner 分配规则 + Owner 职责 |
| 7 | Task Input | 不同规模任务的 Input 要求 |
| 8 | Task Output | 不同规模任务的 Output 要求 |
| 9 | Deliverables | 各类 Task 的交付物定义 |
| 10 | Acceptance Criteria | 验收标准定义 + 必须包含的要素 |
| 11 | Risk | 风险评估规则 + 风险等级 |
| 12 | Dependency | 依赖关系定义 + 依赖类型 |
| 13 | Blocking | 阻塞处理规则 + 升级机制 |
| 14 | Milestone | 里程碑定义 + 检查规则 |
| 15 | Sprint | Sprint 周期 + 规划规则 |
| 16 | Task Template | 统一 Task 模板 |
| 17 | Task Checklist | 自检清单 |

### 附录：S0~S4 与 Workflow 映射表

| Task Scale | Workflow 类型 | 对应 Agent | 预计工期 |
|-----------|-------------|-----------|---------|
| S0 | Bug / Optimization / Emergency | Engineer → Reviewer → QA | < 1 天 |
| S1 | Feature / Bug / Optimization / Research | PM → Engineer → Reviewer → QA | 1~3 天 |
| S2 | Feature / Optimization / Research | PM → Architect → Engineer → Reviewer → QA | 3~10 天 |
| S3 | Feature / Research | PM → Architect → Engineer → Reviewer → QA | 2~4 周 |
| S4 | Feature / Research | PM → Architect → Engineer → Reviewer → QA + CEO | > 4 周 |

## Verification

1. S0~S4 定义与 Project Standard §3 完全一致
2. Task Status 与 Workflow Lifecycle 兼容
3. Task Owner 与 Project Standard §4 角色定义一致
4. Task 模板符合 04-document-standard §19 Header 规范
5. Task 命名符合 04-document-standard §3 Naming Convention
6. 预计工期与 Roadmap Phase 时间范围兼容
