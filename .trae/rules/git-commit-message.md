---
alwaysApply: true
scene: git_message
---

# Git 提交信息规范

## 格式

```
<type>(<scope>): <description>
```

## Type 类型

| Type | 场景 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| refactor | 重构 |
| test | 测试 |
| chore | 构建/工具链 |

## Scope 范围

| Scope | 模块 |
|-------|------|
| gateway | API Gateway |
| policy | Policy Engine |
| router | Router Engine |
| auth | Auth Service |
| billing | Billing Service |
| admin | Admin 前端 |
| infra | 基础设施/Docker |
| docs | 文档 |
| agent | AI Agent |

## 示例

```
feat(gateway): add provider weight router
fix(auth): fix api key validation
docs(readme): update deployment guide
chore(infra): add docker compose for local dev
```
