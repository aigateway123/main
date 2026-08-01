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
	return p, nil
}

func (r *PostgresModelPricingRepository) Upsert(ctx context.Context, pricing *entity.ModelPricing) (*entity.ModelPricing, error) {
	now := time.Now()
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
			$6::time, $7::time,
			$8, $9,
			$10, $11,
			$12, $13, $14,
			$15
		)
		ON CONFLICT (model_id) DO UPDATE SET
			pricing_type = EXCLUDED.pricing_type,
			price_per_input_token = EXCLUDED.price_per_input_token,
			price_per_output_token = EXCLUDED.price_per_output_token,
			currency = EXCLUDED.currency,
			peak_start = EXCLUDED.peak_start,
			peak_end = EXCLUDED.peak_end,
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
			CASE WHEN peak_start IS NULL THEN NULL ELSE to_char(peak_start, 'HH24:MI:SS') END AS peak_start,
			CASE WHEN peak_end IS NULL THEN NULL ELSE to_char(peak_end, 'HH24:MI:SS') END AS peak_end,
			peak_price_per_input, peak_price_per_output,
			offpeak_price_per_input, offpeak_price_per_output,
			pricing_status, pricing_unit, unit_price,
			updated_at
	`

	row := r.pool.QueryRow(ctx, query,
		pricing.ModelID,
		pricing.PricingType,
		pricing.PricePerInputToken,
		pricing.PricePerOutputToken,
		pricing.Currency,
		pricing.PeakStart,
		pricing.PeakEnd,
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
