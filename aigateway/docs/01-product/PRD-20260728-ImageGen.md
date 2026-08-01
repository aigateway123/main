# PRD: 图片生成（Image Generation）模型支持

Version: v1.0

Status: Draft

Owner: Product Manager

Last Updated: 2026-07-28

Related Workflow: P1-Iteration-003

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| PRD ID | PRD-20260728-ImageGen |
| Version | v1.0 |
| Status | Draft |
| Owner | Product Manager |
| Related Workflow | P1-Iteration-003 |
| Related Task | Image Generation 模型接入 |
| Created | 2026-07-28 |
| Last Updated | 2026-07-28 |

---

## 2. Product Background

### 为什么需要图片生成支持

Nova AI Gateway 当前仅支持 Chat Completions（文本对话）模型，无法满足用户对多模态 AI 能力的调用需求。图片生成是大模型应用的重要场景之一，覆盖广告创意、内容创作、设计辅助等广泛用例。

### 行业背景

2026 年多模态大模型加速普及，主流云厂商和 AI 平台均已将图片生成作为标准能力：

| 维度 | 趋势 |
|------|------|
| 市场需求 | 图片生成 API 调用量在过去一年增长超 3 倍，已成为第二大 AI 模型调用类型（仅次于文本对话） |
| 竞争格局 | OpenAI（DALL·E）、Cloudflare AI Gateway、Portkey 均已支持图片生成 API |
| 生态标准 | OpenAI `/v1/images/generations` 已成为行业事实标准接口 |
| 模型供给 | 国内头部厂商（智谱 GLM、阿里万相、通义千问）均已推出高质量图片生成模型 |

竞争对手已经支持的能力：
- OpenAI：DALL·E 2/3 通过 `/v1/images/generations` 提供图片生成
- Cloudflare AI Gateway：统一 API 覆盖文本 + 图片 + 音频
- Portkey：支持多种图片生成模型的路由和成本追踪

### 用户需求

- **开发者**：希望通过统一的 OpenAI 兼容 API 调用图片生成，不需要为每个厂商单独适配
- **企业客户**：需要在同一个平台上管理文本和图片模型的用量与成本
- **内容创作者**：需要按张数计费的图片生成服务，而非按 Token 计费

---

## 3. Problem Statement

Nova AI Gateway 仅支持 Chat Completions 模型，无法满足用户图片生成的多模态调用需求。

| 问题 | 影响 |
|------|------|
| 不支持图片生成模型 | 用户无法通过 Nova AI Gateway 调用 GLM-Image、wan2.7-image-pro、qwen-image-2.0 等图片生成模型 |
| 按 Token 计费模型不适用 | 图片生成按张数计费，现有计费体系无法支持非 Token 用量单位 |
| 供应商 API 差异大 | 不同图片生成模型的请求/响应格式差异显著，缺乏统一抽象层 |
| 平台能力单一 | 无法支撑多模态场景，限制平台的市场覆盖面和用户获取 |

---

## 4. Goals

### 产品目标

- **G1**: 支持通过统一 API 调用图片生成模型，首批接入 3 个模型（GLM-Image、wan2.7-image-pro、qwen-image-2.0）
- **G2**: 支持按张数而非 Token 计费，扩展计费体系以支持多种用量单位
- **G3**: 保持 OpenAI API 兼容，提供 `/v1/images/generations` 标准端点
- **G4**: Admin 后台支持图片生成模型的配置、管理和定价设置

### 非目标

- **不在本次范围**：图片编辑（Image Edit/Inpainting）—— 后续迭代考虑
- **不在本次范围**：图片变体（Image Variation）—— 后续迭代考虑
- **不在本次范围**：视频生成模型接入
- **不在本次范围**：音频生成/语音模型接入
- **不在本次范围**：图片存储管理（由用户自行保存图片）

---

## 5. Business Value

| 价值 | 衡量方式 | 预期效果 |
|------|---------|---------|
| 扩展平台能力覆盖 | 新增支持的模型品类数 | 从仅 Chat → Chat + Image，2 个品类 |
| 吸引更多开发者用户 | 图片生成 API 调用用户数 | 上线后首月 ≥ 10 个活跃调用用户 |
| 提升平台 ARPU 值 | 图片生成带来的新增 API 调用量 | 上线后首月 ≥ 1000 次图片生成请求 |
| 增强竞争力 | 与竞品功能对标 | 追上 Cloudflare AI Gateway / Portkey 多模态支持水平 |

### ROI 分析

- **投入成本**：后端开发约 1 周 + 前端开发约 3 天 + QA 测试约 2 天
- **预期收益**：拓展平台调用场景，吸引图片生成需求的开发者客户，为后续多模态能力扩展奠定基础
- **预期 ROI**：中等投入，中短期回报；扩展平台品类是平台长期增长的必要路径

