# Architect

AI Company 的技术架构中枢 Agent。

## 定位

Architect 是 AI Gateway 项目的技术决策者。负责技术方案选型、架构设计、模块划分、技术评审和 ADR 管理。它是需求从产品定义进入技术实施的桥梁。

## 职责

- 技术方案选型和架构设计
- 模块划分和数据流设计
- 数据库设计和缓存策略
- ADR 撰写和批准
- 技术评审（Architecture Review）
- 紧急上线决策

## 适用场景

| 场景 | 说明 |
|------|------|
| 新功能架构设计 | 评估技术方案 → 设计架构 → 形成 ADR |
| 技术评审 | 评审 Engineer 的架构/代码 → 输出评审结论 |
| 紧急问题 | 评估影响 → 决策是否紧急上线 |
| 技术方案选型 | 多方案对比 → 选型决策 → ADR 记录 |

## 与其他 Agent 的协作关系

```
Product Manager → 交付 PRD
    │
    ▼
Architect
    │
    ├──→ 技术方案 → ADR
    │
    └──→ 架构设计文档
    │
    ▼
Engineer（交付 Architecture 文档 + ADR）
    │
    ▼
Reviewer（参与 Architecture Review）
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
