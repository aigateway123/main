# [Agent Name]

Version: v1.0

Status: [Draft / Active]

Owner: [Owner Role]

Last Updated: YYYY-MM-DD

---

## 1. Identity（身份）

| 字段 | 值 |
|------|-----|
| Agent Name | [Agent Name] |
| Version | v1.0 |
| Status | [Draft / Active] |
| Owner | [Owner Role] |
| Belongs to | AI Company |
| Category | [Management / Design / Development / Quality / Domain] |

---

## 2. Mission（使命）

[Agent 为什么存在？最终目标是什么？一句话说明该 Agent 对 AI Gateway 项目的核心价值。]

---

## 3. Responsibilities（职责）

- [职责 1：具体描述该 Agent 必须负责的工作]
- [职责 2]
- [职责 3]

---

## 4. Authority（权限）

### ✔ 可以

- [权限 1：该 Agent 有权执行的操作]
- [权限 2]

### ✘ 不可以

- [禁止事项 1：该 Agent 无权执行的操作]
- [禁止事项 2]

---

## 5. Inputs（输入）

Agent 执行前必须读取以下内容：

| 输入 | 来源 | 说明 |
|------|------|------|
| [输入 1] | [来源] | [说明] |
| [输入 2] | [来源] | [说明] |

禁止自行猜测需求。

---

## 6. Outputs（输出）

| 输出 | 类型 | 接收方 | 模板 |
|------|------|--------|------|
| [输出 1] | [Document / Code / Config] | [接收 Agent] | [模板名称] |
| [输出 2] | [类型] | [接收 Agent] | [模板名称] |

所有输出必须采用 Markdown 格式。

---

## 7. Workflow（参与流程）

### 参与规模

| 规模 | 是否参与 | 说明 |
|------|:--------:|------|
| S0 | [是 / 否] | [说明] |
| S1 | [是 / 否] | [说明] |
| S2 | [是 / 否] | [说明] |
| S3 | [是 / 否] | [说明] |
| S4 | [是 / 否] | [说明] |

### 参与 Workflow 类型

- [Feature Workflow / Bug Workflow / Optimization Workflow / Research Workflow / Emergency Workflow]

---

## 8. Skills（能力）

| Skill ID | 类型 | 说明 |
|----------|------|------|
| [skill-name] | [Required / Optional] | [说明] |
| [skill-name] | [Required / Optional] | [说明] |

---

## 9. Knowledge（知识）

| 知识目录 | 加载策略 | 说明 |
|---------|---------|------|
| [知识路径] | [Must Load / On Demand] | [说明] |
| [知识路径] | [Must Load / On Demand] | [说明] |

---

## 10. Templates（模板）

| 模板名称 | 用途 | 文件路径 |
|---------|------|---------|
| [模板名称] | [用途] | `06-templates/[文件名]` |
| [模板名称] | [用途] | `06-templates/[文件名]` |

---

## 11. Checklist（检查清单）

### 启动前检查

□ 是否已读取 Project Standard？

□ 是否已读取 Agent Standard？

□ 是否已读取当前 Workflow？

□ Input 是否已准备完整？

### 执行中检查

□ 是否在职责范围内执行？

□ 是否有越权行为？

□ 是否需要升级无法决策的问题？

### 输出前检查

□ Output 是否完整？

□ 是否使用了正确的模板？

□ 是否符合相关 Standards？

□ 是否记录了必要信息？

---

## 12. KPIs（成功标准）

| KPI | 目标 | 衡量方式 |
|-----|------|---------|
| [KPI 1] | [目标值] | [衡量方式] |
| [KPI 2] | [目标值] | [衡量方式] |

---

## 13. Constraints（约束）

### 必须遵守

- [约束 1]
- [约束 2]

### 禁止行为

- [禁止事项 1]
- [禁止事项 2]

---

## 14. Deliverables（交付物）

| 交付物 | 类型 | 接收方 | 验收标准 |
|--------|------|--------|---------|
| [交付物名称] | [Document / Code / Config / Report] | [接收 Agent] | [标准] |
| [交付物名称] | [类型] | [接收 Agent] | [标准] |

---

## 15. Handoff（交接规则）

### Handoff 对象

| 上游 Agent | 接收内容 | 下游 Agent | 交付内容 |
|-----------|---------|-----------|---------|
| [上游 Agent] | [内容] | 本 Agent | [内容] |
| 本 Agent | [内容] | [下游 Agent] | [内容] |

### Handoff 规则

- 所有 Handoff 必须通过文档完成
- Handoff 文档必须包含：From、To、Timestamp、交付物清单
- 下游 Agent 拒绝接收时，必须返回原因

### Handoff 流程

```
上游 Agent 完成输出
    │
    ▼
生成 Handoff Record
    │
    ▼
通知 AI Project Manager
    │
    ▼
AI Project Manager 通知本 Agent
    │
    ▼
读取交付物 → 开始执行
```

---

## 16. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| YYYY-MM-DD | v1.0 | 初始版本 | [Owner] |

---

# End

本模板依据 AI Company Agent Standard 和 Document Standard 设计。

所有 Agent 必须基于此模板创建。
