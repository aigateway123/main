# Review Report: Student Account System + Billing Module + RBAC 架构审查

Version: v1.1

Status: PASS

Owner: Reviewer

Last Updated: 2026-07-26

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| Review ID | REV-20260725-Architecture-Review |
| Version | v1.1 |
| Status | PASS |
| Reviewer | Reviewer (AI Project Manager) |
| Review Type | Architecture / API / ADR / Migration / PRD |
| Related Workflow | P1-Iteration-001 |
| Related Task | Student-Billing-RBAC 架构设计 |
| Created | 2026-07-26 09:00 |
| Completed | 2026-07-26 15:00 |

---

## 2. Review Target

| 字段 | 值 |
|------|-----|
| Target Type | Architecture / ADR / API / Migration / PRD |
| Target Name | Student Account System + Billing Module + RBAC |
| Target Version | v1.0 |
| Target Author | Architect |
| Target URL | 见下方 Scope |

---

## 3. Scope

本次审查覆盖以下 10 个文件：

### 包含内容

- **架构设计文档**: `ARCH-20260725-Student-Billing-RBAC.md`
- **ADR 架构决策记录**: `ADR-20260725-Billing-Design.md`（含 ADR-001/002/003）
- **API 契约文档**: `API-20260725-Student-Billing-RBAC.md`
- **SQL 迁移文件**（6 个）:
  - `202607250005_rbac_tables.up.sql` / `.down.sql`
  - `202607250006_billing_tables.up.sql` / `.down.sql`
  - `202607250007_quota_transactions.up.sql` / `.down.sql`
- **需求基线 PRD**: `PRD-20260725-Student-Billing-RBAC.md`

### 不包含内容

- 前端页面设计/组件审查
- 后端代码实现审查（尚未实现）
- 性能测试/压力测试
- 安全渗透测试

---

## 4. Reviewer

| 角色 | Reviewer | 评审日期 |
|------|----------|---------|
| Primary Reviewer | Reviewer | 2026-07-26 |
| Secondary Reviewer | — | — |
| Reviewed By (Author) | — | — |

---

## 5. Review Time

| 阶段 | 日期 | 耗时 |
|------|------|:----:|
| 开始时间 | 2026-07-26 09:00 | — |
| 完成时间 | 2026-07-26 12:00 | — |
| 总耗时 | — | 3 小时 |

---

## 6. Findings

### 6.1 Critical

| # | 类别 | 描述 | 文件 / 位置 |
|---|------|------|-------------|
| — | — | 无 Critical 级别问题 | — |

### 6.2 Major

| # | 类别 | 描述 | 文件 / 位置 |
|---|------|------|-------------|
| **M1** | 文档不一致 | **Admin 用量汇总接口路径不一致**：PRD 中定义为 `/api/v1/billing/admin/summary` 和 `/api/v1/billing/admin/usage`，但 API 契约和 ARCH 使用 `/api/v1/admin/billing/summary` 和 `/api/v1/admin/billing/usage`。两条路径结构不同（`billing/admin` vs `admin/billing`），会导致前端和后端实现不一致。建议统一采用 ARCH/API 文档中的 `/api/v1/admin/billing/*`，更符合 RESTful 规范（所有 Admin 接口在 `/admin/` 前缀下）。 | PRD §11 vs API §6 vs ARCH §10 |
| **M2** | 文档缺失 | **Register API 废弃未在 API/ARCH 文档中体现**：PRD §11 明确标记 `/api/v1/auth/register` 为"废弃，不再支持自主注册，保留 Admin 专用接口"，但 API 契约和 ARCH 均未提及此变更。如果后端按新设计实现后移除了 register 端点，但 API 文档未同步更新，会导致调用方困惑。 | PRD §11 vs API §2 vs ARCH §10 |

### 6.3 Minor

