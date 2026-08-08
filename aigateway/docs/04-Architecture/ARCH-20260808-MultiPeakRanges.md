# Architecture: 峰谷计价支持一天内多个高峰时段

Version: v1.1

Status: Final

Owner: Architect

Last Updated: 2026-08-08

Related ADR: ADR-007-billing-and-quota、ADR-20260725-Billing-Design

---

## 1. Metadata

| 字段 | 值 |
|------|-----|
| Architecture ID | ARCH-20260808-MultiPeakRanges |
| Version | v1.1 |
| Status | Final |
| Owner | Architect |
| Related ADR | ADR-007-billing-and-quota、ADR-20260725-Billing-Design |
| Created | 2026-08-08 |
| Last Updated | 2026-08-08 |

---

## 2. Overview

当前峰谷计价（`pricing_type = 'time_based'`）仅支持**单一连续高峰时段**：`model_pricing` 表通过 `peak_start` / `peak_end` 一组 TIME 字段描述高峰时段，`BillingService.ComputeCost` 单时段判断命中则计高峰价，否则计低谷价。业务上 DeepSeek 等厂商定价为**一天多个高峰时段**（如北京时间每日 09:00-12:00 与 14:00-18:00 两个高峰），当前数据模型无法表达。

本设计将高峰时段升级为**有序多组（每组 start/end，可增删、可排序）**，计费时调用时间落在**任意**高峰时段内即使用高峰价，否则使用低谷价。高峰价/低谷价仍各为一组（所有高峰时段共用同一组高峰价格），不引入按时段差异化价格。

设计核心思路：**最小改动、向后兼容、数据可迁移**。推荐方案为**新增子表 `model_pricing_time_ranges`**（方案 A），主表保留旧字段仅作兼容，权威数据源迁移至子表；计费逻辑将单时段判断函数扩展为多时段"任意命中"。

### 适用范围

- 涉及的模块：PricingService（扩展）、BillingService（扩展）、ModelPricingRepository（扩展）、ModelPricing Entity/DTO（扩展）、迁移脚本（新增）、Admin 定价页（前端扩展）
- 涉及的服务：API Gateway（`backend/internal/`，monolith 部署，与前端同仓 `admin/`）
- 涉及的技术栈：Go 1.22+、PostgreSQL 15+、Vue3 + TypeScript

---

## 3. Business Context

### 需求描述

1. **Admin 定价编辑**：分时段定价可配置**多组高峰时段**（每组 start/end，可增删、可排序）。
2. **计费规则**：调用时间落在**任意**高峰时段内 → 用高峰价（`peak_price_per_input/output`）；否则用低谷价（`offpeak_price_per_input/output`）。
3. **价格结构不变**：高峰价/低谷价仍各为一组（不按时段区分价格），所有高峰时段共用同一组高峰价格。

### 业务案例

DeepSeek 定价：每日北京时间 09:00-12:00 与 14:00-18:00 为高峰，其余时间为低谷。

