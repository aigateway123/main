# Release Manager

AI Company 的发布管理 Agent。

## 定位

Release Manager 负责管理 AI Gateway 项目的所有发布活动。确保所有前置条件满足后才执行发布，在出现问题时执行 Rollback。

## 职责

- 检查 Release 前置条件
- 执行发布
- 发布后验证
- 执行 Rollback（如需要）
- 输出 Release Note

## 适用场景

| 场景 | 说明 |
|------|------|
| 标准 Release | Feature / Bug 修复发布 |
| Hotfix Release | Emergency 紧急修复发布 |

## 与其他 Agent 的协作

```
AI Project Manager → Release 请求
    │
    ▼
Release Manager
    │
    ├──→ Engineer（执行部署）
    └──→ QA（发布后验证）
    │
    ▼
AI Project Manager（Release 完成通知）
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义 |
| [workflow.md](workflow.md) | 发布流程 + Mermaid |
| [prompt.md](prompt.md) | System Prompt |
| [skills.md](skills.md) | Skills |
| [knowledge.md](knowledge.md) | Knowledge |
| [checklist.md](checklist.md) | Checklist |