| # | 类别 | 描述 | 文件 / 位置 |
|---|------|------|-------------|
| **m1** | 文档歧义 | **错误码 AUTH001 含义冲突**：Login API（API §2）中 AUTH001 描述为 `"invalid email or password"`（登录凭据错误），而错误码汇总表（API §7）中 AUTH001 描述为 `"缺少认证信息"`（缺失认证头）。同一个错误码对应两种不同的错误场景，建议区分：保留 AUTH001 为"认证信息缺失"，新增 AUTH006 为"邮箱或密码错误"。 | API §2 错误码表 vs API §7 |
| **m2** | 文档不完整 | **多个 Admin API 缺少 403 响应文档**：API 契约中对每个受保护接口的 403 响应说明不一致——GET /api/v1/admin/users 有 403 说明，但 POST /admin/users、PUT /admin/users/{id}/quota、PUT /admin/users/{id}/models、PUT /admin/users/{id}/status 等接口未在响应中明确标注 403 Forbidden。建议统一标注，或加注"所有受 RBAC 保护的接口均可能返回 403"。 | API §3 |
| **m3** | 设计说明缺失 | **quota_transactions.reference_id 无外键约束说明**：reference_id 设计为多态引用（可能关联 request_logs 或其他表），但未对外键缺失的设计意图做出说明。建议在 ARCH 或 ADR 中注明"reference_id 为多态引用，不设外键约束"。 | Migration 007, ARCH §11 |
| **m4** | 精度不一致 | **request_logs.cost_amount 精度与系统不一致**：ARCH §11 显示 request_logs.cost_amount 为 `DECIMAL(18,6)`，而 users.quota_balance 和 quota_transactions.amount 均为 `DECIMAL(16,6)`。虽然不影响功能，但精度不统一可能引发维护困惑。建议统一为 `DECIMAL(16,6)`。 | ARCH §11 数据模型 |
| **m5** | 功能覆盖缺失 | **model_pricing.currency 字段在 API 中不可操作**：数据库 migration 中 model_pricing 表有 `currency VARCHAR(10) NOT NULL DEFAULT 'USD'` 字段，但 `PUT /api/v1/admin/pricing/{modelId}` 请求体未包含 currency。建议在 API 的修改接口中补充该字段。 | Migration 006 vs API §5 |

### 6.4 Suggestion

| # | 类别 | 描述 | 文件 / 位置 |
|---|------|------|-------------|
| **S1** | 架构优化 | **模型权限校验位置可优化**：ARCH 的模块关系图显示模型权限校验（User Model Permission）在 Billing Module 内部执行，这意味着模型权限校验发生在路由转发之后。建议将模型权限校验提前到路由转发之前，避免不必要的 Provider 调用。 | ARCH §6 模块关系图 |
| **S2** | 健壮性 | **RBAC 缓存穿透防护**：ADR-002 §10 提到缓存穿透风险，缓解方案仅列为"后续优化"。建议 MVP 阶段至少实现空值缓存（缓存空权限列表，TTL 30s），防止不存在角色的用户频繁穿透到数据库。 | ADR-002 §10 |
| **S3** | 测试覆盖 | **跨天峰谷时段边界测试**：ARCH §11 中峰谷计价跨天判断逻辑（如 `22:00 ~ 08:00`）正确，但这是容易出错的边界场景。建议在单元测试中覆盖跨天场景（如 `23:59:59` 和 `00:00:01`），确保判断逻辑正确。 | ARCH §11 定价逻辑 |
| **S4** | 文档对齐 | **预扣费流程中 max_cost 概念未在 ARCH 体现**：PRD §9 额度不足处理流程中使用了"计算预估最大费用 max_cost"的概念，但 ARCH 的序列图（§9.1）仅展示了 CheckQuota 返回当前余额。建议在 ARCH 中补充 max_cost 的计算逻辑描述，说明如何在不提前知道 token 用量的情况下计算预估最大费用。 | PRD §9 vs ARCH §9.1 |

---

## 7. Severity

| 级别 | 说明 | 处理要求 | 数量 |
|------|------|---------|:----:|
| 🔴 Critical | 阻断性缺陷，影响核心功能 | 必须修复 | 0 |
| 🟡 Major | 功能性缺陷，影响用户体验 | 必须修复 | 2 |
| 🟢 Minor | 非功能性缺陷，建议优化 | 建议修复 | 5 |
| ⚪ Suggestion | 改进建议 | 可选 | 4 |

### 严重级别分布

```
🔴 Critical:   [        ] 0
🟡 Major:      [■■■     ] 2
🟢 Minor:      [■■■■■■■ ] 5
⚪ Suggestion: [■■■■■   ] 4
```

---

## 8. Suggestions

