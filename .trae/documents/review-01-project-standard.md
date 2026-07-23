# Review: 01-project-standard.md 内容审核

## 目标
对比用户提出的 `01-project-standard.md` 草案与 `AI Gateway 项目规划.md`（规划文档），指出不一致之处。

---

## 发现的差异点

### 1. 项目名称不一致
| 位置 | 规划文档 | 用户草案 |
|------|---------|---------|
| 项目名称 | **Nova** AI Gateway | AI Gateway（缺少 Nova 品牌名） |

**建议**: 补充完整品牌名 `Nova AI Gateway`。

---

### 2. MVP 第一阶段缺失核心模块

**规划文档 Phase 1 核心功能**: 登录注册、API Key、Provider、Models、**Gateway**、Router、Dashboard、**Admin**

**用户草案第一阶段（MVP）缺少**:
- ❌ **登录注册** — Phase 1 明确列出的功能
- ❌ **Gateway**（作为核心模块）— Phase 1 明确列出
- ❌ **Admin**（管理后台）— Phase 1 明确列出

**建议**: MVP 阶段补充「登录注册」「Gateway 核心」「Admin」三项。

---

### 3. 当前阶段范围（Phase P0 ~ P2）允许开发内容有出入

**用户草案列出当前允许开发**: Gateway、Provider、Models、API Keys、Router、Dashboard、Usage、Logs、Cost Engine、Policy Engine、**Billing**

**规划文档 Phase 2 核心功能**: Policy Engine、**Pricing**、**Quota**、Usage、Cost、**Alert**、**Budget**

差异：
- ❌ **Billing** 不在 P0~P2 范围内 — 规划文档中 Billing 属于商业化模块，Phase 6 才涉及（"如果商业化，这个几乎是必备模块"）
- ❌ **Pricing**、**Quota**、**Alert**、**Budget** 是 Phase 2 明确列出的功能，草案中未提及

**建议**:
- 将 Billing 从 P0~P2 范围中移除，移入后续阶段
- 在 Phase 2 范围中补充 Pricing、Quota、Alert、Budget

---

### 4. "Monitoring" 不在规划文档中

**用户草案第二阶段**: Cost Engine、Policy Engine、Billing、**Monitoring**

**规划文档**: 没有独立的 "Monitoring" 模块。监测能力分散在 Dashboard（实时数据）、Logs、Usage、Alerts 中。

**建议**: 将 "Monitoring" 改为 Logs + Usage + Alerts，与规划文档保持一致。

---

### 5. "Plugin Marketplace" 命名与规划文档不一致

**用户草案「当前不开发内容」**: Plugin Marketplace
**规划文档 Phase 4**: **Skill** Marketplace

**建议**: 统一命名为 **Skill Marketplace**，与规划文档保持一致。

---

### 6. Workflow 在第二阶段不应列入「不开发」

**用户草案「当前不开发内容」**: Workflow Platform
**规划文档 Phase 3**: Workflow(Beta) 是明确要开发的功能

当前阶段是 P0~P2，Workflow 在 Phase 3，确实当前不开发，这一点本身成立。
但需要注意：Workflow Platform 的命名与规划文档中的 "Workflow（基础）" 有程度差异。规划文档在 Phase 3 是 Workflow 基础版，不是完整平台。

**建议**: 将 "Workflow Platform" 改为 "Workflow（基础版在Phase 3开放）"，避免歧义。

---

### 7. 第三阶段描述缺少 Agent Runtime

**用户草案第三阶段**: Developer Platform、Skill Marketplace、Enterprise Platform、AI Infrastructure Platform
**规划文档**: Phase 3 Developer Platform → Phase 4 Skill Marketplace → Phase 5 **Agent Runtime** → Phase 6 Enterprise AI Platform

用户草案跳过了 Phase 5 的 **Agent Runtime**。

**建议**: 在第三阶段中补充 Agent Runtime。

---

### 8. 产品定位缺少「智能路由」和「成本优化」

**规划文档一句话介绍**: "面向企业和 AI 开发者的大模型统一接入平台，提供**模型聚合、智能路由、成本优化**、Agent Runtime 以及行业 AI 能力。"

**用户草案定位**: "是一个面向 AI 开发者与企业的统一 AI 基础设施平台。平台通过统一的 Gateway 屏蔽不同大模型厂商之间的差异，为开发者提供统一的模型调用、权限管理、成本控制、策略路由、监控分析等能力。"

差异不大，但规划文档强调的"智能路由"和"成本优化"在草案中变成了"策略路由"和"成本控制"，表述略有偏差。

**建议**: 将"策略路由"改为"**智能路由**"，将"成本控制"改为"**成本优化**"，与规划文档保持一致。

---

### 9. 整体补充建议

- 规划文档中的 **Nova** 品牌名建议保留
- 补充项目原则时，建议引用规划文档中的**性能目标**（API Gateway <10ms, Policy Engine <2ms 等）
- 规划文档中的**异步化架构**建议（Event Queue 异步处理日志/成本/统计）是重要架构决策，建议在开发原则中补充

---

## 总结：需要修正的关键项

| # | 问题 | 优先级 |
|---|------|--------|
| 1 | 缺少 Nova 品牌名 | 低 |
| 2 | MVP 缺少 登录注册/Gateway/Admin | **高** |
| 3 | Billing 不应在 P0~P2 范围 | **高** |
| 4 | 缺少 Pricing/Quota/Alert/Budget | **高** |
| 5 | Monitoring 不是独立模块 | 中 |
| 6 | Plugin Marketplace → Skill Marketplace | 中 |
| 7 | 第三阶段缺少 Agent Runtime | 中 |
| 8 | "策略路由" / "成本控制" 表述偏差 | 低 |
