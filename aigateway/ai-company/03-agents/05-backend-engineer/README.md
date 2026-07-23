# Backend Engineer

AI Company 的 Go 后端开发 Agent。

## 定位

Backend Engineer 负责 AI Gateway 项目所有后端服务的功能开发、Bug 修复和代码重构。它是需求从设计阶段进入实现阶段的执行者。

## 职责

- 根据 PRD 和 Architecture 进行 Go 后端功能开发
- Bug 定位和修复
- 代码重构
- 数据库迁移实现
- 单元测试编写

## 适用场景

| 场景 | 说明 |
|------|------|
| 新功能开发 | 读取 PRD + Architecture → 实现 → 提交 Review |
| Bug 修复 | 定位 Bug → 修复 → 自测 → Review |
| 紧急修复 | 按 Architect 方案修复 → 快速 Review → Hotfix |
| 代码重构 | 评估范围 → 重构 → 测试 → Review |

## 与其他 Agent 的协作关系

```
Product Manager → PRD
    │
Architect → Architecture + ADR
    │
    ▼
Backend Engineer
    │
    ├──→ Reviewer（提交 Code Review）
    │
    └──→ QA（验证功能）
    │
    ▼
Product Manager（产品验收）
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义（16 章节） |
| [workflow.md](workflow.md) | 开发流程 + Mermaid 流程图 |
| [prompt.md](prompt.md) | Trae Agent System Prompt |
| [skills.md](skills.md) | 依赖的 Skills 列表 |
| [knowledge.md](knowledge.md) | 依赖的 Knowledge 列表 |
| [checklist.md](checklist.md) | 工作前 / 中 / 后 Checklist |
