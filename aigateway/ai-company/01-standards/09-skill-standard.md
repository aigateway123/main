# AI Company Skill Standard

Version: v1.0

Status: Draft

Owner: Architect

Last Updated: 2026-07-12

---

## 1. Skill Principles

### Principle 1 — Single Capability

每个 Skill 只负责一种能力。

禁止在单个 Skill 中混合多个不相关的能力。

---

### Principle 2 — Reusable

Skill 必须可被多个 Agent 复用。

禁止 Skill 与特定 Agent 绑定。

---

### Principle 3 — Self-Contained

Skill 必须包含完整的定义、输入、输出和约束。

禁止 Skill 依赖外部未定义的上下文。

---

### Principle 4 — Composable

多个 Skill 可以组合使用。

Skill 之间必须保持松耦合。

---

### Principle 5 — Versioned

每个 Skill 必须有独立的版本管理。

禁止无版本的 Skill。

---

### Principle 6 — Testable

每个 Skill 必须可独立验证。

禁止无法验证的 Skill 定义。

---

## 2. Skill Structure

### 存储位置

所有 Skill 定义文件存储于：

```
ai-company/04-skills/
```

### 文件结构

每个 Skill 包含一个独立的 Markdown 文件：

```
ai-company/04-skills/
├── prd-skill.md
├── architecture-skill.md
├── provider-skill.md
├── router-skill.md
├── database-skill.md
├── adr-skill.md
├── user-story-skill.md
├── product-design-skill.md
├── acceptance-criteria-skill.md
├── project-management-skill.md
├── workflow-skill.md
├── agent-dispatch-skill.md
└── billing-skill.md
```

---

## 3. Skill Metadata

### 统一 Metadata

每个 Skill 文件必须以以下 Metadata 开头：

```markdown
# [Skill Name]

Skill ID: [skill-name]

Version: v1.0

Status: [Draft / Active / Deprecated]

Owner: [Agent Role]

Category: [Development / Design / Management / Domain / Quality]

Last Updated: YYYY-MM-DD
```

### Metadata 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| Skill ID | 唯一标识，用于 Agent 引用 | `provider-skill` |
| Version | 语义化版本 | `v1.0` |
| Status | Draft / Active / Deprecated | `Active` |
| Owner | 负责维护的角色 | `Architect` |
| Category | 所属分类 | `Development` |
| Last Updated | 最后更新日期 | `2026-07-12` |

### Skill 分类

| 类别 | 说明 | 示例 |
|------|------|------|
| Development | 开发相关 | provider-skill, database-skill |
| Design | 设计相关 | architecture-skill, product-design-skill |
| Management | 管理相关 | project-management-skill, workflow-skill |
| Domain | 领域相关 | router-skill, billing-skill |
| Quality | 质量相关 | review-skill |

---

## 4. Skill Input

### Input 定义规则

每个 Skill 必须定义其所需的输入。

输入必须包含以下要素：

| 要素 | 说明 | 必填 |
|------|------|:----:|
| 名称 | 输入参数的名称 | ✅ |
| 类型 | 输入数据的类型 | ✅ |
| 来源 | 输入数据的来源（Agent / Document / Knowledge） | ✅ |
| 说明 | 输入参数的用途说明 | ✅ |

### Input 格式示例

```markdown
## Input

| 名称 | 类型 | 来源 | 说明 |
|------|------|------|------|
| PRD Document | Document | Product Manager | 产品需求文档 |
| Project Standard | Document | Standards | 项目规范 |
| Provider List | Knowledge | Knowledge Base | 已配置的 Provider 列表 |
| Task Definition | Task | AI Project Manager | 当前任务定义 |
```

### 输入规则

- 无输入时需明确标注 `None`
- 输入必须来自已定义的来源（Agent / Document / Knowledge）
- 禁止输入依赖未定义的外部资源

---

## 5. Skill Output

### Output 定义规则

每个 Skill 必须定义其产生的输出。

输出必须包含以下要素：

| 要素 | 说明 | 必填 |
|------|------|:----:|
| 名称 | 输出内容的名称 | ✅ |
| 类型 | 输出数据的类型 | ✅ |
| 接收方 | 输出的下游使用者 | ✅ |
| 说明 | 输出内容的用途说明 | ✅ |

### Output 格式示例

```markdown
## Output

| 名称 | 类型 | 接收方 | 说明 |
|------|------|--------|------|
| Architecture Design | Document | Full Stack Engineer | 架构设计文档 |
| ADR | Document | Architect | 架构决策记录 |
| Provider Config | Config | System | Provider 配置信息 |
```

### 输出规则

- 无输出时需明确标注 `None`
- 输出必须传递给已定义的接收方
- 所有输出必须遵循 04-document-standard 的格式规范

---

## 6. Skill Constraints

### 约束定义

每个 Skill 必须定义其执行时的约束条件。

```markdown
## Constraints

### 必须遵守

- [约束 1]
- [约束 2]

### 禁止行为

- [禁止事项 1]
- [禁止事项 2]

### 前置条件

- [条件 1]
- [条件 2]
```

### 约束类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 必须遵守 | Skill 执行时必须满足的条件 | 必须读取 Project Standard |
| 禁止行为 | Skill 执行时禁止的操作 | 禁止修改 PRD 内容 |
| 前置条件 | Skill 启动前必须满足的条件 | 需要 PRD 已完成 |

### 约束规则

- 约束必须清晰可验证
- 禁止含糊的约束描述
- 约束不得与 Standards 冲突

