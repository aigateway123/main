package repository

import (
	"context"
	"time"

	"aigateway/backend/internal/entity"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresModelPricingRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresModelPricingRepository(pool *pgxpool.Pool) *PostgresModelPricingRepository {
	return &PostgresModelPricingRepository{pool: pool}
}

func (r *PostgresModelPricingRepository) List(ctx context.Context) ([]*entity.ModelPricing, error) {
	query := `
		SELECT
			id, model_id, pricing_type, price_per_input_token, price_per_output_token, currency,
			CASE WHEN peak_start IS NULL THEN NULL ELSE to_char(peak_start, 'HH24:MI:SS') END AS peak_start,
			CASE WHEN peak_end IS NULL THEN NULL ELSE to_char(peak_end, 'HH24:MI:SS') END AS peak_end,
			peak_price_per_input, peak_price_per_output,
			offpeak_price_per_input, offpeak_price_per_output,
			pricing_status, pricing_unit, unit_price,
			updated_at
		FROM model_pricing
		ORDER BY model_id ASC
	`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entity.ModelPricing
	for rows.Next() {
		p, err := scanModelPricing(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// 批量加载子表时段并按 pricing_id 聚合为 PeakRanges
	if len(result) > 0 {
		pricingIDs := make([]int64, 0, len(result))
		for _, p := range result {
			pricingIDs = append(pricingIDs, p.ID)
		}
		rangesByPricingID, err := loadTimeRangesByPricingIDs(ctx, r.pool, pricingIDs)
		if err != nil {
			return nil, err
		}
		for _, p := range result {
			p.PeakRanges = rangesByPricingID[p.ID]
		}
	}
	return result, nil
}

func (r *PostgresModelPricingRepository) GetByModelID(ctx context.Context, modelID int64) (*entity.ModelPricing, error) {
	query := `
		SELECT
			id, model_id, pricing_type, price_per_input_token, price_per_output_token, currency,
			CASE WHEN peak_start IS NULL THEN NULL ELSE to_char(peak_start, 'HH24:MI:SS') END AS peak_start,
			CASE WHEN peak_end IS NULL THEN NULL ELSE to_char(peak_end, 'HH24:MI:SS') END AS peak_end,
			peak_price_per_input, peak_price_per_output,
			offpeak_price_per_input, offpeak_price_per_output,
			pricing_status, pricing_unit, unit_price,
			updated_at
		FROM model_pricing
		WHERE model_id = $1
	`
	row := r.pool.QueryRow(ctx, query, modelID)
	p, err := scanModelPricing(row)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrPricingNotFound
		}
		return nil, err
	}

	ranges, err := loadTimeRangesForPricing(ctx, r.pool, p.ID)
	if err != nil {
		return nil, err
	}
	p.PeakRanges = ranges
	return p, nil
}

func (r *PostgresModelPricingRepository) Upsert(ctx context.Context, pricing *entity.ModelPricing) (*entity.ModelPricing, error) {
	now := time.Now()
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	// 1. 主表 upsert：peak_start/peak_end 统一写 NULL（权威数据源为子表）
	query := `
		INSERT INTO model_pricing (
			model_id, pricing_type, price_per_input_token, price_per_output_token, currency,
			peak_start, peak_end,
			peak_price_per_input, peak_price_per_output,
			offpeak_price_per_input, offpeak_price_per_output,
			pricing_status, pricing_unit, unit_price,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5,
			NULL, NULL,
			$6, $7,
			$8, $9,
			$10, $11, $12,
			$13
		)
		ON CONFLICT (model_id) DO UPDATE SET
			pricing_type = EXCLUDED.pricing_type,
			price_per_input_token = EXCLUDED.price_per_input_token,
			price_per_output_token = EXCLUDED.price_per_output_token,
			currency = EXCLUDED.currency,
			peak_start = NULL,
			peak_end = NULL,
			peak_price_per_input = EXCLUDED.peak_price_per_input,
			peak_price_per_output = EXCLUDED.peak_price_per_output,
			offpeak_price_per_input = EXCLUDED.offpeak_price_per_input,
			offpeak_price_per_output = EXCLUDED.offpeak_price_per_output,
			pricing_status = EXCLUDED.pricing_status,
			pricing_unit = EXCLUDED.pricing_unit,
			unit_price = EXCLUDED.unit_price,
			updated_at = EXCLUDED.updated_at
		RETURNING
			id, model_id, pricing_type, price_per_input_token, price_per_output_token, currency,
			NULL::text AS peak_start,
			NULL::text AS peak_end,
			peak_price_per_input, peak_price_per_output,
			offpeak_price_per_input, offpeak_price_per_output,
			pricing_status, pricing_unit, unit_price,
			updated_at
	`

	row := tx.QueryRow(ctx, query,
		pricing.ModelID,
		pricing.PricingType,
		pricing.PricePerInputToken,
		pricing.PricePerOutputToken,
		pricing.Currency,
		pricing.PeakPricePerInput,
		pricing.PeakPricePerOutput,
		pricing.OffpeakPricePerInput,
		pricing.OffpeakPricePerOutput,
		pricing.PricingStatus,
		pricing.PricingUnit,
		pricing.UnitPrice,
		now,
	)

	p, err := scanModelPricing(row)
	if err != nil {
		return nil, err
	}

	// 2. 清空并重写子表时段（先删后插，sort_order = 下标）
	if _, err := tx.Exec(ctx, `DELETE FROM model_pricing_time_ranges WHERE pricing_id = $1`, p.ID); err != nil {
		return nil, err
	}
	for i, rng := range pricing.PeakRanges {
		if _, err := tx.Exec(ctx, `
			INSERT INTO model_pricing_time_ranges (pricing_id, peak_start, peak_end, sort_order)
			VALUES ($1, $2::time, $3::time, $4)
		`, p.ID, rng.Start, rng.End, i); err != nil {
			return nil, err
		}
	}

	// 3. 事务内重新加载子表时段，保证返回 entity 与落库状态一致（M2）
	p.PeakRanges, err = loadTimeRangesForPricing(ctx, tx, p.ID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return p, nil
}

type modelPricingScanner interface {
	Scan(dest ...any) error
}

func scanModelPricing(row modelPricingScanner) (*entity.ModelPricing, error) {
	var p entity.ModelPricing
	var peakStart *string
	var peakEnd *string
	var peakInput pgtype.Numeric
	var peakOutput pgtype.Numeric
	var offpeakInput pgtype.Numeric
	var offpeakOutput pgtype.Numeric

	err := row.Scan(
		&p.ID,
		&p.ModelID,
		&p.PricingType,
		&p.PricePerInputToken,
		&p.PricePerOutputToken,
		&p.Currency,
		&peakStart,
		&peakEnd,
		&peakInput,
		&peakOutput,
		&offpeakInput,
		&offpeakOutput,
		&p.PricingStatus,
		&p.PricingUnit,
		&p.UnitPrice,
		&p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	p.PeakStart = peakStart
	p.PeakEnd = peakEnd
	p.PeakPricePerInput = numericPtrToFloatPtr(&peakInput)
	p.PeakPricePerOutput = numericPtrToFloatPtr(&peakOutput)
	p.OffpeakPricePerInput = numericPtrToFloatPtr(&offpeakInput)
	p.OffpeakPricePerOutput = numericPtrToFloatPtr(&offpeakOutput)

	if p.PricingUnit == "" {
		p.PricingUnit = "token"
	}

	return &p, nil
}

func numericPtrToFloatPtr(n *pgtype.Numeric) *float64 {
	if n == nil || !n.Valid {
		return nil
	}
	v, err := n.Float64Value()
	if err != nil {
		return nil
	}
	f := v.Float64
	return &f
}

// timeRangeQuerier 抽象 *pgxpool.Pool 与 pgx.Tx，供时段查询复用。
type timeRangeQuerier interface {
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
}

// loadTimeRangesByPricingIDs 批量加载子表时段并按 pricing_id 聚合为 PeakRanges（List 用）。
// 输出格式保持 to_char 'HH24:MI:SS'，与现有单字段一致。
func loadTimeRangesByPricingIDs(ctx context.Context, q timeRangeQuerier, pricingIDs []int64) (map[int64][]entity.TimeRange, error) {
	out := make(map[int64][]entity.TimeRange, len(pricingIDs))
	if len(pricingIDs) == 0 {
		return out, nil
	}
	rows, err := q.Query(ctx, `
		SELECT pricing_id, to_char(peak_start, 'HH24:MI:SS'), to_char(peak_end, 'HH24:MI:SS')
		FROM model_pricing_time_ranges
		WHERE pricing_id = ANY($1)
		ORDER BY pricing_id, sort_order
	`, pricingIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var pricingID int64
		var r entity.TimeRange
		if err := rows.Scan(&pricingID, &r.Start, &r.End); err != nil {
			return nil, err
		}
		out[pricingID] = append(out[pricingID], r)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}

// loadTimeRangesForPricing 加载单个 pricing 的子表时段（GetByModelID / Upsert 事务内用）。
func loadTimeRangesForPricing(ctx context.Context, q timeRangeQuerier, pricingID int64) ([]entity.TimeRange, error) {
	rows, err := q.Query(ctx, `
		SELECT to_char(peak_start, 'HH24:MI:SS'), to_char(peak_end, 'HH24:MI:SS')
		FROM model_pricing_time_ranges
		WHERE pricing_id = $1
		ORDER BY sort_order
	`, pricingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ranges []entity.TimeRange
	for rows.Next() {
		var r entity.TimeRange
		if err := rows.Scan(&r.Start, &r.End); err != nil {
			return nil, err
		}
		ranges = append(ranges, r)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return ranges, nil
}