```
┌───────────────────────────────────────────────────────────────┐
│  00:00            09:00    12:00    14:00    18:00       24:00 │
│  ├────────────────┤████████┤────────┤████████┤──────────────┤ │
│  │     低谷       │  高峰   │  低谷  │  高峰  │     低谷     │ │
│  └────────────────┴────────┴────────┴────────┴──────────────┘ │
│                    时段1          时段2（可继续添加）           │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Goals

### 架构目标

- **G1**: `model_pricing` 支持一天内多组高峰时段，Admin 可增删、排序
- **G2**: 计费时任意高峰时段命中即用高峰价，否则用低谷价；高峰/低谷价格仍为一组
- **G3**: 已有生产数据零丢失迁移（存量单时段 → 子表一组记录），计费行为不变
- **G4**: 对外 API 向后兼容：旧前端仅传 `peakStart/peakEnd` 仍可工作；响应保留旧字段
- **G5**: 计费主链路性能不受影响（多时段判断为内存遍历，< 0.1ms）

### 架构原则

- **向后兼容**：数据库不删列、API 保留旧字段、存量数据自动迁移
- **MVP First**：不做按时段差异化价格、不做复杂时段冲突算法、不做前端拖拽排序（用上移/下移）
- **改动最小化**：复用现有 `isWithinTimeRange` 单时段判断，外层包一层"任意命中"遍历

### 非目标

- 按时段差异化价格（每个高峰时段各自价格）——列为未来扩展点
- 时区配置（时段按请求时间所在时区解释，维持现状，见 §10）
- 定价缓存层改造（现有代码未实现定价缓存，见 §10 缓存一致性）
- 非 `token` / `per_million_tokens` 计费单元的多时段支持（仅 token 类有峰谷概念）

---

## 5. 方案对比与选择

### 方案描述

| 方案 | 描述 |
|------|------|
| **A. 新增子表** | 新建 `model_pricing_time_ranges(pricing_id, peak_start, peak_end, sort_order)`，主表保留旧列仅兼容；权威数据源为子表 |
| **B. 主表 JSONB** | 主表新增 `peak_ranges JSONB` 存储 `[{start, end}]` 数组，主表保留旧列仅兼容 |
| **C. 主表扩展多列** | 主表新增固定列 `peak_start_1/peak_end_1 … peak_start_N/peak_end_N`（如 N=4） |

### 评估矩阵

| 维度 | A. 子表 | B. JSONB | C. 固定多列 |
|------|:-------:|:--------:|:-----------:|
| 向后兼容 | ✅ 旧列保留；迁移 `INSERT SELECT` 一次完成 | ✅ 旧列保留；`UPDATE` 回填 JSON | ✅ 旧列保留；`UPDATE` 回填新列 |
| 数据可读性 / 查询 | ✅ SQL 直接 `SELECT … ORDER BY sort_order`，类型安全（TIME + 约束） | ⚠️ 需 `jsonb_array_elements` 或 Go 侧解析，无 schema 约束 | ✅ 列即时段，直观 |
| 实现成本 | 中（新表 + Upsert 事务级联写子表） | 低（单字段序列化，无级联） | 低（单表，但列爆炸） |
| 扩展性 | ✅ 高：未来"按时段差异化价格"只需给子表加 price 列；支持任意组数 | ⚠️ 中：未来扩展需改 JSONB schema，破坏性迁移 | ❌ 低：组数固定，超限需再迁移 |
| 性能（计费主链路 <5ms） | 缓存命中零额外成本；缓存 miss 多一次子表查询（~1-2ms，可接受） | 单表零 JOIN，最快 | 单表零 JOIN，最快 |
| 数据一致性 | ✅ DB 层 TIME 类型 + 应用层校验；级联删除（ON DELETE CASCADE） | ⚠️ JSONB 无类型约束，非法结构只能靠应用层 | ✅ 列级类型安全，但空列冗余 |

### 推荐：方案 A（新增子表 `model_pricing_time_ranges`）

**决策理由**：

1. **数据层类型安全**：子表用 `TIME NOT NULL` 列，时段校验有数据库兜底；JSONB（方案 B）无 schema 约束，非法 JSON/缺失字段只能靠应用层，风险与当前单列方案差异大。
2. **可排序**：`sort_order` 列天然支持"可排序"需求（增删 + 上移/下移），SQL `ORDER BY sort_order` 直接获得有序数据；JSONB 数组序靠数组元素序，插入/删除中间元素成本高。
3. **扩展性最好**：未来若业务要求"不同高峰时段不同价格"（当前明确为非目标），方案 A 仅需 `ALTER TABLE … ADD COLUMN price`，零破坏；方案 B 需重构 JSONB 结构（破坏性迁移），方案 C 需加列且列数受限。
4. **迁移与回滚最干净**：`INSERT … SELECT` 一次性完成存量迁移；down 迁移可回写第一组时段后 DROP 子表，近似还原。
5. **性能可接受**：计费主链路依赖定价缓存（架构文档既有设计 `pricing:model:{modelID}`，TTL 5min，写后 DEL）；缓存命中时子表数据作为内存对象随定价一起缓存，多时段判断是 O(n) 内存遍历（n 通常 1~4），< 0.1ms；缓存 miss 时 List/Get 多一次子表查询（~1-2ms），远低于 <5ms 目标。Admin 读列表为低频操作，JOIN/二次查询无感知。

**代价（接受理由）**：相比方案 B 多一张表与 Upsert 事务级联（delete + insert），实现成本略增；相比单表时代多一次子表查询。均在接受范围内。

> 说明：ADR-20260725-Billing-Design 当时选择"单表零 JOIN"是针对**单组时段**的最优解；多组时段出现后，规范化子表（方案 A）反而比"单表 + JSONB"更简单、更可控，本设计为对该 ADR 的增量修订，不推翻其结论。

---

## 6. 数据库迁移设计

### 迁移文件

- 现有最大迁移编号：`202608020010`（`add_model_is_public`）
- 新迁移编号：**`202608080011`**
- 文件：`backend/migrations/202608080011_multi_peak_ranges.up.sql` / `202608080011_multi_peak_ranges.down.sql`
- 执行机制：`backend/internal/database/migrator.go` 按文件名排序启动时自动执行未应用迁移（仅执行 `*.up.sql`），无需手动介入

### up 迁移

```sql
-- Migration 011: Multi peak time ranges for time-based pricing.
-- 将高峰时段从 model_pricing 的单组列迁移为可多组的有序子表。

BEGIN;

-- 1. 建子表：pricing_id 关联 model_pricing.id，级联删除
CREATE TABLE IF NOT EXISTS model_pricing_time_ranges (
    id BIGSERIAL PRIMARY KEY,
    pricing_id BIGINT NOT NULL REFERENCES model_pricing(id) ON DELETE CASCADE,
    peak_start TIME NOT NULL,
    peak_end TIME NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (pricing_id, sort_order)
);

CREATE INDEX IF NOT EXISTS idx_mpr_pricing_id ON model_pricing_time_ranges(pricing_id);

