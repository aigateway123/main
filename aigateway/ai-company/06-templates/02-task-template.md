# Task: [Task 标题]

Version: v1.0

Status: [Created / Ready / In Progress / Review / Acceptance / Done / Blocked / Cancelled]

Owner: [Agent Name]

Task ID: [Workflow ID]-[三位序号]

Workflow ID: [关联 Workflow 实例 ID]

Created: YYYY-MM-DD

Deadline: YYYY-MM-DD

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| Task ID | [Workflow ID]-[序号] |
| Workflow ID | [关联 Workflow 实例 ID] |
| Created | YYYY-MM-DD |
| Deadline | YYYY-MM-DD |
| Version | v1.0 |
| Status | [Created / Ready / In Progress / Review / Acceptance / Done / Blocked / Cancelled] |

---

## 2. Task ID

```
[Workflow ID]-[三位序号]
```

示例：

```
feature-s2-add-pricing-001
bug-s0-fix-login-typo-001
optimization-s1-router-latency-001
research-s2-db-sharding-001
refactor-s1-provider-adapter-001
```

---

## 3. Title

[Task 标题：简洁明了地描述 Task 内容]

---

## 4. Background

[为什么要做这个 Task？当前面临什么问题？]

---

## 5. Requirement

[详细的需求描述。包含功能需求和非功能需求。]

### 功能需求

- [需求描述 1]
- [需求描述 2]

### 非功能需求

- 性能：[目标响应时间]
- 安全：[安全要求]
- 可用性：[可用性要求]

---

## 6. Priority

| 优先级 | 标签 | 说明 |
|--------|------|------|
| [P0 / P1 / P2 / P3] | [Critical / High / Medium / Low] | [说明] |

---

## 7. Scale

| 规模 | 说明 | 预计工期 |
|------|------|---------|
| [S0 / S1 / S2 / S3 / S4] | [说明] | [工期] |

---

## 8. Workflow

| 字段 | 值 |
|------|-----|
| Workflow Type | [Feature / Bug / Optimization / Research / Refactor] |
| Workflow ID | [关联 Workflow 实例 ID] |
| Workflow Status | [Active / Completed] |

---

## 9. Owner

| 角色 | Agent |
|------|-------|
| Owner | [Agent Name] |
| Reviewer | [Agent Name] |
| QA | [Agent Name] |

---

## 10. Participants

| 角色 | Agent | 职责 |
|------|-------|------|
| [Product Manager] | [Agent Name] | [职责描述] |
| [Architect] | [Agent Name] | [职责描述] |
| [Engineer] | [Agent Name] | [职责描述] |
| [Reviewer] | [Agent Name] | [职责描述] |
| [QA] | [Agent Name] | [职责描述] |

---

## 11. Input

| 输入 | 来源 | 说明 | 就绪状态 |
|------|------|------|:--------:|
| 需求说明 | [来源] | [说明] | ✅ / ❌ |
| PRD | Product Manager | [说明] | ✅ / ❌ |
| Architecture 方案 | Architect | [说明] | ✅ / ❌ |
| ADR | Architect | [说明] | ✅ / ❌ |

---

## 12. Output

| 输出 | 类型 | 接收方 | 模板 |
|------|------|--------|------|
| [输出 1] | [Code / Document / Config / Report] | [Agent Name] | [模板名称] |
| [输出 2] | [类型] | [Agent Name] | [模板名称] |

---

## 13. Deliverables

| 交付物 | 类型 | 接收方 | 验收标准 |
|--------|------|--------|---------|
| [交付物名称] | [Code / Document / Config / Report] | [Agent Name] | [标准描述] |
| [交付物名称] | [类型] | [Agent Name] | [标准描述] |

---

## 14. Acceptance Criteria

- [ ] [验收标准 1：Given/When/Then 格式]
- [ ] [验收标准 2]
- [ ] [验收标准 3]
- [ ] 代码已通过 Review
- [ ] QA 测试已通过
- [ ] 相关文档已更新

---

## 15. Risks

| # | 风险描述 | 等级 | 缓解方案 | 状态 |
|---|---------|------|---------|------|
| 1 | [风险描述] | [高 / 中 / 低] | [缓解方案] | [跟踪中 / 已解决] |
| 2 | [风险描述] | [高 / 中 / 低] | [缓解方案] | [跟踪中 / 已解决] |

---

## 16. Dependencies

| # | 依赖描述 | 类型 | 阻塞对象 | 预计解除时间 | 状态 |
|---|---------|------|---------|------------|------|
| 1 | [依赖描述] | [模块 / 外部 / 资源 / 决策] | [Agent Name] | YYYY-MM-DD | [跟踪中 / 已解除] |
| 2 | [依赖描述] | [模块 / 外部 / 资源 / 决策] | [Agent Name] | YYYY-MM-DD | [跟踪中 / 已解除] |

---

## 17. Timeline

| 阶段 | 开始日期 | 结束日期 | 负责人 |
|------|---------|---------|--------|
| 需求分析 | YYYY-MM-DD | YYYY-MM-DD | [Owner] |
| 设计 | YYYY-MM-DD | YYYY-MM-DD | [Owner] |
| 开发 | YYYY-MM-DD | YYYY-MM-DD | [Owner] |
| Review | YYYY-MM-DD | YYYY-MM-DD | [Reviewer] |
| QA 测试 | YYYY-MM-DD | YYYY-MM-DD | [QA] |
| 验收 | YYYY-MM-DD | YYYY-MM-DD | [PM] |
| 发布 | YYYY-MM-DD | YYYY-MM-DD | [Owner] |

---

## 18. Status

### 当前状态

Status: [Created / Ready / In Progress / Review / Acceptance / Done / Blocked / Cancelled]

### 状态说明

[当前状态的补充说明]

### 状态历史

| 日期 | 状态 | 说明 | 变更人 |
|------|------|------|--------|
| YYYY-MM-DD | Created | Task 创建 | [Agent Name] |
| YYYY-MM-DD | Ready | 依赖已满足 | [Agent Name] |
| YYYY-MM-DD | In Progress | 开发中 | [Agent Name] |
| YYYY-MM-DD | Done | Task 完成 | [Agent Name] |

---

## 19. Checklist

### 启动前检查

□ Background 是否已明确？

□ Requirement 是否已定义？

□ Priority 是否已分配？

□ Scale (S0~S4) 是否已确认？

□ Owner 是否已指定？

□ Deadline 是否已设定？

### 执行检查

□ Input 是否已准备完整？

□ 依赖是否已满足？

□ 是否有新的风险需要记录？

□ 是否已更新状态？

### 完成检查

□ 所有 Acceptance Criteria 是否已满足？

□ 所有 Deliverables 是否已交付？

□ Review 是否通过？

□ QA 测试是否通过？

□ 文档是否已更新？

□ Task 是否已标记为 Done？

---

## 20. Notes

[补充说明、决策记录、注意事项等]

---

## 21. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| YYYY-MM-DD | v1.0 | 初始版本 | [Owner] |
| YYYY-MM-DD | v1.1 | [修改内容] | [修改人] |

---

# End

本模板依据 AI Company Task Standard 和 Document Standard 设计。

所有 Task 必须基于此模板创建。
