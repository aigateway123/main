# AI Company Review Standard

Version: v1.0

Status: Draft

Owner: Reviewer

Last Updated: 2026-07-12

---

## 1. Review Principles

### Principle 1 — Review Required

所有代码变更必须经过 Code Review。

所有架构方案必须经过 Architecture Review。

所有 PRD 必须经过 PRD Review。

禁止未经 Review 直接进入下一阶段。

---

### Principle 2 — Independent

Reviewer 不得 Review 自己编写的代码或文档。

Reviewer 必须保持独立视角。

---

### Principle 3 — Objective

Review 必须基于客观标准。

禁止基于个人偏好做出 Review 结论。

---

### Principle 4 — Timely

Review 必须在规定时限内完成。

禁止拖延 Review 阻塞开发进度。

---

### Principle 5 — Constructive

Review 意见必须包含具体问题描述和改进建议。

禁止仅写"不行"而不说明原因。

---

### Principle 6 — Traceable

所有 Review 必须有记录。

Review 结论必须可追溯。

---

## 2. Review Lifecycle

```
                    ┌──────────────────┐
                    │   Requested      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   In Progress    │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │     Pass     │  │  Need Fix    │
            └───────┬───────┘  └──────┬───────┘
                    │                 │
                    │                 ▼
                    │          ┌──────────────┐
                    │          │    Fixed     │
                    │          └──────┬───────┘
                    │                 │
                    │          ┌────────────┐
                    │          │ Re-Review  │
                    │          └─────┬──────┘
                    │                │
                    └──────┬─────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │   Rejected   │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │    Closed    │
                   └──────────────┘
```

| 状态 | 说明 |
|------|------|
| Requested | Review 请求已提交 |
| In Progress | Review 进行中 |
| Pass | Review 通过 |
| Need Fix | 需要修改 |
| Fixed | 已修改完成 |
| Re-Review | 重新 Review 中 |
| Rejected | 不通过 |
| Closed | Review 结束 |

---

## 3. Review Workflow

### 通用 Review 流程

```
Review Requested
    │
    ▼
Reviewer 接收
    │
    ├── Reviewer 可用 → In Progress
    │
    └── Reviewer 不可用 → 超时后自动升级
            │
            ▼
        AI Project Manager 重新分配 Reviewer
    │
    ▼
Reviewer 执行 Review
    │
    ├── Pass → Closed
    │
    ├── Need Fix → 通知提交者修复
    │       │
    │       ▼
    │   提交者修复 → Fixed
    │       │
    │       ▼
    │   Re-Review
    │       │
    │       ├── Pass → Closed
    │       │
    │       └── Need Fix → 再次修复
    │
    └── Reject → Closed（返回上一 Workflow 阶段）
```

### 超时规则

| Review 类型 | 超时时间 | 自动升级到 |
|-------------|---------|-----------|
| Code Review | 4 小时 | Architect |
| Architecture Review | 8 小时 | AI Project Manager |
| PRD Review | 8 小时 | AI Project Manager |
| Document Review | 4 小时 | Architect |
| Security Review | 8 小时 | Architect |
| Performance Review | 8 小时 | Architect |
| Business Review | 24 小时 | CEO |

---

## 4. Code Review

### 触发条件

- 所有功能代码变更
- Bug 修复代码变更
- 重构代码变更
- 配置变更

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 代码正确性 | 逻辑是否正确，是否覆盖边界情况 |
| 代码风格 | 是否符合项目风格规范 |
| 性能 | 是否存在性能隐患 |
| 安全 | 是否存在安全漏洞 |
| 可测试性 | 是否便于编写测试 |
| 可维护性 | 是否清晰易懂 |
| 复用性 | 是否存在重复代码 |

### Code Review 要求

- 每次 Review 代码行数不超过 400 行
- 超过 400 行必须拆分为多次 Review
- Review 必须逐行检查变更代码
- 自动化检查（Lint、Format）不纳入人工 Review 范围

---

## 5. Architecture Review

### 触发条件

- 新增模块
- 模块拆分或合并
- 技术方案选型
- 数据库设计
- 第三方服务集成
- API 设计变更

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 架构合理性 | 是否符合整体架构设计 |
| 模块划分 | 职责是否清晰，耦合度是否合理 |
| 扩展性 | 是否支持未来需求扩展 |
| 性能目标 | 是否满足性能指标（Gateway <10ms, Policy Engine <2ms 等） |
| 安全性 | 是否存在架构级安全风险 |
| 数据流 | 数据流向是否清晰正确 |
| 技术选型 | 选型理由是否充分，是否有 ADR |