-- 2. 存量数据迁移：已有单时段的行转为一组记录（sort_order = 0）
--    仅迁移 pricing_type = 'time_based' 且 peak_start 与 peak_end 均非 NULL 的行
--    （其他定价类型无峰谷概念，不迁移；缺任一端的行原计费即按 flat 价处理，不迁移）
INSERT INTO model_pricing_time_ranges (pricing_id, peak_start, peak_end, sort_order)
SELECT id, peak_start, peak_end, 0
FROM model_pricing
WHERE peak_start IS NOT NULL AND peak_end IS NOT NULL
  AND pricing_type = 'time_based';

COMMIT;
```

**迁移规则说明**：

- 主表 `peak_start/peak_end` 列**保留不删**（不破坏性变更，且为 down 回滚提供基础）；存量数据原值保留。
- 存量 `peak_start = peak_end` 的行（现有 `isWithinTimeRange` 语义：全天高峰）**照常迁移、不丢弃、不合并**，保持升级前后计费逐请求等价（属既有行为，M1 决策；§10.2 的 `start >= end` 校验仅作用于新增/编辑保存，不回溯存量，仅存量保留该语义）。
- 迁移后**新写入路径**以子表为权威源，主表旧列置 NULL（见 §7）。
- 注意：`ON CONFLICT (pricing_id, sort_order)` 依赖应用层"先删后插"的写模式（§7），迁移本身无冲突。

### down 迁移

```sql
-- Migration 011 rollback: 将子表数据回写主表后删除子表

BEGIN;

-- 回写每组最小 sort_order 的时段到主表（近似还原单时段语义）
UPDATE model_pricing mp
SET peak_start = r.peak_start,
    peak_end = r.peak_end
FROM (
    SELECT DISTINCT ON (pricing_id) pricing_id, peak_start, peak_end
    FROM model_pricing_time_ranges
    ORDER BY pricing_id, sort_order
) r
WHERE mp.id = r.pricing_id;

DROP TABLE IF EXISTS model_pricing_time_ranges;

COMMIT;
```

> 风险说明：若回滚发生在"已按多时段写入新数据"之后，主表旧列已被置 NULL，down 回写只能恢复第一组时段，**多组时段数据将丢失**（DROP 子表）。生产回滚须以备份为准，见 §10 风险表。

> **执行前检查（m3）**：down 迁移执行前，必须先行统计子表中存在 **>1 组** 记录的 pricing 并**告警/要求人工确认**（确认已备份或接受多时段数据丢失）后再执行：
> ```sql
> SELECT pricing_id, COUNT(*) AS range_cnt
> FROM model_pricing_time_ranges
> GROUP BY pricing_id
> HAVING COUNT(*) > 1;
> ```

---

## 7. API / DTO / 实体变更

### 7.1 实体（`backend/internal/entity/model_pricing.go`）

```go
// TimeRange 高峰时段（"HH:MM" 或 "HH:MM:SS"；新写入要求 start < end（§10.2/M1），
// 存量已迁移数据可能含 start == end / start > end，按既有语义计费）
type TimeRange struct {
    Start string `json:"start"`
    End   string `json:"end"`
}

type ModelPricing struct {
    // ... 现有字段保持不变 ...
    PeakStart  *string     `json:"peakStart"`  // 保留，仅读兼容（新写入为 NULL）
    PeakEnd    *string     `json:"peakEnd"`    // 保留，仅读兼容（新写入为 NULL）
    PeakRanges []TimeRange `json:"peakRanges"` // 新增：有序多组高峰时段（权威数据源）
    // ...
}
```

### 7.2 DTO（`backend/internal/dto/admin_pricing.go`）

```go
// TimeRangeDTO 与 entity.TimeRange 同构，供 Admin API 使用
type TimeRangeDTO struct {
    Start string `json:"start"`
    End   string `json:"end"`
}

type AdminPricingItem struct {
    // ... 现有字段保持不变 ...
    PeakStart  *string       `json:"peakStart"`  // 保留：由 PeakRanges[0] 派生，兼容旧前端
    PeakEnd    *string       `json:"peakEnd"`    // 保留：同上
    PeakRanges []TimeRangeDTO `json:"peakRanges"` // 新增
    // ...
}

