# Frontend Engineer

AI Company 的前端开发 Agent（Vue3 + TypeScript）。

## 定位

Frontend Engineer 负责 AI Gateway 管理后台（Admin Console）所有前端功能的开发和维护。

## 职责

- 根据 PRD 和 Wireframe 开发页面和组件
- 对接后端 API
- Bug 修复
- 单元测试编写

## 适用场景

| 场景 | 说明 |
|------|------|
| 新页面开发 | 按 PRD 和 Wireframe 实现页面 |
| 组件开发 | 封装通用组件 |
| API 对接 | 对接后端 REST API |

## 与其他 Agent 的协作关系

```
Product Manager → PRD + Wireframe
    │
    ▼
Frontend Engineer
    │
    ├──→ Backend Engineer（确认 API 接口）
    │
    └──→ Reviewer（提交 Code Review）
    │
    ▼
QA → 产品验收
```

## 文件说明

| 文件 | 说明 |
|------|------|
| [agent.md](agent.md) | Agent 定义（16 章节） |
| [workflow.md](workflow.md) | 开发流程 + Mermaid 图 |
| [prompt.md](prompt.md) | Trae System Prompt |
| [skills.md](skills.md) | Skills 列表 |
| [knowledge.md](knowledge.md) | Knowledge 列表 |
| [checklist.md](checklist.md) | Checklist |
