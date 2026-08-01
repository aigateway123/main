# ADR-009: 图片生成模型的计费方案设计

Version: v1.0

Status: Accepted

Owner: Architect

Last Updated: 2026-07-28

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| ADR ID | ADR-009 |
| Title | 图片生成模型的计费方案设计 |
| Version | v1.0 |
| Status | Accepted |
| Owner | Architect |
| Related PRD | PRD-20260728-ImageGen |
| Related Architecture | ARCH-20260728-ImageGen |
| Created | 2026-07-28 |
| Last Updated | 2026-07-28 |

---

## 2. Context

### 业务背景

Nova AI Gateway 当前计费体系完全围绕 Token 设计：所有 Chat 模型按输入 Token 和输出 Token 数量计费，`ModelPricing` 实体的核心字段为 `price_per_input_token` 和 `price_per_output_token`。

图片生成模型的计费模式完全不同——供应商按"每张图片"收费，而非按 Token。例如 GLM-Image 定价为 0.1 元/张、wan2.7-image-pro 为 0.08 元/张。此外，同一模型在不同分辨率下单价也不同（如 512x512 与 1024x1024 价格不同）。

### 技术背景

现有 `model_pricing` 表结构：

```go
type ModelPricing struct {
    ModelID              int64
    PricingType          string  // "flat" / "time_based"
    PricePerInputToken   float64
    PricePerOutputToken  float64
    // 峰谷定价字段...
}
```

该结构完全无法表达按张数计费的场景，也无法表达"不同分辨率不同价格"的阶梯定价。

当前还处于 P1 阶段，单服务（monolith）部署，所有模块在一个 binary 中。计费逻辑在 BillingService 中实现。

---

## 3. Problem

**现有计费模型仅支持 Token 计费，无法满足图片生成模型按张数/按分辨率计费的需求。**

### 问题描述

| 需求 | 现有能力 | 差距 |
|------|---------|------|
| 按张数计费 | ❌ 仅支持 Token 计费 | 需要引入新的用量单位 |
| 不同分辨率不同价格 | ❌ 不支持 | 需要支持按分辨率定价 |
| 与非 Image 模型共用定价表 | ❌ 价格字段完全不兼容 | 需设计通用方案 |

### 问题影响

| 影响方面 | 说明 |
|---------|------|
| 功能 | 无法为图片生成模型设置定价，导致无法计费 |
| 性能 | 计费逻辑需要在请求处理链中判断 pricing_unit，增加分支 |
| 成本 | 如果实现不当，可能导致多表查询，增加数据库开销 |
| 开发效率 | 方案扩展性差会导致每次新模型类型都要改计费逻辑 |

---

## 4. Constraints

| # | 约束 | 类型 | 说明 |
|---|------|------|------|
| 1 | 向后兼容：已有 Chat 模型定价数据完全不受影响 | 业务 | 不可修改已有定价数据的存储结构 |
| 2 | 单表查询：计费尽可能在单表内完成，避免跨表 JOIN | 技术 | 99% 请求不访问 DB，但计费写操作涉及 |
| 3 | 扩展性：未来 video/audio/embedding 类型接入时，定价方案应可直接复用 | 技术 | 避免为每个模型类型建独立定价表 |
| 4 | MVP 原则：改动最小化，不做过度设计 | 技术 | 当前只接入 3 个图片模型，不设计过于复杂的规则引擎 |

### 不可妥协的约束

- **向后兼容**：已有 Chat 模型的定价数据、计费逻辑完全不变
- **单服务部署**：P1 阶段不拆独立计费服务

### 可协商的约束

- JSON 字段可读性略差（可以在 Admin 后台做 UI 层面展示）
- 不要求所有定价规则都在数据库层面可查询（部分逻辑可在代码中处理）

---

## 5. Options

| # | 方案名称 | 描述 | 优点 | 缺点 | 可行性 |
|---|---------|------|------|------|:------:|
| A | **扩展 model_pricing 添加 pricing_unit** | 在现有 `model_pricing` 表新增 `pricing_unit`（enum）、`unit_price`（DECIMAL）字段。`pricing_unit='token'` 时走现有逻辑，`pricing_unit='image_count'` 时按 `unit_price × 张数` 计费。尺寸差价在 `unit_price` 中通过 JSONB 或阶梯规则表达 | ✅ 改动最小 ✅ 向后兼容 ✅ 单表查询 ✅ 所有模型类型共用 | ❌ pricing_unit 与 price_per_input_token 等字段共存，语义略混乱 | 高 |
| B | **新建 image_pricing 独立表** | 创建新表 `image_pricing(model_id, unit_price, resolution_prices JSONB, ...)`，图片模型用新表，Chat 模型用旧表。计费时根据 model_type 决定查哪个表 | ✅ 数据结构清晰 ✅ 互不干扰 | ❌ 多表查询 ❌ 跨类型统计复杂 ❌ 每新增模型类型都要建新表 | 中 |
| C | **统一使用 JSONB 存定价规则** | 将整个 `model_pricing` 表重构为单一 JSONB 字段，Token 模型和 Image 模型都用 JSON 表达定价规则。代码中解析 JSON 确定计费逻辑 | ✅ 最大灵活性 ✅ 真正"通用" | ❌ 丧失数据库约束 ❌ JSON 校验复杂 ❌ 查询/统计困难 ❌ 改动最大 | 低 |

---

## 6. Decision

**决策**：选择方案 A —— 扩展 model_pricing 添加 pricing_unit 和 unit_price 字段

**决策日期**：2026-07-28

**决策人**：Architect

---

## 7. Why

### 决定性因素