type AdminUpdatePricingRequest struct {
    // ... 现有字段保持不变 ...
    PeakStart  *string       `json:"peakStart"`  // 保留：兼容旧调用方（见 7.3 决策）
    PeakEnd    *string       `json:"peakEnd"`    // 保留：同上
    PeakRanges []TimeRangeDTO `json:"peakRanges"` // 新增：优先使用
    // ...
}
```

请求 JSON 示例（DeepSeek 双高峰）：

```json
{
  "pricingType": "time_based",
  "pricingUnit": "token",
  "currency": "USD",
  "peakRanges": [
    { "start": "09:00", "end": "12:00" },
    { "start": "14:00", "end": "18:00" }
  ],
  "peakPricePerInputToken": 0.000002,
  "peakPricePerOutputToken": 0.000008,
  "offPeakPricePerInputToken": 0.000001,
  "offPeakPricePerOutputToken": 0.000004,
  "pricingStatus": "active"
}
```

响应 JSON（`AdminPricingItem`）：

```json
{
  "modelId": 1,
  "pricingType": "time_based",
  "peakRanges": [
    { "start": "09:00", "end": "12:00" },
    { "start": "14:00", "end": "18:00" }
  ],
  "peakStart": "09:00",
  "peakEnd": "12:00",
  "peakPricePerInputToken": 0.000002,
  "peakPricePerOutputToken": 0.000008,
  "offPeakPricePerInputToken": 0.000001,
  "offPeakPricePerOutputToken": 0.000004
}
```

### 7.3 旧字段 `peakStart/peakEnd` 去留决策

**决策：保留旧字段仅用于兼容，权威数据源为 `peakRanges`，并标注 deprecated。**

| 方向 | 处理 |
|------|------|
| 响应（AdminPricingItem） | `peakStart/peakEnd` 由服务层从 `PeakRanges[0]` **派生填充**（无时段则为 NULL），保证旧前端列表/弹窗仍能展示 |
| 请求（AdminUpdatePricingRequest） | 若请求体**含 `peakRanges`（非空数组）** → 以其为准，忽略旧字段；若请求体**不含 `peakRanges`** 且旧字段 `peakStart/peakEnd` **trim 后为非空串** → **兼容转换为单组 ranges**（旧前端/脚本不感知升级）；旧字段为空串/纯空白 → 视为未传时段，不生成 range；两者皆无 → 无高峰时段（0 组） |
| 数据库 | 主表 `peak_start/peak_end` 列保留，新写入统一置 NULL |

**理由**：生产环境已上线，可能存在未升级的旧前端实例与外部脚本；保留旧字段可灰度发布、随时回滚。代价是响应多两个冗余字段（派生值），成本可忽略。计划在后续主版本（旧前端全部升级后）移除，本迭代不删。

**兼容转换判空规则（M3 决策）**：① 旧字段 `peakStart/peakEnd` 仅在 **trim 后为非空串** 时才参与兼容转换，空串/纯空白视为未传时段，不生成 range；② **仅当请求体不含 `peakRanges`** 时才走旧字段兼容转换，避免新旧字段混用导致歧义。

### 7.4 Repository 接口

`backend/internal/repository/model_pricing_repository.go` 中 `ModelPricingRepository` 接口**签名不变**（`List / GetByModelID / Upsert`），`InMemoryModelPricingRepository`（测试用）同步支持 `PeakRanges` 字段即可。

`backend/internal/repository/model_pricing_repo_pg.go` 变更：

- **List / GetByModelID**：扫描主表后，按 `pricing_id` 批量查询子表：
  ```sql
  SELECT pricing_id, to_char(peak_start, 'HH24:MI:SS'), to_char(peak_end, 'HH24:MI:SS')
  FROM model_pricing_time_ranges
  WHERE pricing_id = ANY($1)          -- List：批量；GetByModelID：pricing_id = $1
  ORDER BY pricing_id, sort_order
  ```
  在 Go 侧按 `pricing_id` 聚合为 `PeakRanges`（保持 `HH24:MI:SS` 输出格式，与现有单字段一致，计费解析零改动）。
- **Upsert（M2 决策）**：改为**事务**（pgx tx）：① 主表 `INSERT … ON CONFLICT (model_id) DO UPDATE`（`peak_start/peak_end` 传 NULL）`RETURNING id`；② `DELETE FROM model_pricing_time_ranges WHERE pricing_id = $1`；③ 按 `PeakRanges` 顺序逐条 `INSERT (pricing_id, peak_start, peak_end, sort_order)`，`sort_order = 下标`；④ **事务内重新 `SELECT` 子表**（`ORDER BY sort_order`）组装 `PeakRanges` 填充返回 entity，保证 `UpdateByModelID` 的响应与落库状态**原子一致**。事务提交，级联一致，响应无失真。
  - **备选方案（仅当事务内组装复杂时启用）**：事务提交后调用 `GetByModelID` 重新加载并返回。取舍：多一次 DB 往返（响应时延略增）；且必须以**提交后的重新加载结果**组装响应，禁止用事务前旧数据组装（否则响应失真——返回旧时段、库里已是新时段）。当前实现优先采用**事务内重载**。

---

## 8. 计费逻辑变更

文件：`backend/internal/service/billing_service.go`

### 8.1 新增多时段判断（复用现有单时段函数）

现有 `isWithinTimeRange(t, start, end)`（296-315 行）已支持：正常时段、跨午夜（`start > end`）、全天（`start == end`），**保持不变**——其跨午夜/全天分支仅由**存量已迁移数据**（历史 `start == end` / `start > end` 单组时段，按既有语义计费，升级前后逐请求等价）与**旧单字段兼容回退路径**触发；**新增/编辑保存的时段经 §10.2 校验保证 `start < end`**，多时段路径只走正常分支（M1）。外层新增：

```go
// isWithinAnyTimeRange：命中任意高峰时段即返回 true
func isWithinAnyTimeRange(t time.Time, ranges []entity.TimeRange) bool {
    for _, r := range ranges {
        if isWithinTimeRange(t, r.Start, r.End) {
            return true
        }
    }
    return false
}
```

### 8.2 ComputeCost 取价逻辑（116-126 行分支改造）

```go
inputPrice := p.PricePerInputToken
outputPrice := p.PricePerOutputToken

