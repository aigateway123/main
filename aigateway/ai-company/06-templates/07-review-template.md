# Review Report: [Review ID]

Version: v1.0

Status: [In Progress / PASS / FIX REQUIRED / REJECT / Closed]

Owner: Reviewer

Last Updated: YYYY-MM-DD

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| Review ID | REV-[YYYYMMDD]-[序号] |
| Version | v1.0 |
| Status | [In Progress / PASS / FIX REQUIRED / REJECT / Closed] |
| Reviewer | [Reviewer Name] |
| Review Type | [Code / Architecture / PRD / Document / Security / Performance / Business] |
| Related Workflow | [Workflow ID] |
| Related Task | [Task ID] |
| Created | YYYY-MM-DD HH:mm |
| Completed | YYYY-MM-DD HH:mm |

---

## 2. Review Target

| 字段 | 值 |
|------|-----|
| Target Type | [Code / Document / Architecture / PRD / API] |
| Target Name | [目标名称] |
| Target Version | [版本号] |
| Target Author | [作者] |
| Target URL | [文件路径或链接] |

---

## 3. Scope

[本次 Review 的范围描述]

### 包含内容

- [内容 1]
- [内容 2]

### 不包含内容

- [内容 1]
- [内容 2]

---

## 4. Reviewer

| 角色 | Reviewer | 评审日期 |
|------|----------|---------|
| Primary Reviewer | [Reviewer Name] | YYYY-MM-DD |
| Secondary Reviewer | [Reviewer Name] | YYYY-MM-DD |
| Reviewed By (Author) | [Author Name] | YYYY-MM-DD |

---

## 5. Review Time

| 阶段 | 日期 | 耗时 |
|------|------|:----:|
| 开始时间 | YYYY-MM-DD HH:mm | — |
| 完成时间 | YYYY-MM-DD HH:mm | — |
| 总耗时 | — | [N] 小时 [N] 分钟 |

---

## 6. Findings

| # | 类别 | 描述 | 文件 / 位置 |
|---|------|------|-------------|
| 1 | [Bug / Improvement / Question] | [问题描述] | [文件:行号] |
| 2 | [Bug / Improvement / Question] | [问题描述] | [文件:行号] |
| 3 | [Bug / Improvement / Question] | [问题描述] | [文件:行号] |

---

## 7. Severity

| 级别 | 说明 | 处理要求 | 数量 |
|------|------|---------|:----:|
| 🔴 Critical | 阻断性缺陷，影响核心功能 | 必须修复 | [N] |
| 🟡 Major | 功能性缺陷，影响用户体验 | 必须修复 | [N] |
| 🟢 Minor | 非功能性缺陷，建议优化 | 建议修复 | [N] |
| ⚪ Suggestion | 改进建议 | 可选 | [N] |

### 严重级别分布

```
🔴 Critical:   [■■■■] N
🟡 Major:      [■■■■] N
🟢 Minor:      [■■■■] N
⚪ Suggestion: [■■■■] N
```

---

## 8. Suggestions

| # | 建议 | 优先级 | 预期效果 |
|---|------|--------|---------|
| 1 | [改进建议] | [高 / 中 / 低] | [预期效果] |
| 2 | [改进建议] | [高 / 中 / 低] | [预期效果] |
| 3 | [改进建议] | [高 / 中 / 低] | [预期效果] |

---

## 9. Result

### Review Result

| 结果 | 含义 | 后续动作 |
|:----:|------|---------|
| **PASS** | Review 通过，无重大问题 | 进入下一阶段 |
| **FIX REQUIRED** | 存在需修复的问题，修复后需 Re-Review | 提交者修复 → Re-Review |
| **REJECT** | 存在方向性或架构级问题，不通过 | 返回上一 Workflow 阶段重新执行 |

### PASS 条件

- 所有 Critical 和 Major 问题已修复
- 剩余 Minor 问题不影响功能正确性
- 代码 / 文档符合质量标准

### FIX REQUIRED 条件

- 存在 Critical 或 Major 问题
- 问题可在合理时间内修复
- 修复后无需全面重新 Review

### REJECT 条件

- 存在架构级问题
- 存在方向性错误
- 存在大量质量问题
- 与 PRD 或需求严重不符

---

## 10. Checklist

### 覆盖率检查

□ 是否覆盖所有变更内容？

□ 是否覆盖所有边界场景？

□ 是否检查了异常路径？

### 质量检查

□ 代码 / 文档是否正确？

□ 是否有测试覆盖？

□ 是否有性能隐患？

□ 是否有安全漏洞？

### 标准检查

□ 是否符合命名规范？

□ 是否符合项目目录结构？

□ 是否符合相关 Standards？

□ 文档是否已更新？

---

## 11. Next Actions

| # | 行动项 | 负责人 | 截止日期 | 状态 |
|---|--------|--------|---------|------|
| 1 | [行动描述] | [负责人] | YYYY-MM-DD | [待处理 / 处理中 / 已完成] |
| 2 | [行动描述] | [负责人] | YYYY-MM-DD | [待处理 / 处理中 / 已完成] |
| 3 | [行动描述] | [负责人] | YYYY-MM-DD | [待处理 / 处理中 / 已完成] |

---

## 12. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| YYYY-MM-DD | v1.0 | 初始版本 | Reviewer |
| YYYY-MM-DD | v1.1 | [修改内容] | [修改人] |

---

# End

本模板依据 AI Company Review Standard 和 Document Standard 设计。

所有 Review 报告必须基于此模板创建。