---

## 7. Skill Dependencies

### 依赖定义

每个 Skill 必须定义其依赖的其他 Skill。

```markdown
## Dependencies

| Skill ID | 依赖类型 | 说明 |
|----------|---------|------|
| prd-skill | Required | 架构设计需要 PRD 作为输入 |
| database-skill | Optional | 如需数据库设计 |
```

### 依赖类型

| 类型 | 说明 |
|------|------|
| Required | 必须依赖，不可跳过 |
| Optional | 可选依赖，按需加载 |

### 依赖规则

- Required 依赖必须在当前 Skill 之前加载
- 禁止循环依赖
- 依赖链深度不得超过 3 层

---

## 8. Skill Version

### 版本格式

```
v[主版本].[次版本]
```

| 版本位 | 升级条件 |
|--------|---------|
| 主版本 | 输入/输出变更、约束变更、不兼容修改 |
| 次版本 | 优化、Bug 修复、文档完善 |

### 版本记录

每个 Skill 文件必须在 Footer 前包含版本信息：

```markdown
## Version

Current: v1.0

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | Architect |
```

### 版本兼容性

| 版本变化 | 兼容性 | 说明 |
|---------|--------|------|
| 主版本升级 | 不兼容 | 使用者需适配 |
| 次版本升级 | 兼容 | 使用者无需修改 |

---

## 9. Skill Testing

### 测试要求

每个 Skill 在发布前必须经过验证。

```markdown
## Testing

### 验证方式

- [验证方式 1]
- [验证方式 2]

### 成功标准

- [标准 1]
- [标准 2]

### 测试用例

| # | 场景 | 输入 | 预期输出 | 状态 |
|---|------|------|---------|------|
| 1 | ... | ... | ... | Pass |
```

### 验证方式

| 方式 | 说明 | 适用场景 |
|------|------|---------|
| 文档评审 | 由 Owner 评审 Skill 定义 | 所有 Skill |
| 模拟执行 | 模拟 Skill 执行验证输出 | 复杂 Skill |
| 实际使用 | 在实际 Workflow 中验证 | Active Skill |

---

## 10. Skill Review

### Review 流程

```
Skill 创建/更新完成
    │
    ▼
提交 Review
    │
    ▼
Owner 评审
    │
    ├── Pass → 进入下一阶段
    │
    └── Need Fix → 返回修改
    │
    ▼
发布
```

### Review 重点

□ Skill 是否遵循单一职责原则？

□ Input 定义是否完整？

□ Output 定义是否完整？

□ 约束是否清晰可验证？

□ 依赖是否正确？

□ 是否与已有 Standards 冲突？

□ 命名是否符合规范？

### Review 参与者

| Skill 类型 | Reviewer |
|-----------|---------|
| Development Skill | Architect |
| Design Skill | Architect |
| Management Skill | AI Project Manager |
| Domain Skill | PM / Architect |
| Quality Skill | Architect |

---

## 11. Skill Publishing

### 发布流程

```
Skill 通过 Review
    │
    ▼
更新版本号
    │
    ▼
更新 Change Log
    │
    ▼
标记为 Active
    │
    ▼
通知相关 Agent
    │
    ▼
Agent 可加载使用
```

### 发布条件

- Skill 已通过 Review
- 所有 Test Case 已通过
- 依赖的 Skill 已发布
- 不与已有 Standards 冲突

### 废弃流程

```
Skill 不再使用
    │
    ▼
标记为 Deprecated
    │
    ▼
通知相关 Agent
    │
    ▼
等待迁出期（30 天）
    │
    ▼
归档
```

---

## 12. Skill 与 Agent 映射

### 加载规则

每个 Agent 按 08-knowledge-standard.md §11 的规则加载其所需的 Skill。

以下是各 Agent 建议加载的 Skill：

| Agent | Required Skills | Optional Skills |
|-------|---------------|----------------|
| AI Project Manager | project-management-skill, workflow-skill, agent-dispatch-skill | — |
| Requirement Analyzer | workflow-skill | — |
| Product Manager | prd-skill, user-story-skill, product-design-skill, acceptance-criteria-skill | — |
| Architect | architecture-skill, database-skill, adr-skill | provider-skill, router-skill |
| Full Stack Engineer | provider-skill, database-skill | router-skill, billing-skill |
| Reviewer | — | architecture-skill, provider-skill |
| QA | — | billing-skill, router-skill |

### Skill 与 Agent 关系说明

- 一个 Skill 可被多个 Agent 加载
- 一个 Agent 可加载多个 Skill
- Agent 在加载时按 "Required" 优先、"Optional" 按需的原则加载

---

## 13. Skill Checklist

### 创建检查

□ Skill 是否遵循单一职责原则？

□ Metadata 是否完整？

□ Input 是否已定义？

□ Output 是否已定义？

□ Constraints 是否清晰？

□ Dependencies 是否正确？

---

### 测试检查

□ 验证方式是否已定义？

□ 成功标准是否已定义？

□ 是否已通过测试？

---

### 发布检查

□ 是否已通过 Review？

□ 版本号是否正确？

□ Change Log 是否已记录？

□ 相关 Agent 是否已通知？

---

### 废弃检查

□ 是否已通知所有使用者？

□ 是否有替代 Skill？

□ 迁出期是否已过？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | Architect |

---

# End

本规范是 AI Company 所有 Skill 的统一标准。

所有 Skill 定义必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。

如与 Knowledge Standard 冲突：Knowledge Standard 优先。