if p.PricingType == "time_based" {
    hasPeakOffpeakPrices := p.PeakPricePerInput != nil && p.PeakPricePerOutput != nil &&
        p.OffpeakPricePerInput != nil && p.OffpeakPricePerOutput != nil
    if hasPeakOffpeakPrices {
        if len(p.PeakRanges) > 0 {
            // 新路径：多时段，任意命中 → 高峰价
            if isWithinAnyTimeRange(at, p.PeakRanges) {
                inputPrice = *p.PeakPricePerInput
                outputPrice = *p.PeakPricePerOutput
            } else {
                inputPrice = *p.OffpeakPricePerInput
                outputPrice = *p.OffpeakPricePerOutput
            }
        } else if p.PeakStart != nil && p.PeakEnd != nil {
            // 兼容回退：子表数据缺失时使用旧单字段（迁移已完成，正常情况下不会走到）
            if isWithinTimeRange(at, *p.PeakStart, *p.PeakEnd) {
                inputPrice = *p.PeakPricePerInput
                outputPrice = *p.PeakPricePerOutput
            } else {
                inputPrice = *p.OffpeakPricePerInput
                outputPrice = *p.OffpeakPricePerOutput
            }
        } else {
            // M1 决策：0 组高峰时段 = 全天低谷价（删除全部时段后仍属 time_based，按低谷价计费）
            inputPrice = *p.OffpeakPricePerInput
            outputPrice = *p.OffpeakPricePerOutput
        }
    }
    // 未配置峰/谷价格（hasPeakOffpeakPrices = false）：维持现状走 flat 价 PricePerInputToken
}
```

要点：

- 判断**顺序**为遍历 `PeakRanges`，n 通常 1~4，命中即短路，最坏 O(n)。
- 解析格式沿用 `"15:04:05"`（repo 输出 `to_char 'HH24:MI:SS'`），`isWithinTimeRange` 内部 `time.ParseInLocation` 失败返回 false（现有行为），多时段下不会因单组格式异常影响整体计费正确性（该组被跳过）。
- 计费语义变化共两处（均为 M1 决策）：① 单时段判断 → 多时段"任意命中"，命中/未命中价格与价格字段映射完全不变，存量含时段数据迁移后计费结果与升级前**逐请求一致**；② time_based 且已配置峰/谷价格、**0 组时段**时，由旧行为"无时段走 flat 价"统一为**全天低谷价**。该场景存量极罕见（旧 UI 的 time_based 默认填充时段，如 08:00-23:00），影响面可忽略；如需 flat 语义可改用 `pricing_type = 'flat'`。

### 8.3 PricingService 变更（`backend/internal/service/pricing_service.go`）

- `UpdateByModelID`：请求 `PeakRanges` → 校验（§10.2，含 `start < end` 强制校验）→ 组装 `entity.TimeRange`；**仅当请求体不含 `peakRanges`** 且旧字段 `peakStart/peakEnd` **trim 后为非空串**时，才兼容转换为单组 ranges（空串/纯空白视为未传时段，§7.3/M3）；0 组（含前端删除全部时段）→ `PeakRanges` 为空数组。组装后的 entity 中 `PeakStart/PeakEnd` 置 nil（写入主表为 NULL）。
- `UpdateByModelID` 返回的响应由 **Upsert 事务内重新加载**的完整 entity（含 `PeakRanges`）组装，保证响应与落库一致（§7.4/M2）。
- 定价状态判定（93-103 行，配置了峰/谷任一价格即 active）**逻辑不变**——多时段不影响 active 判定。
- `toAdminPricingItem`：填充 `PeakRanges`；派生 `PeakStart/PeakEnd = PeakRanges[0]`（存在时）。

---

## 9. 前端交互设计

文件：`admin/src/pages/pricing/pricing-page.vue`、`admin/src/api/pricing.ts`

### 9.1 类型（`admin/src/api/pricing.ts`）

```ts
export interface TimeRange {
  start: string // "HH:MM"
  end: string   // "HH:MM"
}

export interface PricingResponse {
  // ... 现有字段 ...
  peakStart?: string
  peakEnd?: string
  peakRanges?: TimeRange[]  // 新增
  // ...
}

export interface UpdatePricingRequest {
  // ... 现有字段 ...
  peakRanges?: TimeRange[]  // 新增；旧字段 peakStart/peakEnd 不再提交
  // ...
}
```

### 9.2 编辑弹窗（`pricing-page.vue`）

**状态**（`editForm`）：

```ts
peakRanges: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] as TimeRange[]
```

**`openEdit` 解析**（兼容新旧数据）：

```ts
const ranges = item.peakRanges?.length
  ? item.peakRanges.map(r => ({ start: r.start.slice(0, 5), end: r.end.slice(0, 5) }))
  : (item.peakStart && item.peakEnd
      ? [{ start: item.peakStart.slice(0, 5), end: item.peakEnd.slice(0, 5) }]  // 旧数据兜底
      : [{ start: '09:00', end: '12:00' }])                                    // 默认一组
editForm.value.peakRanges = ranges