---

## 6. User Story

### 核心用户故事

- **作为开发者**，我希望通过 OpenAI 兼容的 API（`/v1/images/generations`）调用图片生成模型，以便快速集成到我的应用中，无需学习每个厂商的独立 API。
- **作为 Admin 管理员**，我希望在后台配置图片生成模型的接入信息和定价，以便平台可以正常计费和运营。
- **作为开发者**，我希望图片生成按张数计费，并且能够在我的用量报表中清晰看到图片生成的费用明细。
- **作为平台运营人员**，我希望在日志中区分 Chat 和 Image 请求，以便准确分析平台使用情况。

### 用户角色

| 角色 | 描述 | 主要需求 |
|------|------|---------|
| 开发者 | 通过 API 调用图片生成模型的用户 | 统一的 OpenAI 兼容 API；清晰的定价信息；稳定的服务 |
| Admin 管理员 | 管理平台配置的平台运营人员 | 配置 Provider 和模型；设置图片生成定价；查看用量和日志 |
| 平台运营 | 分析平台使用情况的运营人员 | 区分模型类型的用量统计；按张数/按 Token 的分开计量 |

---

## 7. Functional Requirements

| # | 需求描述 | 优先级 | 备注 |
|---|---------|--------|------|
| FR-1 | **Model 增加 `model_type` 字段**：区分 chat（文本对话）/ image（图片生成）/ embedding（向量嵌入）三种类型 | P0 | 默认值为 chat，向后兼容 |
| FR-2 | **Provider Binding 支持不同模型类型使用不同 API 路径**：同一 Provider 可为 Chat 和 Image 模型配置不同的 API 路径（如 `/v1/chat/completions` vs `/v1/images/generations`） | P0 | 现有 Provider-Binding 表增加 `api_path_override` 字段 |
| FR-3 | **新增 `POST /v1/images/generations` 端点**：遵循 OpenAI API 规范，接收 `prompt`、`n`（生成张数）、`size`、`model` 参数，返回图片 URL 或 Base64 数据 | P0 | Gateway 层新增路由 |
| FR-4 | **ModelPricing 支持非 Token 计费单位**：增加 `pricing_unit` 字段（token / image_count），按张数计费时单位为 `image_count` | P0 | Billing Service 处理计费逻辑 |
| FR-5 | **RequestLog 扩展支持记录模型类型和用量单位**：增加 `model_type`、`usage_unit`、`usage_amount` 字段 | P1 | 方便区分和统计不同类型模型的用量 |
| FR-6 | **Admin 后台模型管理页支持 `model_type` 筛选和展示**：列表页增加类型标签/过滤器，编辑页支持选择模型类型 | P1 | 前端实现 |
| FR-7 | **Admin 后台定价页支持图片计费配置**：支持按"每张"设置单价，而非按 Token | P1 | 前端实现，与 FR-4 联动 |

### 优先级定义

| 优先级 | 说明 |
|--------|------|
| P0 | MVP 必须完成 |
| P1 | 重要，建议在 MVP 中完成 |
| P2 | 锦上添花 |

---

## 8. Non-functional Requirements

| 类型 | 要求 | 验收标准 |
|------|------|---------|
| 性能 | 图片生成请求超时设置为 120s | 超过 120s 未返回时主动断开并返回超时错误 |
| 兼容性 | 向后兼容已有 Chat 模型 | 现有 Chat Completions API 完全不受影响，无任何行为变化 |
| 可扩展 | 新模型类型接入无需修改核心路由逻辑 | 新增模型品类仅需配置和适配层代码，不修改 Gateway 主流程 |
| API 兼容 | `POST /v1/images/generations` 遵循 OpenAI API 规范 | 入参和出参格式与 OpenAI DALL·E API 保持一致 |

---

## 9. User Flow

### 主流程：Admin 配置 → 开发者调用

```
Admin 登录控制台
    │
    ▼
进入 Provider 管理 → 配置图片生成 Provider
    │
    ▼
进入 Model 管理 → 新增图片生成模型（选择 model_type = image）
    │
    ▼
配置模型绑定（选择 Provider + API 路径）
    │
    ▼
进入定价管理 → 设置模型定价（按张数设置单价）
    │
    ▼
──────────────────────────────────────
    │
    ▼
开发者获取 API Key
    │
    ▼
调用 POST /v1/images/generations
（参数：model, prompt, n, size）
    │
    ▼
Gateway 路由到对应 Provider
    │
    ▼
Provider 返回图片数据
    │
    ▼
系统按张数扣费 → 返回响应给开发者
    │
    ▼
用量报表中可查看图片生成请求明细
```

### 异常流程

