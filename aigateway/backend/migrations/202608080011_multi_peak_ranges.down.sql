-- Migration 011 rollback: 将子表数据回写主表后删除子表

-- 执行前检查（m3）：down 迁移执行前，必须先行统计子表中存在 >1 组记录的 pricing
-- 并告警/要求人工确认（确认已备份或接受多时段数据丢失）后再执行：
-- SELECT pricing_id, COUNT(*) AS range_cnt
-- FROM model_pricing_time_ranges
-- GROUP BY pricing_id
-- HAVING COUNT(*) > 1;
-- 风险：若回滚发生在"已按多时段写入新数据"之后，主表旧列已被置 NULL，
-- down 回写只能恢复第一组时段，多组时段数据将丢失（DROP 子表），生产回滚须以备份为准。

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
