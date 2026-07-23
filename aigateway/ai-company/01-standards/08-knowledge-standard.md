# AI Company Knowledge Standard

Version: v1.0

Status: Draft

Owner: Architect

Last Updated: 2026-07-12

---

## 1. Knowledge Principles

### Principle 1 — Structured

知识必须按分类目录组织。

禁止零散文件散落在根目录。

---

### Principle 2 — Reusable

知识必须可被多个 Agent 复用。

禁止知识私有化。

---

### Principle 3 — Current

知识必须保持最新。

过期知识必须及时更新或废弃。

---

### Principle 4 — Referenced

所有知识必须可通过路径引用。

禁止无路径的知识引用。

---

### Principle 5 — Loaded by Need

Agent 只加载与当前任务相关的知识。

禁止加载无关知识浪费上下文。

---

### Principle 6 — Traceable

知识必须有版本、Owner、更新时间。

禁止无来源的知识。

---

## 2. Folder Structure

### 知识库顶层目录

```
ai-company/06-knowledge/
│
├── 01-project/              # 项目级知识
│   ├── overview.md          # 项目概览
│   ├── roadmap.md           # Roadmap 快照
│   └── glossary.md          # 术语表
│
├── 02-architecture/         # 架构知识
│   ├── system-architecture.md
│   ├── deployment.md
│   └── tech-stack.md
│
├── 03-domain/               # 领域知识
│   ├── ai-models.md         # AI 模型知识
│   ├── providers.md         # Provider 知识
│   └── pricing.md           # 定价知识
│
├── 04-standards-ref/        # Standards 引用快照
│   ├── project-standard-summary.md
│   ├── agent-standard-summary.md
│   └── workflow-standard-summary.md
│
├── 05-external/             # 外部知识
│   ├── openai-api.md
│   ├── claude-api.md
│   ├── deepseek-api.md
│   ├── gemini-api.md
│   └── postgresql.md
│
├── 06-operations/           # 运维知识
│   ├── docker-setup.md
│   ├── cloudflare-config.md
│   └── monitoring.md
│
└── 07-glossary/             # 术语表
    └── glossary-index.md
```

### 目录与 Agent 映射

| 知识目录 | 主要使用者 | 次要使用者 |
|---------|-----------|-----------|
| 01-project/ | AI Project Manager | PM, Architect |
| 02-architecture/ | Architect | Engineer |
| 03-domain/ | All Agents | — |
| 04-standards-ref/ | All Agents | — |
| 05-external/ | Engineer, Architect | — |
| 06-operations/ | Engineer | Architect |
| 07-glossary/ | All Agents | — |

---

## 3. Knowledge Categories

### 按用途分类

| 类别 | 说明 | 示例 |
|------|------|------|
| Project | 项目基本信息 | 项目概览、Roadmap、术语表 |
| Architecture | 架构设计知识 | 系统架构、部署方案、技术栈 |
| Domain | 业务领域知识 | AI 模型、Provider、定价 |
| Standards Ref | Standards 引用 | 各 Standard 摘要 |
| External | 外部技术知识 | OpenAI API、PostgreSQL |
| Operations | 运维知识 | Docker、监控 |
| Glossary | 术语表 | 项目专用术语 |

### 按访问频率分类

| 类型 | 访问频率 | 存储位置 |
|------|---------|---------|
| 高频 | 每次对话 | Standards, Context Loading Order |
| 中频 | 每 Sprint | 架构知识、领域知识 |
| 低频 | 按需 | 外部 API 文档、运维知识 |

### 按稳定性分类

| 类型 | 变更频率 | 示例 |
|------|---------|------|
| 稳定 | 极少变更 | Standards、架构设计 |
| 动态 | 持续变更 | Roadmap、定价信息 |
| 外部 | 第三方控制 | 外部 API 文档 |

---

## 4. Naming Rules

### 目录命名

格式：

```
[两位数字]-[英文名称]/
```

示例：

```
01-project/
02-architecture/
```

### 文件命名

格式：

```
[英文名称].md
```

示例：

```
system-architecture.md
openai-api.md
glossary-index.md
```

### 知识条目命名

- 使用英文小写
- 多个单词使用连字符 `-` 连接
- 名称必须反映内容
- 禁止使用含糊名称（如 `note.md`、`temp.md`）

---

## 5. Version Rules

### 知识版本格式

```
v[主版本].[次版本]
```

| 版本位 | 升级条件 |
|--------|---------|
| 主版本 | 知识内容重构、分类变更 |
| 次版本 | 内容增补、修正 |

### 版本记录方式

每个知识文件必须在其 Footer 前包含版本信息：

```markdown
## Version

Current: v1.0

Last Updated: YYYY-MM-DD

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
```

---

## 6. Knowledge Lifecycle

### 完整生命周期

```
识别知识需求
    │
    ▼
创建（Draft）
    │
    ▼
评审
    │
    ├── 通过 → Active
    │
    └── 不通过 → 返回修改
    │
    ▼
使用（Active）
    │
    ├── Agent 加载
    │
    └── 持续更新
    │
    ▼
废弃（Deprecated）
    │
    ▼
归档
```

### 各阶段说明

| 阶段 | 说明 | Owner |
|------|------|--------|
| 识别 | 发现需要记录的知识 | 发现者 |
| 创建 | 编写知识文档 | 创建者 |
| 评审 | 验证知识准确性 | Architect |
| Active | 可被 Agent 加载 | 指定 Owner |
| Deprecated | 不再推荐使用 | Architect |
| 归档 | 移至归档目录，不再加载 | Architect |

---

## 7. Knowledge Reference Rules

### 知识引用格式

Agent 在文档中引用知识时，必须使用以下格式：

