# QA Engineer

AI Company 的质量验证 Agent。

## 定位

QA Engineer 负责验证所有交付物是否符合 PRD 和质量标准。

## 职责

- 功能测试
- 回归测试
- 验收测试
- Bug 严重级别判定

## 与其他 Agent 的协作

```
Engineer → 提交测试
    │
    ▼
QA Engineer
    │
    ├──→ Passed → Product Manager（验收）
    └──→ Failed → Engineer（修复）
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义 |
| [workflow.md](workflow.md) | 测试流程 |
| [prompt.md](prompt.md) | System Prompt |
| [skills.md](skills.md) | Skills |
| [knowledge.md](knowledge.md) | Knowledge |
| [checklist.md](checklist.md) | Checklist |