- **Provider 返回超时**：Gateway 在 120s 超时后返回 504 Gateway Timeout，不扣除费用
- **不支持的 size 参数**：返回 400 Bad Request，提示支持的图片尺寸列表
- **Provider API 异常**：返回 502 Bad Gateway，错误信息中携带原始 Provider 错误
- **余额不足**：与 Chat 模型一致的余额检查流程，返回 402 Payment Required

---

## 10. Wireframe

### Admin 模型管理页 — 新增/编辑模型

```
┌────────────────────────────────────────────────────┐
│  新增 Model                                        │
├────────────────────────────────────────────────────┤
│  Model Name:    [________________________]         │
│  Model ID:      [________________________]         │
│  Model Type:    [  Chat ▼  ]  ← 新增下拉选择       │
│                 ├ Chat                             │
│                 ├ Image          ← 新增选项        │
│                 └ Embedding                        │
│  Description:   [________________________]         │
│                                                    │
│  供应商绑定:                                        │
│  ┌──────────────────────────────────────────┐      │
│  │ Provider │ API Path              │ 权重 │      │
│  │──────────┼───────────────────────┼──────│      │
│  │ 智谱 GLM │ /v1/images/generations│  100 │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  [  取消  ]  [  保存  ]                             │
└────────────────────────────────────────────────────┘
```

### Admin 定价页 — 图片模型定价配置

```
┌────────────────────────────────────────────────────┐
│  定价管理 — 图片生成模型                            │
├────────────────────────────────────────────────────┤
│                                                    │
│  Model: GLM-Image                                   │
│  ┌──────────────────────────────────────────┐      │
│  │ 计价单位:  [ 按张数 ▼ ]                  │      │
│  │            ├ 按 Token                     │      │
│  │            └ 按张数  ← 新增              │      │
│  │                                            │      │
│  │ 单价:      [  0.10  ] 元/张               │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  [  取消  ]  [  保存  ]                             │
└────────────────────────────────────────────────────┘
```

---

## 11. API Impact

| 接口 | Method | 变更类型 | 说明 |
|------|--------|---------|------|
| `/v1/images/generations` | POST | 新增 | 图片生成端点，遵循 OpenAI API 规范 |
| `/v1/models` | GET | 修改 | 响应中增加 `modelType` 字段（chat / image / embedding） |
| `/v1/models/{id}` | GET | 修改 | 响应中增加 `modelType` 字段 |
| `/api/v1/admin/models` | GET/POST/PUT | 修改 | 管理 API 增加 `model_type` 字段 |
| `/api/v1/admin/pricing` | GET/POST/PUT | 修改 | 定价 API 增加 `pricing_unit` 和 `unit_price` 字段 |
| `/api/v1/admin/provider-bindings` | GET/POST/PUT | 修改 | 增加 `api_path_override` 字段 |

### 向后兼容

- 所有现有 API 的响应中新增字段均为可选字段或默认值，已有客户端不受影响
- `/v1/models` 响应中已有模型默认 `modelType: "chat"`，不改变现有行为
- 现有计费逻辑不变，`pricing_unit` 默认值为 `token`

---

## 12. Database Impact

| 表名 | 变更类型 | 说明 |
|------|---------|------|
| `models` | 修改 | 新增 `model_type` 字段（VARCHAR(32)），默认值 `chat` |
| `model_provider_bindings` | 修改 | 新增 `api_path_override` 字段（VARCHAR(255)），可为 NULL |
| `model_pricing` | 修改 | 新增 `pricing_unit` 字段（VARCHAR(32)），默认值 `token`；新增 `unit_price` 字段（DECIMAL）支持不同计价单位定价 |
| `request_logs` | 修改 | 新增 `model_type`（VARCHAR(32)）、`usage_unit`（VARCHAR(32)）、`usage_amount`（DECIMAL）字段 |

### 迁移计划

1. 执行 `models` 表新增字段迁移，已有数据 `model_type` 设为 `chat`
2. 执行 `model_provider_bindings` 表新增字段迁移，已有数据 `api_path_override` 设为 NULL
3. 执行 `model_pricing` 表新增字段迁移，已有数据 `pricing_unit` 设为 `token`、`unit_price` 设为 NULL
4. 执行 `request_logs` 表新增字段迁移，已有数据三个字段均设为 NULL

---

## 13. Risks

