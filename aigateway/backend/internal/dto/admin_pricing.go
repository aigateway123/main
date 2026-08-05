package dto

import "encoding/json"

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
	PeakStart             *string          `json:"peakStart"`
	PeakEnd               *string          `json:"peakEnd"`
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
	PeakStart             *string          `json:"peakStart"`
	PeakEnd               *string          `json:"peakEnd"`
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