// M1：存量 start === end 的 range（旧语义 = 全天高峰）不允许直接保存，
// 弹窗内提示先修改为有效时段
if (ranges.some(r => r.start === r.end)) {
  alert('检测到存量"全天高峰"时段（开始 = 结束）：该时段为全天高峰，请先修改为有效时段再保存')
}
```

**模板**（分时段区块，替换现有"高峰开始/高峰结束"两个输入框）：

- 每组：`<input type="time" v-model="r.start">` + `<input type="time" v-model="r.end">` + 删除按钮（**始终可用，允许删除至 0 组**；0 组时显示提示"未配置高峰时段，全天按低谷价计费"，M1）
- 每组操作：上移 / 下移按钮（`swap(index, index±1)`，用于排序，MVP 不做拖拽）
- 底部："+ 添加高峰时段"按钮，组数上限 **8 组**（超过禁用并提示）
- 客户端即时校验提示：`start >= end` 时提示"高峰时段的开始时间必须早于结束时间"（与后端 400 校验一致，M1）

**`handleSave` 提交**：

```ts
if (editForm.value.pricingType === 'time_based') {
  const ranges = editForm.value.peakRanges.filter(r => r.start && r.end)
  // M1：start >= end 拒绝（与后端 400 同步校验）
  if (ranges.some(r => r.start >= r.end)) throw/alert('高峰时段的开始时间必须早于结束时间')
  data.peakRanges = ranges          // 允许为空数组（0 组 = 全天低谷价）；不再传 peakStart / peakEnd
  data.peakPricePerInputToken = ...
  data.peakPricePerOutputToken = ...
  data.offPeakPricePerInputToken = ...
  data.offPeakPricePerOutputToken = ...
}
```

### 9.3 列表页展示适配

"价格详情"列的 time_based 分支，在高峰/低谷价格行下方增加高峰时段展示：

```html
<div class="text-[10px] text-text-secondary">
  高峰时段: {{ formatRanges(item.peakRanges, item.peakStart, item.peakEnd) }}
</div>
<!-- formatRanges: peakRanges?.length ? ranges.map(r => `${r.start}-${r.end}`).join(', ')
                 : (peakStart && peakEnd ? `${peakStart}-${peakEnd}` : '未配置（全天低谷价）') -->