| # | 风险描述 | 等级 | 可能性 | 影响 | 缓解方案 |
|---|---------|------|--------|------|---------|
| 1 | **不同供应商图片生成 API 格式差异大**：GLM-Image、wan2.7-image-pro、qwen-image-2.0 的请求/响应参数和认证方式各不相同 | 中 | 高 | 适配工作量增加，延长开发周期 | 采用适配器模式（Adapter Pattern），每个 Provider 实现独立的 Request/Response 转换器；预留 1~2 天适配调试时间 |
| 2 | **图片生成请求超时**：图片生成通常耗时较长（5~30s），部分大图/复杂 prompt 可能超过 60s | 中 | 中 | 用户体验差，请求频繁超时 | Gateway 设置 120s 超时；响应采用流式或轮询机制（视 Provider 能力而定） |
| 3 | **图片尺寸/格式不兼容**：不同模型支持的图片尺寸（size）和返回格式（URL vs Base64）不同 | 低 | 中 | 开发者困惑 | API 层面统一入参格式，内部做参数映射；文档中明确说明各模型支持的尺寸 |
| 4 | **计费精度问题**：按张数计费时，如果生成部分成功（n=3 但只成功 2 张）如何处理 | 低 | 低 | 计费争议 | 按实际成功返回的张数计费，失败部分不计费；在响应中返回实际生成数量 |

---

## 14. Milestone

| 里程碑 | 交付物 | 时间 | 负责人 |
|--------|--------|------|--------|
| M1: PRD 评审通过 | 经 Reviewer 审查后的最终 PRD 文档 | Day 1 | Product Manager |
| M2: 架构设计完成 | 架构设计文档 + ADR | Day 2-3 | Architect |
| M3: 数据库迁移 + 后端 P0 功能 | models 表/定价表/绑定的数据库迁移 + FR-1~FR-4 后端实现 | Day 4-8 | Backend Engineer |
| M4: Image Generation 适配器 | 3 个图片生成 Provider 的适配器实现 | Day 6-9 | Backend Engineer |
| M5: Gateway 新端点 | `/v1/images/generations` 端点 + 路由 + 超时处理 | Day 7-9 | Backend Engineer |
| M6: Admin 前端 | 模型管理页 model_type 支持 + 定价页图片计费配置（FR-6, FR-7） | Day 9-11 | Frontend Engineer |
| M7: RequestLog 扩展 | request_logs 表扩展 + 日志记录适配（FR-5） | Day 10-12 | Backend Engineer |
| M8: Review + QA | Reviewer 审查 + QA 功能测试 + 验收 | Day 12-14 | Reviewer + QA |

**总工期预计：14 个工作日（含并行开发）**

---

## 15. Acceptance Criteria

### 功能验收

- [ ] **AC-1**：Admin 后台可以创建 `model_type = image` 的模型，并能正常保存和展示
- [ ] **AC-2**：Admin 后台可以为 Image 模型绑定 Provider 并配置独立的 API 路径
- [ ] **AC-3**：`POST /v1/images/generations` 端点可用，支持传入 `model`、`prompt`、`n`、`size` 参数
- [ ] **AC-4**：GLM-Image 模型可通过 `/v1/images/generations` 正常调用并返回图片数据
- [ ] **AC-5**：wan2.7-image-pro 模型可通过 `/v1/images/generations` 正常调用并返回图片数据
- [ ] **AC-6**：qwen-image-2.0 模型可通过 `/v1/images/generations` 正常调用并返回图片数据
- [ ] **AC-7**：Admin 后台可以配置 Image 模型的定价（计价单位 = 按张数，单价可设置）
- [ ] **AC-8**：图片生成调用按实际生成张数正确计费，费用在用量报表中正确体现
- [ ] **AC-9**：现有 Chat Completions API 完全不受影响，功能正常
- [ ] **AC-10**：`GET /v1/models` 返回的响应中包含 `modelType` 字段

### 非功能验收

- [ ] **AC-11**：图片生成请求在 120s 内返回，超过 120s 返回 504 超时错误
- [ ] **AC-12**：不支持的 size 参数返回 400 Bad Request
- [ ] **AC-13**：Provider 异常时返回 502 Bad Gateway，带错误描述

### 质量门禁

- [ ] **AC-14**：所有 P0 需求已完成
- [ ] **AC-15**：Code Review 已通过
- [ ] **AC-16**：QA 功能测试已通过
- [ ] **AC-17**：数据库迁移已完成

---

## 16. Open Questions

| # | 问题 | 提出者 | 状态 | 结论 |
|---|------|--------|------|------|
| 1 | 图片生成返回的图片 URL 是否需要经过 Gateway 代理转发？还是直接返回 Provider 原始 URL？ | Architect | 待讨论 | — |
| 2 | 对于不支持 `n` 参数（一次生成多张）的 Provider，是否在适配层模拟？ | Backend Engineer | 待讨论 | — |
| 3 | 图片生成是否支持流式响应（SSE）？还是仅支持同步请求？ | Product Manager | 待讨论 | MVP 阶段仅支持同步请求 |
| 4 | 是否需要对图片生成做内容安全审核（如 NSFW 检测）？ | CEO | 待讨论 | MVP 阶段暂不做，后续迭代评估 |

---

## 17. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-28 | v1.0 | 初始版本 | Product Manager |

---

# End