| 因素 | 方案 A | 方案 B | 方案 C | 说明 |
|------|:------:|:------:|:------:|------|
| 向后兼容 | ✅ | ✅ | ❌ | 方案 C 重构整个表，破坏兼容性 |
| 改动量 | 小 | 中 | 大 | A 仅加 2 个字段 |
| 扩展性 | 高 | 低 | 高 | A + C 可覆盖 future 类型，B 需反复建表 |
| 数据可读性 | 中 | 高 | 低 | A 的字段混排可读性低于 B，但优于 C |
| 开发成本 | 低 | 中 | 高 | A 约 0.5 天，B 约 1 天，C 约 2 天 |

### 与约束的匹配

| 约束 | 满足情况 | 说明 |
|------|:---------:|------|
| 向后兼容 | ✅ | 已有数据 `pricing_unit` 默认 `token`，`unit_price` 为 NULL，旧代码完全不受影响 |
| 单表查询 | ✅ | 所有定价在同一个表中，无需跨表 JOIN |
| 扩展性 | ✅ | `pricing_unit` 枚举可扩展 `video_length`、`audio_second` 等 |
| MVP 原则 | ✅ | 仅加 2 个字段，代码改动最小 |

---

## 8. Tradeoffs

### 接受的代价

| 代价 | 影响 | 接受理由 |
|------|------|---------|
| pricing_unit='image_count' 时，price_per_input_token 和 price_per_output_token 字段空置 | 表中会出现"行列混排"，某些行只使用部分字段 | 可读性下降但功能正确；Admin 后台 UI 根据 pricing_unit 展示对应的价格字段 |
| 分辨率差价（512x512 vs 1024x1024）需要在 unit_price 中额外约定格式 | 没有数据库级别的约束，依赖代码解析 | MVP 阶段只有 3 个模型，分辨率定价可通过 JSONB 表达或简单的阶梯逻辑处理 |

### 放弃的优势

- **方案 B 的清晰数据模型**：独立表的数据结构最清晰，但也意味着每增加一个模型品类就要新建一张表，长期维护成本高
- **方案 C 的最大灵活性**：全部 JSONB 看起来灵活，但失去了数据库的类型约束、索引效率和可查询性

---

## 9. Consequences

### 正面后果

- 所有 future 的非 Chat 模型类型（video、audio、embedding）都可以直接复用这套机制，只需新增 `pricing_unit` 枚举值
- 计费 Service 核心逻辑只需增加一个分支判断（switch pricing_unit），扩展点清晰
- 数据库迁移成本低，无需新建表或迁移现有数据
- Admin 后台定价页只需根据 `pricing_unit` 动态展示不同的价格输入控件

### 负面后果

- `model_pricing` 表的字段语义不再是纯 Token 计费，需要代码和文档保证正确理解
- `unit_price` 字段在不同 `pricing_unit` 下的含义不同，需要在 API 文档中明确标注

### 迁移方案

1. 执行数据库迁移，为 `model_pricing` 表增加 `pricing_unit`（VARCHAR(32) DEFAULT 'token'）和 `unit_price`（DECIMAL(12,6) NULL）
2. 已有 Chat 模型数据的 `pricing_unit` 自动设为 `token`，`unit_price` 设为 NULL
3. 计费代码中增加分支：

```go
func (s *BillingService) CalculateCost(ctx context.Context, pricing *ModelPricing, usage *Usage) (float64, error) {
    switch pricing.PricingUnit {
    case "token":
        // 现有逻辑：按 Token 计费
        return pricing.PricePerInputToken*float64(usage.InputTokens) +
               pricing.PricePerOutputToken*float64(usage.OutputTokens), nil
    case "image_count":
        // 新增逻辑：按张数计费
        return pricing.UnitPrice * float64(usage.ImageCount), nil
    default:
        return 0, fmt.Errorf("unsupported pricing unit: %s", pricing.PricingUnit)
    }
}
```

---

## 10. Risks

| # | 风险描述 | 等级 | 可能性 | 影响 | 缓解方案 |
|---|---------|:----:|:------:|:----:|---------|
| 1 | pricing_unit 枚举值膨胀导致分支逻辑复杂 | 低 | 低 | 可维护性下降 | 按 model_type 归类，每个大类对应一种计费模式 |
| 2 | unit_price 字段含义不明确导致计费错误 | 中 | 中 | 计费偏差 | 在 Admin 后台 UI 中根据 pricing_unit 明确标注单位；API 文档中详细说明 |
| 3 | 分辨率阶梯定价需要扩展 unit_price 格式 | 低 | 中 | 扩展兼容性 | MVP 阶段使用简单约定（如 JSON），后续可提取为独立定价规则表 |

---

## 11. Alternatives

| 方案 | 未选原因 | 未来可行性 |
|------|---------|:----------:|
| 方案 B（独立定价表） | 每新增模型类型需建新表，维护成本高，查询复杂度增加 | 低——与"通用平台"方向矛盾 |
| 方案 C（全部 JSONB） | 丧失数据库类型约束，查询统计困难，改动太大 | 中——如果定价规则复杂到无法用字段表达，可作为 future 考虑 |

---

## 12. References

| 参考 | 类型 | 说明 |
|------|------|------|
| PRD-20260728-ImageGen | PRD | 图片生成模型 PRD，FR-4 定义定价需求 |
| ARCH-20260728-ImageGen | Architecture | 图片生成架构设计文档 |
| ADR-20260725-Billing-Design | ADR | 现有计费体系的设计决策 |

---

## 13. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-07-28 | v1.0 | 初始版本 | Architect |

---

# End

本模板依据 AI Company Document Standard 和 Decision Standard 设计。

所有 ADR 必须基于此模板创建。
