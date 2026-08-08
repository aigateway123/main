package dto

import "encoding/json"

// TimeRangeDTO 与 entity.TimeRange 同构，供 Admin API 使用
type TimeRangeDTO struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type AdminPricingItem struct {
	ID                    int64            `json:"id"`
	ModelID               int64            `json:"modelId"`
	ModelName             string           `json:"modelName"`
	ModelCode             string           `json:"modelCode"`
	PricingType           string           `json:"pricingType"`
	PricePerInputToken    float64          `json:"pricePerInputToken"`
	PricePerOutputToken   float64          `json:"pricePerOutputToken"`
	Currency              string           `json:"currency"`
	PricingUnit           string           `json:"pricingUnit"`
	UnitPrice             *json.RawMessage `json:"unitPrice,omitempty"`
	PeakStart             *string          `json:"peakStart"`  // 保留：由 PeakRanges[0] 派生，兼容旧前端
	PeakEnd               *string          `json:"peakEnd"`    // 保留：同上
	PeakRanges            []TimeRangeDTO   `json:"peakRanges"` // 新增
	PeakPricePerInput     *float64         `json:"peakPricePerInputToken"`
	PeakPricePerOutput    *float64         `json:"peakPricePerOutputToken"`
	OffpeakPricePerInput  *float64         `json:"offPeakPricePerInputToken"`
	OffpeakPricePerOutput *float64         `json:"offPeakPricePerOutputToken"`
	PricingStatus         string           `json:"pricingStatus"`
	UpdatedAt             string           `json:"updatedAt"`
}

type AdminUpdatePricingRequest struct {
	PricingType           string           `json:"pricingType"`
	PricePerInputToken    float64          `json:"pricePerInputToken"`
	PricePerOutputToken   float64          `json:"pricePerOutputToken"`
	Currency              string           `json:"currency"`
	PricingUnit           string           `json:"pricingUnit"`
	UnitPrice             *json.RawMessage `json:"unitPrice,omitempty"`
	PeakStart             *string          `json:"peakStart"`  // 保留：兼容旧调用方（见 7.3 决策）
	PeakEnd               *string          `json:"peakEnd"`    // 保留：同上
	PeakRanges            *[]TimeRangeDTO  `json:"peakRanges"` // 指针区分"未传"(nil) 与"显式空数组"(0 组)；非 nil 时优先使用
	PeakPricePerInput     *float64         `json:"peakPricePerInputToken"`
	PeakPricePerOutput    *float64         `json:"peakPricePerOutputToken"`
	OffpeakPricePerInput  *float64         `json:"offPeakPricePerInputToken"`
	OffpeakPricePerOutput *float64         `json:"offPeakPricePerOutputToken"`
	PricingStatus         string           `json:"pricingStatus"`
}

type PricingTemplate struct {
	ProviderName        string  `json:"providerName"`
	ModelCode           string  `json:"modelCode"`
	SuggestedInputPrice float64 `json:"suggestedInputPrice"`
	SuggestedOutputPrice float64 `json:"suggestedOutputPrice"`
	PricingType         string  `json:"pricingType"`
}

