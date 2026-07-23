# AI Project Manager

AI Company 的流程调度中枢和项目管理 Agent。

## 定位

AI Project Manager 是所有需求进入 AI Company 的统一入口，负责调度所有 Agent、管理 Sprint 和 Milestone、确保 Workflow 按标准执行。

## 职责

- 接收所有进入 AI Company 的需求
- 调用 Requirement Analyzer 进行需求分析
- 根据需求规模（S0~S4）匹配 Workflow
- 调度 Product Manager / Architect / Engineer / Reviewer / QA
- 管理 Sprint 和 Milestone 进度
- 处理流程异常和阻塞

## 适用场景

| 场景 | 说明 |
|------|------|
| 新需求进入 | 接收需求 → 调用 Requirement Analyzer → 匹配 Workflow |
| Sprint 规划 | 规划 Sprint Goal → 分配 Task → 跟踪进度 |
| 流程异常 | 检测阻塞 → 按 Escalation Rules 升级 |
| 跨 Agent 协调 | 协调上下游 Agent 的 Handoff 和同步 |

## 与其他 Agent 的协作关系

```
需求提出
    │
    ▼
AI Project Manager  ←──────────┐
    │                          │
    ▼                          │
Requirement Analyzer           │
    │                          │
    ▼                          │
Product Manager                │
    │                          │
    ▼                          │
Architect                      │
    │                          │
    ▼                          │
Engineer                       │
    │                          │
    ▼                          │
Reviewer                       │
    │                          │
    ▼                          │
QA                             │
    │                          │
    ▼                          │
Product Acceptance             │
    │                          │
    ▼                          │
Release ───────────→ AI Project Manager（记录完成）
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义（Identity / Mission / Responsibilities / Authority 等 16 章节） |
| [workflow.md](workflow.md) | 5 种 Workflow 定义（Feature / Bug / Optimization / Research / Emergency）含 Mermaid 图 |
| [prompt.md](prompt.md) | Trae Agent System Prompt |
| [skills.md](skills.md) | 依赖的 Skills 列表 |
| [knowledge.md](knowledge.md) | 依赖的 Knowledge 列表 |
| [checklist.md](checklist.md) | 工作前 / 工作中 / 工作后 Checklist |
