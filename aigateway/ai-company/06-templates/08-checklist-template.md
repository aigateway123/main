# Checklist: [Checklist 名称]

Version: v1.0

Status: [Draft / Active / Completed]

Owner: [Agent Role]

Last Updated: YYYY-MM-DD

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| Checklist ID | CHK-[YYYYMMDD]-[序号] |
| Version | v1.0 |
| Status | [Draft / Active / Completed] |
| Owner | [Agent Role] |
| Checklist Type | [Development / Review / QA / Release / Architecture / Documentation / Workflow] |
| Related Workflow | [Workflow ID] |
| Related Task | [Task ID] |
| Created | YYYY-MM-DD |
| Completed | YYYY-MM-DD |

---

## 2. Checklist Name

[Checklist 名称：简洁描述该 Checklist 的用途]

---

## 3. Scope

[该 Checklist 的适用范围]

### 适用场景

- [场景 1]
- [场景 2]

### 不适用场景

- [场景 1]
- [场景 2]

---

## 4. Checklist Items

### Development Checklist

□ 代码是否正确实现需求？

□ 是否使用 context.Context？

□ 错误是否已处理，禁止忽略错误？

□ 是否有单元测试覆盖？

□ 是否遵循项目命名规范？

□ 是否存在重复代码？

□ 是否有硬编码的配置或密钥？

□ 日志是否记录关键路径？

### Review Checklist

□ 代码逻辑是否正确？

□ 是否有测试覆盖？

□ 是否有性能隐患？

□ 是否有安全漏洞？

□ 是否符合命名规范？

□ 是否有重复代码？

□ 是否有错误处理？

□ 文档是否已更新？

### QA Checklist

□ 功能是否符合 PRD？

□ 是否有回归测试？

□ 是否覆盖边界场景？

□ 性能指标是否达标？

□ 是否存在安全漏洞？

□ 是否存在 UI 显示问题？

### Release Checklist

□ 所有代码是否已合并到 main？

□ 所有 Review 是否已通过？

□ 所有 QA 测试是否已通过？

□ 数据库迁移是否已执行？

□ 配置是否已更新到生产环境？

□ Release Note 是否已准备？

□ 是否需要通知用户？

### Architecture Checklist

□ 架构是否符合整体设计？

□ 模块划分是否合理？

□ 是否满足性能目标（Gateway <10ms）？

□ 是否有 ADR？

□ 数据流是否清晰？

□ 是否考虑了扩展性？

□ 是否有安全架构设计？

### Documentation Checklist

□ 文档是否使用统一 Header 和 Footer？

□ Metadata 是否完整（Version / Status / Owner / Last Updated）？

□ Change Log 是否已记录？

□ 内容是否准确无歧义？

□ 是否包含所有必要章节？

□ 是否与相关文档一致？

### Workflow Checklist

□ Trigger 是否已满足？

□ Input 是否已准备完整？

□ Responsible Agent 是否已分配？

□ Workflow 类型是否匹配需求？

□ 需求规模（S0~S4）是否已确认？

□ 是否有阶段被跳过？

□ 各阶段输出是否已形成文档？

□ Handoff 是否已通过 AI Project Manager？

---

## 5. Status

| 项目 | 值 |
|------|-----|
| Current Status | [Draft / Active / Completed] |
| Total Items | [N] |
| Completed | [N] |
| Pending | [N] |
| Completion Rate | [N]% |

### 完成度

```
待处理  [■■■■□□□□] 40%
已完成  [■■■■■■■■] 80%
```

---

## 6. Owner

| 角色 | 负责人 | 职责 |
|------|--------|------|
| Checklist Owner | [Agent Name] | 维护 Checklist 内容 |
| Execution Owner | [Agent Name] | 负责执行检查项 |
| Verifier | [Agent Name] | 验证检查项是否完成 |

---

## 7. Completion

| # | 检查项 | 状态 | 完成日期 | 备注 |
|---|--------|:----:|---------|------|
| 1 | [检查项描述] | ✅ / ❌ / N/A | YYYY-MM-DD | [备注] |
| 2 | [检查项描述] | ✅ / ❌ / N/A | YYYY-MM-DD | [备注] |
| 3 | [检查项描述] | ✅ / ❌ / N/A | YYYY-MM-DD | [备注] |
| 4 | [检查项描述] | ✅ / ❌ / N/A | YYYY-MM-DD | [备注] |
| 5 | [检查项描述] | ✅ / ❌ / N/A | YYYY-MM-DD | [备注] |

### 状态说明

| 状态 | 说明 |
|:----:|------|
| ✅ | 已完成 |
| ❌ | 未完成 |
| N/A | 不适用 |

---

## 8. Risks

| # | 风险描述 | 关联检查项 | 等级 | 缓解方案 |
|---|---------|----------|------|---------|
| 1 | [风险描述] | [检查项 #] | [高 / 中 / 低] | [方案] |
| 2 | [风险描述] | [检查项 #] | [高 / 中 / 低] | [方案] |

---

## 9. Notes

[补充说明、决策记录、注意事项等]

---

## 10. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| YYYY-MM-DD | v1.0 | 初始版本 | [Owner] |
| YYYY-MM-DD | v1.1 | [修改内容] | [修改人] |

---

# End

本模板依据 AI Company Document Standard 设计。

所有 Checklist 必须基于此模板创建。

支持的 Checklist 类型：Development / Review / QA / Release / Architecture / Documentation / Workflow
