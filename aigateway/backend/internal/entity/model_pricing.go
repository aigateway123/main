package entity

import (
	"encoding/json"
	"time"
)

// TimeRange 高峰时段（"HH:MM" 或 "HH:MM:SS"；新写入要求 start < end（§10.2/M1），
// 存量已迁移数据可能含 start == end / start > end，按既有语义计费）
type TimeRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type ModelPricing struct {
	ID                    int64            `json:"id"`
	ModelID               int64            `json:"modelId"`
	PricingType           string           `json:"pricingType"`
	PricePerInputToken    float64          `json:"pricePerInputToken"`
	PricePerOutputToken   float64          `json:"pricePerOutputToken"`
	Currency              string           `json:"currency"`
	PeakStart             *string          `json:"peakStart"`  // 保留，仅读兼容（新写入为 NULL）
	PeakEnd               *string          `json:"peakEnd"`    // 保留，仅读兼容（新写入为 NULL）
	PeakRanges            []TimeRange      `json:"peakRanges"` // 新增：有序多组高峰时段（权威数据源）
	PeakPricePerInput     *float64         `json:"peakPricePerInput"`
	PeakPricePerOutput    *float64         `json:"peakPricePerOutput"`
	OffpeakPricePerInput  *float64         `json:"offpeakPricePerInput"`
	OffpeakPricePerOutput *float64         `json:"offpeakPricePerOutput"`
	PricingStatus         string           `json:"pricingStatus"`
	PricingUnit           string           `json:"pricingUnit"`
	UnitPrice             *json.RawMessage `json:"unitPrice,omitempty"`
	UpdatedAt             time.Time        `json:"updatedAt"`
}

