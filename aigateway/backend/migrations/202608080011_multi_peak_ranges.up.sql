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
