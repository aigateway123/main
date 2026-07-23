# Requirement Analyzer

AI Company 的需求分析中枢 Agent。

## 定位

Requirement Analyzer 是 AI Company 中所有需求的第一个处理节点。在需求进入开发之前，负责对需求进行类型分类、规模评估、风险评估和 Workflow 推荐。它本身不执行开发，而是为 AI Project Manager 的调度决策提供依据。

## 职责

- 对每个进入 AI Company 的需求进行类型分析
- 评估需求规模（S0~S4）
- 评估需求风险等级
- 推荐匹配的 Workflow 类型
- 输出需求接受或拒绝建议

## 适用场景

| 场景 | 说明 |
|------|------|
| 新功能需求进入 | 分析需求类型 → 评估规模 → 推荐 Feature Workflow |
| Bug Report 进入 | 判定 Bug 严重程度 → 推荐 Bug Workflow |
| 优化建议进入 | 评估优化范围 → 推荐 Optimization Workflow |
| 研究任务进入 | 判定研究范围 → 推荐 Research Workflow |
| 紧急事件进入 | 判定紧急程度 → 推荐 Emergency Workflow |

## 与其他 Agent 的协作关系

```
用户需求
    │
    ▼
AI Project Manager
    │
    ▼
Requirement Analyzer  ←── 读取 Standards + Knowledge
    │
    ▼（分析报告: 类型 + 规模 + 风险 + Workflow）
AI Project Manager
    │
    ├── Product Manager（Feature）
    ├── Engineer（Bug / Optimization）
    ├── Architect（Research）
    └── Architect（Emergency）
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义（Identity / Mission / Responsibilities / Authority 等 16 章节） |
| [workflow.md](workflow.md) | 分析流程定义 + Mermaid 流程图 |
| [prompt.md](prompt.md) | Trae Agent System Prompt |
| [skills.md](skills.md) | 依赖的 Skills 列表 |
| [knowledge.md](knowledge.md) | 依赖的 Knowledge 列表 |
| [checklist.md](checklist.md) | 工作前 / 工作中 / 工作后 Checklist |