### Architecture Review 前置条件

- 必须有 Architecture 文档
- 大型方案必须有 ADR
- 必须包含架构图（Mermaid）

---

## 6. PRD Review

### 触发条件

- 新功能 PRD 完成
- 功能变更 PRD 更新

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 需求完整性 | 功能需求是否覆盖所有场景 |
| 用户故事 | 用户故事是否清晰可理解 |
| 验收标准 | 验收标准是否可测试 |
| 非功能需求 | 是否包含性能、安全等非功能需求 |
| 影响范围 | 是否分析了影响范围 |
| 风险 | 是否识别了潜在风险 |
| 与 Roadmap 一致性 | 是否符合当前 Phase 目标 |

### PRD Review 参与角色

- Reviewer（主持）
- Architect（评估技术可行性）
- QA（评估可测试性）
- AI Project Manager（评估工期影响）

---

## 7. Document Review

### 触发条件

- Standards 文档发布或修改
- ADR 发布
- API 文档发布或修改
- Architecture 文档发布或修改
- Workflow 定义发布或修改

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 格式合规 | 是否符合 04-document-standard 规范 |
| 内容准确 | 信息是否准确无歧义 |
| 完整性 | 是否包含所有必要章节 |
| 一致性 | 是否与相关文档一致 |
| 可读性 | 是否清晰易懂 |

---

## 8. Security Review

### 触发条件

- 涉及用户认证的模块
- 涉及 API Key 管理的模块
- 涉及支付/计费的模块
- 涉及数据存储的模块
- 涉及第三方 API 调用的模块

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 认证安全 | API Key 存储和传输是否安全 |
| 数据安全 | 用户数据是否加密存储和传输 |
| 权限控制 | 权限校验是否完整 |
| 输入验证 | 输入是否经过合法性校验 |
| 防注入 | 是否存在注入风险 |
| 日志安全 | 日志是否包含敏感信息 |
| 第三方安全 | 第三方服务是否安全可靠 |

### Security Review 要求

- Security Review 必须由 Architect 或指定的安全 Reviewer 执行
- High 级别安全问题必须修复后才能 Pass
- Security Review 不通过时禁止上线

---

## 9. Performance Review

### 触发条件

- 涉及主链路的模块（Gateway、Router、Policy Engine）
- 涉及高并发场景的模块
- 涉及大量数据处理的模块
- 引入新的外部服务调用

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 响应时间 | 是否符合性能目标 |
| 并发能力 | 是否支持预期 QPS |
| 资源消耗 | CPU、内存使用是否合理 |
| 数据库查询 | 是否有 N+1 查询等问题 |
| 缓存策略 | 缓存使用是否合理 |
| 异步处理 | 非关键路径是否异步化 |
| 慢查询 | 是否存在潜在慢查询 |

### Performance Review 参考目标

| 模块 | 目标 |
|------|------|
| API Gateway 主链路 | < 10ms（不含模型推理时间） |
| Policy Engine | < 2ms |
| Router | < 2ms |
| 数据库查询 | 99% < 10ms |

---

## 10. Business Review

### 触发条件

- 涉及定价策略变更
- 涉及商业模式调整
- 涉及成本结构变更
- 涉及客户计费方案
- 涉及 Route 策略中的利润优化

### Review 重点

| 检查项 | 说明 |
|--------|------|
| 商业目标一致性 | 是否符合当前商业目标 |
| 成本影响 | 对 API 成本和运营成本的影响 |
| 收入影响 | 对收入和利润的影响 |
| 定价合理性 | 定价是否符合市场水平 |
| ROI | 投入产出比是否合理 |

### Business Review 参与者

- Reviewer（主持）
- CEO（审批）
- Product Manager
- Architect（评估技术成本）

---

## 11. Review Result

### 结果类型

| 结果 | 含义 | 后续动作 |
|------|------|---------|
| Pass | Review 通过 | 进入下一阶段 |
| Need Fix | 需要修改 | 提交者修复后 Re-Review |
| Reject | 不通过 | 返回上一 Workflow 阶段 |

### Pass 条件

- 所有 Critical 和 Major 问题已修复
- 剩余 Minor 问题不影响功能正确性
- 代码/文档符合质量标准

### Need Fix 条件

- 存在 Critical 或 Major 问题
- 问题可在合理时间内修复
- 修复后无需重新 Review 全部内容

### Reject 条件