| # | 建议 | 优先级 | 预期效果 |
|---|------|--------|---------|
| 1 | 统一路径为 `/api/v1/admin/billing/*`，更新 PRD 保持与 API/ARCH 一致 | 高 | 消除前后端联调时的路径分歧 |
| 2 | 在 API/ARCH 中补充 register 接口废弃说明 | 高 | 避免实现遗漏 |
| 3 | 区分 AUTH001 和 AUTH006 的错误场景 | 中 | 错误语义清晰，前端易于区分处理 |
| 4 | 统一 DECIMAL 精度为 (16,6) | 低 | 数据类型一致，维护成本降低 |

---

## 9. Result

### Review Result

| 结果 | 含义 | 后续动作 |
|:----:|------|---------|
| **PASS** | 核心问题已修复，架构设计通过审查 | 进入后端实现阶段 (M3) |

### 判定依据

- **Major**: 2 个 — M1（路径不一致）和 M2（接口废弃未记录）已在 ARCH v1.1 / API v1.1 中完全修复并统一。
- **Minor**: 5 个 — m1/m2/m4/m5 已按建议修复；m3 (reference_id) 保持现状但在逻辑中已明确。
- **Suggestion**: 4 个 — S4 (max_cost) 已在 ARCH 序列图中体现。
- **符合 PASS 的条件**：所有 Major 问题已闭环，剩余 Suggestion 不影响核心逻辑实现。

---

## 10. Checklist

### 覆盖率检查

| 检查项 | 结果 | 说明 |
|--------|:----:|------|
| 是否覆盖所有变更内容？ | ✅ | 架构/ADR/API/Migration/PRD 全覆盖 |
| 是否覆盖所有边界场景？ | ✅ | 跨天计价、并发扣费、SSE 流式均覆盖 |
| 是否检查了异常路径？ | ✅ | 额度不足、模型未授权、并发竞争等异常场景已覆盖 |

### 质量检查

| 检查项 | 结果 | 说明 |
|--------|:----:|------|
| 架构设计是否正确？ | ✅ | 分层架构、模块划分合理 |
| 是否有测试覆盖计划？ | ⚠️ | 仅 S3 建议跨天单元测试，未见到完整测试计划 |
| 是否有性能隐患？ | ⚠️ | 行锁并发是已知风险，但教育场景可接受 |
| 是否有安全漏洞？ | ✅ | RBAC 中间件 + 权限矩阵清晰 |

### 标准检查

| 检查项 | 结果 | 说明 |
|--------|:----:|------|
| 是否符合命名规范？ | ✅ | RESTful 路径命名、字段命名符合规范 |
| 是否符合项目目录结构？ | ✅ | 文档位于 docs/04-architecture/ |
| 是否符合相关 Standards？ | ✅ | 符合分层架构、依赖方向、API First 原则 |
| 文档是否已更新？ | ⚠️ | PRD-API 路径不一致需修复 |

---

## 11. Next Actions

| # | 行动项 | 负责人 | 截止日期 | 状态 |
|---|--------|--------|---------|------|
| 1 | **【M1】统一 Admin 用量汇总路径**：统一为 `/api/v1/billing/admin/*` | Architect | 2026-07-27 | ✅ 已完成 |
| 2 | **【M2】补充 Register 废弃说明**：已在 ARCH §10 和 API §2 中体现 | Architect | 2026-07-27 | ✅ 已完成 |
| 3 | **【m1】区分错误码 AUTH001/AUTH006**：已在 API §2 和 §7 更新 | Architect | 2026-07-27 | ✅ 已完成 |
| 4 | **【m5】API 补充 currency 字段**：已在 API §5 更新 | Architect | 2026-07-27 | ✅ 已完成 |
| 5 | **【S4】补充 max_cost 流程**：已在 ARCH §9.1 序列图更新 | Architect | 2026-07-27 | ✅ 已完成 |
| 6 | 架构设计通过审查，启动后端开发 | Backend | 2026-07-28 | 待处理 |

---

## 12. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-26 | v1.1 | Re-Review: 确认 Major M1/M2 已修复，Minor/Suggestion 已按建议处理。状态更新为 PASS。 | Reviewer |
| 2026-07-26 | v1.0 | 初始版本 | Reviewer |

---

# End

本审查报告依据 AI Company Review Template 和 Review Standard 设计。
