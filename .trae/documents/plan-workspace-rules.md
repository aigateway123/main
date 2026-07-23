# Plan: 添加 Workspace Rules

## Summary
基于 Trae IDE 原生规则机制（`.trae/rules/*.md`），为项目创建一到多条项目规则，涵盖 AI 行为约束和团队开发规范，并与现有的 `ai-company/01-standards/` 规范体系联动。

## Current State
- 项目已有 `ai-company/01-standards/` 规范体系（Project Standard + Agent Standard）
- 项目无任何 `.trae/rules/` 规则文件
- 项目无 `.cursorrules`、`.clinerules` 等文件
- `.trae/documents/` 下仅有评审和计划文档

## Proposed Changes

### 1. 创建 `.trae/rules/` 目录

按照 Trae IDE 规则规范，项目规则文件存放于 `.trae/rules/*.md`，支持 frontmatter 配置生效方式。

### 2. 创建规则文件（建议拆分）

建议创建 **2 条规则**，按关注点分离：

#### 规则 A：项目根规则（始终生效）
- **文件名**: `.trae/rules/project-root.md`
- **生效方式**: Always Apply（始终生效）
- **内容**: 项目基本信息、核心原则、架构约束
  - 项目名称与定位（AI Gateway）
  - 当前开发阶段（Phase P0~P2）
  - 项目技术栈概要
  - 开发原则（MVP First, Documentation First, Design Before Coding 等）
  - 架构约束（Docker Compose, 5 独立服务, 异步化等）
  - 链接引用 `ai-company/01-standards/` 完整规范

#### 规则 B：AI Company 规范规则（始终生效）
- **文件名**: `.trae/rules/ai-company.md`
- **生效方式**: Always Apply（始终生效）
- **内容**: AI Company 工作方式和 Agent 协作规范
  - AI Company 标准化流程
  - 角色职责边界（不越权）
  - Decision Rules（冲突升级机制）
  - Context Loading Order 优先级
  - Agent Standard 核心约束
  - 文档规范要求

### 3. 规则文件格式规范

每个规则文件需包含 frontmatter：

```markdown
---
alwaysApply: true
description: "规则描述"
---

# 规则标题

规则内容...
```

## Files to Create

| # | 文件 | 内容 | 生效方式 |
|---|------|------|----------|
| 1 | `.trae/rules/project-root.md` | 项目基础信息、架构约束、开发原则 | Always Apply |
| 2 | `.trae/rules/ai-company.md` | AI Company 流程、角色、决策规则 | Always Apply |

## Assumptions & Decisions

- **使用 Trae 原生 `.trae/rules/` 机制**：基于用户选择的"Trae 原生规则"方式
- **拆分为多条规则而非单一大文件**：遵循 Trae 官方建议的模块化规则管理方式，降低每次注入的 token 消耗
- **始终生效模式**：项目和 AI Company 规范对所有对话都相关，适合 Always Apply
- **后续可扩展**：未来可为特定模块（如 Gateway、Policy Engine）创建指定文件生效的规则

## Verification

1. 确认 `.trae/rules/` 目录已创建
2. 确认规则文件包含正确 frontmatter（`alwaysApply: true`）
3. 确认规则内容与 `ai-company/01-standards/` 规范一致，无矛盾
4. 可在 Trae IDE 设置 → 规则面板中看到新建的规则