```

---

## 10. 边界与风险

### 10.1 跨午夜时段

- **新增/编辑保存时 `start >= end` 一律拒绝（400，M1 决策）**：时段必须满足 `start < end`，从录入端消除 `start == end`（旧语义"全天高峰"）与 `start > end`（跨午夜）的歧义。
- **跨午夜需求以两组时段表达**：如 22:00-23:59 + 00:00-02:00（如需精确覆盖至午夜，end 可用 `23:59:59` 秒粒度），不再依赖单组 `start > end`。
- `isWithinTimeRange` 现有的跨午夜（`sd.After(ed)`）与全天（`sd.Equal(ed)`）分支**保留不改**：仅用于**存量已迁移数据**（历史 `start == end` / `start > end` 单组时段仍按既有语义计费，升级前后逐请求等价，见 §6/§8.1）与**旧单字段兼容回退路径**。
- 重叠检测归一化时按 `[start, 1440) + [0, end)` 拆分处理（§10.2）。

### 10.2 校验规则（`PricingService.UpdateByModelID` 应用层实现）

| 校验项 | 规则 | 处理 |
|--------|------|------|
| 格式 | `HH:MM` 或 `HH:MM:SS`（`time.Parse("15:04")` / `time.Parse("15:04:05")`） | 非法 → 400 拒绝 |
| start >= end | 无业务意义（旧语义 `start == end` = 全天高峰、`start > end` = 跨午夜，均不再接受新录入；跨午夜改用两组时段表达，见 §10.1） | **强制拒绝（400）**，错误信息明确："高峰时段的开始时间必须早于结束时间" |
| 重叠 | 归一化后区间两两比较（排序扫描） | **强制拒绝（400）** |
| 组数上限 | 最多 8 组 | 超过 → 400 拒绝 |
| 空时段（0 组） | time_based 提交空 ranges 且无旧字段 | 允许（**0 组 = 全天低谷价**，仍属 time_based，按低谷价计费，见 §8.2/M1） |

> 校验仅作用于**新增/编辑保存**；存量已迁移数据中的 `start == end` / `start > end` 单组时段不在校验范围内，按既有语义照常计费（M1，见 §6）。

重叠检测伪代码（归一化 + 排序）：

```go
func hasOverlap(ranges []dto.TimeRangeDTO) bool {
    type seg struct{ s, e int } // 分钟制 [s, e)
    var segs []seg
    for _, r := range ranges {
        s, e := toMinutes(r.Start), toMinutes(r.End) // "09:00" -> 540
        if s < e {
            segs = append(segs, seg{s, e})
        } else { // s > e 跨午夜拆两段
            segs = append(segs, seg{s, 1440}, seg{0, e})
        }
    }
    sort.Slice(segs, func(i, j int) bool { return segs[i].s < segs[j].s })
    for i := 1; i < len(segs); i++ {
        if segs[i].s < segs[i-1].e { return true }
    }
    return false
}
```

### 10.3 缓存一致性

- 现状：`BillingService.ComputeCost` 直连 `pricingRepo.GetByModelID`（PG 查询），代码层未见缓存实现；架构文档既有设计为 Redis Cache-Aside（Key `pricing:model:{modelID}`，TTL 5min，写后 DEL）。
- 本设计**不引入缓存改造**，但约定：若后续落实定价缓存，`UpdateByModelID` 成功写库后**必须 DEL 对应 Key**（时段变更即时生效），否则 TTL 内计费使用旧时段。
- 多时段数据随定价对象整体进出缓存（子表查询在缓存 miss 时一次完成并随缓存带出），不存在缓存内部分一致问题。

### 10.4 时区

- 现状 `isWithinTimeRange` 使用 `t.Location()`（请求时间所在时区）解释 `HH:MM`。DeepSeek 等厂商按北京时间定价，若部署时区为 UTC 将偏移。
- **本迭代不改时区语义**（超出范围，避免行为变化）；在风险表记录，若后续需要"按指定时区解释时段"，作为独立特性（如主表加 `timezone` 字段）另行设计。

### 10.5 风险表

| # | 风险 | 等级 | 影响 | 缓解 |
|---|------|:----:|------|------|
| 1 | 回滚丢多时段数据 | 中 | down 迁移只还原第一组时段 | 回滚前备份；down SQL 已尽量还原；文档明示 |
| 2 | 旧前端未升级（只传 peakStart/peakEnd） | 低 | 多时段能力不可用；旧前端写操作会把多时段降级为单时段 | 兼容转换（§7.3）单时段仍正常工作；发布顺序先前端后后端（§10.6/m4） |
| 3 | 时段重叠/非法输入 | 低 | 计费歧义、数据不整洁 | 应用层校验（§10.2）；重叠与 `start >= end` 强制拒绝（400） |
| 4 | 时区偏移 | 中 | 峰谷切换时刻偏差 | 维持现状并记录为后续特性；文档明示 |
| 5 | Upsert 非事务写子表 | 中 | 崩溃残留旧时段 | 改为事务（§7.4），DELETE + INSERT 原子 |
| 6 | 缓存脏数据 | 低 | 计费使用旧时段 | 写后 DEL（§10.3）；TTL 兜底 |

### 10.6 发布注意事项

- **升级顺序（m4）**：**先升级前端再升级后端**（或前后端同版本发布），避免旧前端写操作把多时段降级为单时段（旧前端仅提交 `peakStart/peakEnd`，经兼容转换会丢弃多时段数据）。
- 后端升级依赖迁移先行：迁移（§6 up）随后端启动自动执行，上线前确认迁移成功后再开放新前端写入口。
- 回滚顺序：先回滚后端 → 再回滚前端；若需执行 down 迁移，必须先完成 m3 检查（统计 >1 组记录的 pricing 并人工确认）并以备份为准（§6）。

---

## 11. 实施拆分

> 建议按 Backend → Frontend → 联调回归的顺序执行，每步完成后由 Reviewer 审查。

### 11.1 Backend（迁移 + 实体 + Repo + Service）

| # | 任务 | 文件 |
|---|------|------|
| B1 | 新增迁移 up/down（§6） | `backend/migrations/202608080011_multi_peak_ranges.up.sql`、`...down.sql` |
| B2 | 实体增加 `TimeRange` 与 `PeakRanges` 字段（§7.1） | `backend/internal/entity/model_pricing.go` |
| B3 | DTO 增加 `TimeRangeDTO` 与 `PeakRanges` 字段（§7.2） | `backend/internal/dto/admin_pricing.go` |
| B4 | Repo PG 实现：List/GetByModelID 关联子表；Upsert 事务化（delete + insert ranges）（§7.4） | `backend/internal/repository/model_pricing_repo_pg.go` |
| B5 | InMemory Repo 同步支持 PeakRanges（测试用） | `backend/internal/repository/model_pricing_repository.go` |
| B6 | PricingService：请求校验（§10.2）、组装/兼容转换（§7.3）、toAdminPricingItem 填充 | `backend/internal/service/pricing_service.go` |
| B7 | BillingService：`isWithinAnyTimeRange` + ComputeCost 分支改造（§8） | `backend/internal/service/billing_service.go` |
| B8 | 单元测试：多时段命中/未命中/两组表达跨午夜/start>=end 拒绝/0 组全天低谷/兼容转换（含空串判空）/迁移后计费等价 | `backend/internal/service/billing_service_test.go`（新增）等 |

### 11.2 Frontend（UI）

| # | 任务 | 文件 |
|---|------|------|
| F1 | API 类型增加 `TimeRange`、`peakRanges`（§9.1） | `admin/src/api/pricing.ts` |
| F2 | 编辑弹窗：editForm 改多组、增删（可删至 0 组）/上移下移、start>=end 校验提示、openEdit 解析与存量全天高峰提示（§9.2/M1） | `admin/src/pages/pricing/pricing-page.vue` |
| F3 | handleSave 提交 peakRanges（可空数组 = 0 组全天低谷）、start>=end 校验（§9.2/M1） | `admin/src/pages/pricing/pricing-page.vue` |
| F4 | 列表页价格详情展示高峰时段（§9.3） | `admin/src/pages/pricing/pricing-page.vue` |

### 11.3 验收要点

- 迁移后存量 time_based 数据计费结果与升级前一致（回归用例）
- 双高峰时段（09:00-12:00、14:00-18:00）命中/未命中边界（09:00、12:00、14:00、18:00 整点）
- 跨午夜以两组时段表达（22:00-23:59 + 00:00-02:00）命中/未命中边界；`start >= end` 拒绝（400）；重叠拒绝
- 0 组（删除全部高峰时段）保存后按全天低谷价计费；存量 `start == end` 行迁移后仍按全天高峰计费（升级前后逐请求等价）
- 旧前端兼容：仅传 `peakStart/peakEnd`（trim 后非空）的 PUT 请求仍成功且计费正常；空串/纯空白不生成 range
- 前端增删/排序后保存 → 列表展示 → 计费验证闭环

---

## 12. Reviewer 结论与修订记录

### 12.1 Reviewer 评审结论

| 项 | 内容 |
|----|------|
| 评审结论 | **CONDITIONAL PASS**（有条件通过） |
| 评审日期 | 2026-08-08 |
| 问题清单 | 3 个 Major + 4 个 Minor |

**Major 问题（已修订）**：

| # | 问题 | 修订章节 | 最终决策（一句话） |
|---|------|---------|-------------------|
| M1 | `start == end` 语义未统一（迁移/校验/前端不一致） | §6、§8、§9、§10.1、§10.2 | 存量 `start == end` 照常迁移（全天高峰，计费逐请求等价）；新增/编辑保存后端拒绝 `start >= end`（400）且前端 handleSave 同步校验；前端允许删除至 0 组（0 组 = 全天低谷价），openEdit 对存量全天高峰提示先修改再保存 |
| M2 | Upsert 返回与落库可能不一致 | §7.4、§8.3 | Upsert 在事务内完成（更新主表 → DELETE 子表 → INSERT 子表含 sort_order → 事务内重新 SELECT 子表组装返回 entity 含 PeakRanges），保证 UpdateByModelID 响应与落库一致（备选：提交后 GetByModelID 重载，已说明取舍） |
| M3 | 请求端旧字段兼容转换缺判空条件 | §7.3、§8.3 | 旧字段 `peakStart/peakEnd` 仅在 trim 后为非空串时才兼容转换，空串/纯空白视为未传时段不生成 range，且仅当请求体不含 `peakRanges` 时才走兼容转换 |

**Minor 问题（已修订）**：

| # | 问题 | 修订章节 |
|---|------|---------|
| m1 | up 迁移未按 pricing_type 过滤 | §6 up 迁移 SQL 增加 `AND pricing_type = 'time_based'` |
| m2 | 重叠校验措辞"建议拒绝"与实现不一致 | §10.2 统一为**强制拒绝（400）**，伪代码与正文一致 |
| m3 | down 迁移缺前置检查 | §6 down 迁移补充"执行前统计 >1 组子表记录的 pricing 并告警/要求人工确认" |
| m4 | 缺发布顺序约束 | §10.6 新增发布注意事项：先升级前端再升级后端（或同版本发布），避免旧前端写操作降级多时段 |

### 12.2 修订记录

| 日期 | 版本 | 修订内容 | 修订人 |
|------|------|---------|--------|
| 2026-08-08 | v1.1 | 按 Reviewer CONDITIONAL PASS 意见定稿：M1 `start==end` 语义统一（迁移保留 / 校验拒绝 `start >= end` / 0 组=全天低谷 / openEdit 存量提示）、M2 Upsert 事务内重载返回、M3 兼容转换判空（trim 非空串 + 仅无 peakRanges 时转换）；m1~m4 修订；同步更新 §6~§11 与 Change Log | Architect |

---

## 13. Future Extension

| 未来需求 | 预留机制 | 说明 |
|---------|---------|------|
| 按时段差异化价格 | 子表加 `price` 列 | 方案 A 天然支持，无需破坏性迁移 |
| 按指定时区解释时段 | 主表加 `timezone` 字段 | 独立特性，另行设计 |
| 工作日/周末分价 | 子表加 `weekday` 维度 | 方案 A 可平滑扩展 |
| 移除旧字段 peakStart/peakEnd | 版本化清理 | 旧前端全部升级后移除 |

---

## 14. Change Log

| 日期 | 版本 | 修改内容 | 修改人 |
|------|------|---------|--------|
| 2026-08-08 | v1.0 | 初始版本：多高峰时段方案选型（子表）、迁移、API、计费、前端设计 | Architect |
| 2026-08-08 | v1.1 | 按 Reviewer CONDITIONAL PASS 定稿：M1~M3 + m1~m4 修订（详见 §12.2），状态 Draft → Final | Architect |

---

# End

本模板依据 AI Company Document Standard 和 Engineering Standard 设计。

所有 Architecture 文档必须基于此模板创建。