- 存在架构级问题
- 存在方向性错误
- 存在大量质量问题
- 与 PRD 或需求严重不符

### 结果与 Workflow 的对应

| Review 结果 | Workflow 后续阶段 |
|------------|------------------|
| Pass | 进入 Testing / Accepting 阶段 |
| Need Fix | 返回上一阶段修复后 Re-Review |
| Reject | 返回上一 Workflow 阶段重新执行 |

---

## 12. Review Status

### Review 生命周期状态

```
Requested → In Progress → Pass → Closed
                        → Need Fix → Fixed → Re-Review → Pass → Closed
                                                  → Need Fix → Fixed → ...
                        → Reject → Closed
```

### 状态定义

| 状态 | 说明 | 拥有者 |
|------|------|--------|
| Requested | Review 请求已提交，等待 Reviewer | AI Project Manager |
| In Progress | Reviewer 正在 Review | Reviewer |
| Pass | Review 通过 | Reviewer |
| Need Fix | 需要提交者修复问题 | 提交者 |
| Fixed | 提交者已完成修复 | 提交者 |
| Re-Review | Reviewer 正在重新 Review | Reviewer |
| Reject | Review 不通过 | Reviewer |
| Closed | Review 结束 | Reviewer |

### 状态迁移规则

| 当前状态 | 下一个状态 | 条件 |
|----------|-----------|------|
| Requested | In Progress | Reviewer 已接收 |
| In Progress | Pass | 无重大问题 |
| In Progress | Need Fix | 存在需修复问题 |
| In Progress | Reject | 存在方向性或架构级问题 |
| Need Fix | Fixed | 提交者完成修复 |
| Fixed | Re-Review | Reviewer 开始重新 Review |
| Re-Review | Pass | 问题已全部修复 |
| Re-Review | Need Fix | 仍有未修复问题 |
| Pass | Closed | Review 结束 |
| Reject | Closed | Review 结束 |

---

## 13. Review Template

### 通用 Review 模板

```markdown
# Review Report: [Review ID]

Review Type: [Code / Architecture / PRD / Document / Security / Performance / Business]

Workflow ID: [关联 Workflow 实例 ID]

Reviewer: [Reviewer Name]

Status: [In Progress / Pass / Need Fix / Reject / Closed]

Requested: YYYY-MM-DD HH:mm

Completed: YYYY-MM-DD HH:mm

---

## 1. Review Scope

[本次 Review 的范围描述]

## 2. Review Result

Result: [Pass / Need Fix / Reject]

## 3. Issues Found

| # | Severity | Description | File / Location | Status |
|---|----------|-------------|-----------------|--------|
| 1 | Critical | ... | ... | Fixed |
| 2 | Major | ... | ... | Pending |
| 3 | Minor | ... | ... | Ignored |

## 4. Suggestions

- [建议 1]
- [建议 2]

## 5. Review Checklist

□ 是否覆盖所有变更内容？

□ 是否存在 Critical 级别问题？

□ 是否存在 Major 级别问题？

□ 是否满足质量标准？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
```

---

## 14. Review Checklist

### 通用检查

□ 是否已读取相关 Standards？

□ Review 类型是否匹配变更内容？

□ Review 范围是否清晰？

□ 是否在规定时限内完成？

---

### Code Review 专项

□ 代码逻辑是否正确？

□ 是否有边界情况未处理？

□ 是否有性能隐患？

□ 是否有安全漏洞？

□ 是否有重复代码？

□ 是否有适当的错误处理？

---

### Architecture Review 专项

□ 架构是否符合整体设计？

□ 模块划分是否合理？

□ 是否满足性能目标？

□ 是否有 ADR？

□ 数据流是否清晰？

---

### PRD Review 专项

□ 需求是否完整？

□ 验收标准是否可测试？

□ 是否分析了影响范围？

□ 是否识别了风险？

---

### Security Review 专项

□ API Key 和认证是否安全？

□ 数据是否加密？

□ 输入是否经过校验？

□ 日志是否不包含敏感信息？

---

### Performance Review 专项

□ 是否满足响应时间目标？

□ 是否有 N+1 查询？

□ 缓存策略是否合理？

□ 异步化是否到位？

---

## Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-12 | v1.0 | 初始版本 | Reviewer |

---

# End

本规范是 AI Company 所有 Review 的统一标准。

所有 Review 活动必须遵守本规范。

如与 Project Standard 冲突：Project Standard 优先。

如与 Agent Standard 冲突：Agent Standard 优先。

如与 Decision Standard 冲突：Decision Standard 优先。
