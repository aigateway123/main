package service

import (
	"context"
	"testing"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

// newTestBillingService 构造一个仅依赖内存 pricing repo 的 BillingService（ComputeCost 只用 pricingRepo）。
func newTestBillingService(pricing *entity.ModelPricing) *BillingService {
	repo := repository.NewInMemoryModelPricingRepository()
	if _, err := repo.Upsert(context.Background(), pricing); err != nil {
		panic(err)
	}
	return NewBillingService(nil, nil, nil, repo, nil, nil, nil, nil)
}

func testAt(hour, minute int) time.Time {
	return time.Date(2000, 1, 1, hour, minute, 0, 0, time.UTC)
}

func floatPtr(v float64) *float64 { return &v }

func TestComputeCost_MultiPeakRanges(t *testing.T) {
	peakInput := 0.000002
	peakOutput := 0.000008
	offInput := 0.000001
	offOutput := 0.000004

	svc := newTestBillingService(&entity.ModelPricing{
		ModelID:              1,
		PricingType:          "time_based",
		PricingUnit:          "token",
		PricePerInputToken:   0.000003,
		PricePerOutputToken:  0.000009,
		PeakPricePerInput:    &peakInput,
		PeakPricePerOutput:   &peakOutput,
		OffpeakPricePerInput: &offInput,
		OffpeakPricePerOutput: &offOutput,
		PeakRanges: []entity.TimeRange{
			{Start: "09:00:00", End: "12:00:00"},
			{Start: "14:00:00", End: "18:00:00"},
		},
	})

	peakCost := 1000*peakInput + 1000*peakOutput
	offCost := 1000*offInput + 1000*offOutput

	cases := []struct {
		name string
		at   time.Time
		want float64
	}{
		{"09:00 第一高峰开始整点（命中）", testAt(9, 0), peakCost},
		{"11:00 第一高峰时段内（命中）", testAt(11, 0), peakCost},
		{"12:00 第一高峰结束边界（不命中）", testAt(12, 0), offCost},
		{"14:00 第二高峰开始整点（命中）", testAt(14, 0), peakCost},
		{"17:00 第二高峰时段内（命中）", testAt(17, 0), peakCost},
		{"18:00 第二高峰结束边界（不命中）", testAt(18, 0), offCost},
		{"00:00 低谷", testAt(0, 0), offCost},
		{"08:00 低谷", testAt(8, 0), offCost},
		{"13:00 两高峰之间低谷", testAt(13, 0), offCost},
	}

	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			cost, err := svc.ComputeCost(context.Background(), 1, 1000, 1000, tt.at)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if cost != tt.want {
				t.Errorf("cost = %v, want %v", cost, tt.want)
			}
		})
	}
}

func TestComputeCost_ZeroRanges_AllDayOffpeak(t *testing.T) {
	// 0 组 PeakRanges 且配置了峰/谷价格 → 全天低谷价（M1）
	svc := newTestBillingService(&entity.ModelPricing{
		ModelID:              2,
		PricingType:          "time_based",
		PricingUnit:          "token",
		PeakPricePerInput:    floatPtr(0.000002),
		PeakPricePerOutput:   floatPtr(0.000008),
		OffpeakPricePerInput: floatPtr(0.000001),
		OffpeakPricePerOutput: floatPtr(0.000004),
		PeakRanges:           []entity.TimeRange{},
	})

	cost, err := svc.ComputeCost(context.Background(), 2, 1000, 1000, testAt(10, 0))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	want := 1000*0.000001 + 1000*0.000004
	if cost != want {
		t.Errorf("cost = %v, want %v（全天低谷价）", cost, want)
	}
}

func TestComputeCost_LegacySingleRangeFallback(t *testing.T) {
	// 单组兼容回退：PeakRanges 为空、旧字段 PeakStart/PeakEnd 有值 → 按旧字段判断（§8.2 兼容回退）
	peakStart := "08:00:00"
	peakEnd := "23:00:00"
	svc := newTestBillingService(&entity.ModelPricing{
		ModelID:              3,
		PricingType:          "time_based",
		PricingUnit:          "token",
		PeakStart:            &peakStart,
		PeakEnd:              &peakEnd,
		PeakRanges:           nil,
		PeakPricePerInput:    floatPtr(0.000002),
		PeakPricePerOutput:   floatPtr(0.000008),
		OffpeakPricePerInput: floatPtr(0.000001),
		OffpeakPricePerOutput: floatPtr(0.000004),
	})

	cases := []struct {
		name string
		at   time.Time
		want float64
	}{
		{"10:00 时段内（高峰价）", testAt(10, 0), 1000*0.000002 + 1000*0.000008},
		{"00:00 时段外（低谷价）", testAt(0, 0), 1000*0.000001 + 1000*0.000004},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			cost, err := svc.ComputeCost(context.Background(), 3, 1000, 1000, tt.at)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if cost != tt.want {
				t.Errorf("cost = %v, want %v", cost, tt.want)
			}
		})
	}
}