```markdown
[知识名称](相对路径)

# 示例
[AI Gateway 项目概览](../06-knowledge/01-project/overview.md)
[OpenAI API 参考](../06-knowledge/05-external/openai-api.md)
```

### 知识引用类型

| 引用类型 | 格式 | 示例 |
|---------|------|------|
| 标准引用 | `[名称](路径)` | `[项目概览](../06-knowledge/01-project/overview.md)` |
| 交叉引用 | `@Knowledge:路径` | `@Knowledge:02-architecture/system-architecture.md` |
| 版本引用 | `[名称](路径#版本)` | `[项目概览](../06-knowledge/01-project/overview.md#v1.0)` |

### 引用规则

- 所有知识引用必须使用相对路径
- 禁止引用已废弃的知识
- 引用外部知识必须注明来源

---

## 8. Knowledge Update Rules

### 更新触发条件

| 场景 | 必须更新 | 负责人 |
|------|---------|--------|
| 架构变更 | ✅ | Architect |
| 新增 Provider | ✅ | Engineer |
| API 版本升级 | ✅ | Engineer |
| Roadmap 更新 | ✅ | AI Project Manager |
| Standards 更新 | ✅ | 相关 Owner |
| 外部服务变更 | ✅ | Engineer |
| 发现知识错误 | ✅ | 发现者 |

### 更新流程

```
知识变更需求
    │
    ▼
通知 Owner
    │
    ▼
Owner 更新知识
    │
    ▼
更新版本号
    │
    ▼
更新 Change Log
    │
    ▼
通知相关 Agent
```

### 更新时效要求

| 知识类型 | 最长延迟 | 说明 |
|---------|---------|------|
| Standards 变更 | 即时 | 变更后立即更新 |
| 架构变更 | 1 小时 | 决策后立即更新 |
| Provider 变更 | 4 小时 | 接入后更新 |
| API 变更 | 4 小时 | 变更后更新 |
| 常规更新 | 24 小时 | 发现后更新 |

---

## 9. Knowledge Validation

### 验证周期

| 知识类型 | 验证周期 | 验证人 |
|---------|---------|--------|
| Standards | 每 Phase | CEO |
| 架构知识 | 每月 | Architect |
| 外部 API 文档 | 每 Sprint | Engineer |
| 领域知识 | 每月 | PM |
| 运维知识 | 每 Phase | Engineer |

### 验证内容

□ 知识是否仍准确？

□ 是否有新的信息需要补充？

□ 是否有信息已经过时？

□ 引用是否仍有效？

□ 是否有其他 Agent 反馈的问题？

### 验证记录

每次验证必须记录以下信息：

```markdown
## Validation Record

- Date: YYYY-MM-DD
- Validator: [角色名]
- Result: [Pass / Need Update / Deprecated]
- Actions: [需要采取的行动]
```

---

## 10. Knowledge Ownership

### Owner 分配

| 知识目录 | Owner | 备选 Owner |
|---------|-------|-----------|
| 01-project/ | AI Project Manager | PM |
| 02-architecture/ | Architect | Engineer |
| 03-domain/ | PM | Architect |
| 04-standards-ref/ | AI Project Manager | — |
| 05-external/ | Engineer | Architect |
| 06-operations/ | Engineer | Architect |
| 07-glossary/ | AI Project Manager | — |

### Owner 职责

- 保证知识的准确性和时效性
- 处理知识的更新请求
- 定期验证知识有效性
- 废弃不再适用的知识
- 响应其他 Agent 的知识相关问题

---

## 11. Knowledge Loading Rules

### Agent 知识加载规则

每个 Agent 在启动任务时，按以下规则加载知识：

| Agent | 必须加载 | 按需加载 |
|-------|---------|---------|
| AI Project Manager | 01-project/, 04-standards-ref/ | 03-domain/ |
| Requirement Analyzer | 04-standards-ref/ | 03-domain/ |
| Product Manager | 01-project/, 03-domain/ | 02-architecture/ |
| Architect | 02-architecture/, 04-standards-ref/ | 03-domain/, 05-external/ |
| Full Stack Engineer | 03-domain/, 05-external/ | 02-architecture/, 06-operations/ |
| Reviewer | 04-standards-ref/ | 02-architecture/, 03-domain/ |
| QA | 03-domain/ | 01-project/ |

### 加载顺序

Agent 在加载知识时，必须遵循以下顺序：

```
① Project Standard（最高规范）
② docs/（项目规划文档）
③ Agent Standard
④ 当前 Workflow
⑤ 当前任务定义
⑥ 必需知识（Must Load）
⑦ 按需知识（On Demand）
     │
     ▼
Agent 开始执行
```

### 加载规则

- Agent 启动时必须加载"Must Load"知识
- "On Demand"知识在任务需要时按引用加载
- Agent 不得加载与当前任务无关的知识
- 同一知识在一次对话中只加载一次

---

## 12. Knowledge Checklist

### 创建检查

□ 知识是否属于正确的分类目录？

□ 命名是否符合规范？

□ 是否包含版本号和更新时间？

□ 是否包含 Owner 信息？

□ 是否经过评审？

---

### 更新检查

□ 知识内容是否已更新？

□ 版本号是否已升级？

□ Change Log 是否已记录？

□ 相关 Agent 是否已通知？

---

### 加载检查

□ 是否已加载 Project Standard？

□ 是否已加载必需知识？

□ 是否已避免加载无关知识？

□ 知识引用路径是否正确？

---

### 验证检查

□ 知识是否在验证周期内？

□ 知识是否仍准确有效？

□ 是否有知识需要废弃？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | Architect |

---

# End

本规范是 AI Company 所有知识库的统一标准。

所有知识管理和加载活动必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。

如与 Document Standard 冲突：Document Standard 优先。
