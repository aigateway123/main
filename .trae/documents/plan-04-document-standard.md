# Plan: 设计 04-document-standard.md

## 一致性检查

### 与 AI Gateway 项目规划文档
- 项目规划文档**未定义任何文档规范相关内容**，无冲突
- 项目规划中的架构图（系统架构图、部署架构图等）可作为 Mermaid Rule 的参考案例

### 与已有 Standards 的一致性检查

| # | 现有约束 | 新标准需遵守 |
|---|---------|-------------|
| 1 | **Project Standard §5**: 文档要求（Markdown、版本号、更新时间、Owner） | 必须继承并细化 |
| 2 | **Project Standard §5**: 目录分类（docs/、ai-company/、ADR/） | 必须兼容 |
| 3 | **Project Standard §5**: "重要修改必须记录 Change Log" | Change Log Rule 必须实现 |
| 4 | **Agent Standard §3.10**: 模板列表（PRD/ADR/API/Task/Review Template） | 各规则中需引用对应模板 |
| 5 | **Agent Standard §2 Principle 4**: "Documentation First" | 必须在 Document Principles 中体现 |
| 6 | **Agent Standard §6**: Context Loading Order 中 docs/ 为第 2 优先级 | 文档结构需明确 |
| 7 | **03-workflow-standard**: Handoff 基于文档 | 文档规范必须支持 Handoff 场景 |
| 8 | **已有文档 Header 格式**: `Title / Version / Status / Owner / Last Updated` | 统一 Header 必须兼容 |

## 设计方案

### 文件信息
- **文件名**: `ai-company/01-standards/04-document-standard.md`
- **版本**: v1.0
- **状态**: Draft
- **Owner**: AI Project Manager

### Header 模板（统一所有文档）
```markdown
# [Document Title]

Version: v1.0

Status: [Draft / Active / Deprecated]

Owner: [Role Name]

Last Updated: YYYY-MM-DD
```

### Footer 模板（统一所有文档）
```markdown
---
# End

[文档用途说明]

如与 Project Standard 冲突：Project Standard 优先。
如与 Agent Standard 冲突：Agent Standard 优先。
```

### 目录结构（18 章节）

| # | 章节 | 核心内容 |
|---|------|---------|
| 1 | Document Principles | Documentation First、Single Source of Truth、Timely、Traceable、Readable |
| 2 | Folder Structure | 文档目录树（docs/、ai-company/、ADR/、各子目录说明） |
| 3 | Naming Convention | 文件命名、目录命名、标题命名规则 |
| 4 | Version Rule | 语义化版本（v1.0、v1.1、v2.0）、何时升级 |
| 5 | Status Rule | Draft → Active → Deprecated 生命周期 |
| 6 | Owner Rule | 每个文档必须有 Owner，Owner 负责维护 |
| 7 | Last Updated Rule | 每次修改必须更新日期 |
| 8 | Change Log Rule | 格式模板、必须记录的内容 |
| 9 | Markdown Rule | 标题层级、列表、表格、代码块规范 |
| 10 | Mermaid Rule | 流程图、时序图、类图、状态图规范 |
| 11 | ADR Rule | ADR 文档结构、ADR 编号规则、ADR 生命周期 |
| 12 | PRD Rule | PRD 文档结构、PRD 必须包含的章节 |
| 13 | API Rule | API 文档结构（基于 OpenAI API 兼容格式） |
| 14 | Architecture Rule | Architecture 文档结构 |
| 15 | Review Rule | Review Report 结构 |
| 16 | Checklist Rule | 自检清单格式规范 |
| 17 | Cross Reference Rule | 文档间引用方式 |
| 18 | Documentation Lifecycle | 创建 → 评审 → 发布 → 维护 → 废弃 |

## Verification

1. 统一 Header 和 Footer 与已有 3 个标准文档的格式兼容
2. 18 个章节覆盖用户要求的所有条目
3. 与 Project Standard §5 无冲突
4. 与 Agent Standard §3.10 模板列表兼容
5. 与 03-workflow-standard 的 Handoff 规则兼容
6. ADR/PRD/API/Architecture/Review 各文档规则与 Agent Standard 的角色职责一致