func TestComputeCost_PerMillionTokensWithMultiRanges(t *testing.T) {
	// per_million_tokens 单位 + 多时段组合：cost = (input*in + output*out) / 1_000_000
	peakInput := 0.000002
	peakOutput := 0.000008
	offInput := 0.000001
	offOutput := 0.000004

	svc := newTestBillingService(&entity.ModelPricing{
		ModelID:              4,
		PricingType:          "time_based",
		PricingUnit:          "per_million_tokens",
		PeakPricePerInput:    &peakInput,
		PeakPricePerOutput:   &peakOutput,
		OffpeakPricePerInput: &offInput,
		OffpeakPricePerOutput: &offOutput,
		PeakRanges: []entity.TimeRange{
			{Start: "09:00:00", End: "12:00:00"},
			{Start: "14:00:00", End: "18:00:00"},
		},
	})

	const input = 1_000_000
	const output = 2_000_000

	peakCost := (float64(input)*peakInput + float64(output)*peakOutput) / 1_000_000
	offCost := (float64(input)*offInput + float64(output)*offOutput) / 1_000_000

	cases := []struct {
		name string
		at   time.Time
		want float64
	}{
		{"10:00 高峰（per_million）", testAt(10, 0), peakCost},
		{"16:00 第二高峰（per_million）", testAt(16, 0), peakCost},
		{"20:00 低谷（per_million）", testAt(20, 0), offCost},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			cost, err := svc.ComputeCost(context.Background(), 4, input, output, tt.at)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if cost != tt.want {
				t.Errorf("cost = %v, want %v", cost, tt.want)
			}
		})
	}
}

func TestComputeCost_CrossMidnightTwoRanges(t *testing.T) {
	// 跨午夜以两组时段表达（§10.2）：22:00-23:59 + 00:00-02:00；
	// end 用 23:59:59 秒粒度，使 23:59 整点也落在第一组内。
	svc := newTestBillingService(&entity.ModelPricing{
		ModelID:              5,
		PricingType:          "time_based",
		PricingUnit:          "token",
		PeakPricePerInput:    floatPtr(0.000002),
		PeakPricePerOutput:   floatPtr(0.000008),
		OffpeakPricePerInput: floatPtr(0.000001),
		OffpeakPricePerOutput: floatPtr(0.000004),
		PeakRanges: []entity.TimeRange{
			{Start: "22:00:00", End: "23:59:59"},
			{Start: "00:00:00", End: "02:00:00"},
		},
	})

	peakCost := 1000*0.000002 + 1000*0.000008
	offCost := 1000*0.000001 + 1000*0.000004

	cases := []struct {
		name string
		at   time.Time
		want float64
	}{
		{"22:00 前夜高峰开始整点（命中）", testAt(22, 0), peakCost},
		{"23:59 前夜高峰结束前整点（命中）", testAt(23, 59), peakCost},
		{"00:00 次日高峰开始整点（命中）", testAt(0, 0), peakCost},
		{"01:30 次日高峰时段内（命中）", testAt(1, 30), peakCost},
		{"02:00 次日高峰结束边界（不命中）", testAt(2, 0), offCost},
		{"21:00 前夜高峰开始前（低谷）", testAt(21, 0), offCost},
		{"02:01 次日高峰结束后（低谷）", testAt(2, 1), offCost},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			cost, err := svc.ComputeCost(context.Background(), 5, 1000, 1000, tt.at)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if cost != tt.want {
				t.Errorf("cost = %v, want %v", cost, tt.want)
			}
		})
	}
}

func TestComputeCost_LegacyFullDayPeak_StartEqualsEnd(t *testing.T) {
	// 存量 start==end 语义 = 全天高峰（isWithinTimeRange sd.Equal(ed) → true）：
	// 迁移后以 PeakRanges=[{09:00,09:00}] 表达，任意时刻 → 高峰价，逐请求与迁移前等价。
	svc := newTestBillingService(&entity.ModelPricing{
		ModelID:              6,
		PricingType:          "time_based",
		PricingUnit:          "token",
		PeakPricePerInput:    floatPtr(0.000002),
		PeakPricePerOutput:   floatPtr(0.000008),
		OffpeakPricePerInput: floatPtr(0.000001),
		OffpeakPricePerOutput: floatPtr(0.000004),
		PeakRanges:           []entity.TimeRange{{Start: "09:00:00", End: "09:00:00"}},
	})

	peakCost := 1000*0.000002 + 1000*0.000008
	for _, tt := range []struct {
		name string
		at   time.Time
	}{
		{"00:00 任意时刻高峰价", testAt(0, 0)},
		{"09:00 任意时刻高峰价", testAt(9, 0)},
		{"23:00 任意时刻高峰价", testAt(23, 0)},
	} {
		t.Run(tt.name, func(t *testing.T) {
			cost, err := svc.ComputeCost(context.Background(), 6, 1000, 1000, tt.at)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if cost != peakCost {
				t.Errorf("cost = %v, want %v（全天高峰价）", cost, peakCost)
			}
		})
	}
}
