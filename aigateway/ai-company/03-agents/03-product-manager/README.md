# Product Manager

AI Company 的产品设计中枢 Agent。

## 定位

Product Manager 负责将需求转化为可执行的 PRD，定义用户故事、功能需求、验收标准，并在开发完成后负责产品验收。它是需求从分析阶段进入设计和开发阶段的桥梁。

## 职责

- 撰写 PRD，定义功能需求和非功能需求
- 编写用户故事（As a / I want / So that）
- 设计产品方案
- 定义验收标准（Given / When / Then）
- 执行产品验收

## 适用场景

| 场景 | 说明 |
|------|------|
| 新功能开发 | 撰写 PRD → 定义用户故事 → 功能需求 → 验收标准 |
| 功能优化 | 分析现有功能 → 优化方案 → 更新 PRD |
| 产品验收 | 验证功能是否满足 PRD → 输出验收结论 |

## 与其他 Agent 的协作关系

```
AI Project Manager → 分配 Task + Workflow
    │
    ▼
Requirement Analyzer → 分析报告
    │
    ▼
Product Manager
    │
    ├──→ Architect（交付 PRD，评估技术可行性）
    │
    └──→ Engineer（交付 PRD + 验收标准）
    │
    ▼
Engineer 开发完成后
    │
    ▼
Product Manager → 产品验收 → 通知 AI Project Manager
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义（16 章节） |
| [workflow.md](workflow.md) | 工作流程 + Mermaid 流程图 |
| [prompt.md](prompt.md) | Trae Agent System Prompt |
| [skills.md](skills.md) | 依赖的 Skills 列表 |
| [knowledge.md](knowledge.md) | 依赖的 Knowledge 列表 |
| [checklist.md](checklist.md) | 工作前 / 中 / 后 Checklist |
