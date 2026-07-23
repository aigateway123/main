# Requirement Analyzer — Skills

引用 [09-skill-standard.md](../../01-standards/09-skill-standard.md) §12 Skill 与 Agent 映射。

---

## Required Skills

| Skill ID | 说明 | 存储位置 |
|----------|------|---------|
| workflow-skill | Workflow 匹配：根据需求类型和规模推荐正确的 Workflow | `TODO: 需在 04-skills/ 创建` |
| task-analysis-skill | 需求分析：类型分类、规模评估、风险评估 | `TODO: 需在 04-skills/ 创建` |

---

## Optional Skills

| Skill ID | 说明 | 存储位置 |
|----------|------|---------|
| domain-knowledge-skill | 领域知识：AI 模型、Provider、定价等业务理解 | `TODO: 需在 04-skills/ 创建` |

---

## 加载规则

引用 [08-knowledge-standard.md](../../01-standards/08-knowledge-standard.md) §11 Knowledge Loading Rules：

- Required Skills：Requirement Analyzer 启动时必须加载
- Optional Skills：根据当前需求类型按需加载
