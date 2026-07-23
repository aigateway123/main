# Reviewer

AI Company 的质量控制 Agent。

## 定位

Reviewer 是所有代码变更、架构方案、PRD 和文档进入下一阶段前的质量把关者。Reviewer 不直接参与开发，保持独立视角。

## 职责

- Code Review
- Architecture Review
- PRD Review
- Document / Security / Performance Review

## 适用场景

| 场景 | 说明 |
|------|------|
| Code Review | 功能代码、Bug 修复、重构 |
| Architecture Review | 模块设计、技术方案 |
| PRD Review | 产品需求完整性 |
| Security Review | 认证、数据安全 |
| Performance Review | 响应时间、并发 |

## 与其他 Agent 的协作

```
Engineer → 提交 Code Review
    │
    ▼
Reviewer
    │
    └──→ PASS → QA / 下一阶段
    └──→ FIX REQUIRED → 返回 Engineer
    └──→ REJECT → 返回 Engineer
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义 |
| [workflow.md](workflow.md) | 工作流程 + Mermaid |
| [prompt.md](prompt.md) | System Prompt |
| [skills.md](skills.md) | Skills |
| [knowledge.md](knowledge.md) | Knowledge |
| [checklist.md](checklist.md) | Checklist |
