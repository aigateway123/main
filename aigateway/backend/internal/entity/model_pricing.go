package entity

import (
	"encoding/json"
	"time"
)

type ModelPricing struct {
	ID                    int64            `json:"id"`
	ModelID               int64            `json:"modelId"`
	PricingType           string           `json:"pricingType"`
	PricePerInputToken    float64          `json:"pricePerInputToken"`
	PricePerOutputToken   float64          `json:"pricePerOutputToken"`
	Currency              string           `json:"currency"`
	PeakStart             *string          `json:"peakStart"`
	PeakEnd               *string          `json:"peakEnd"`
	PeakPricePerInput     *float64         `json:"peakPricePerInput"`
	PeakPricePerOutput    *float64         `json:"peakPricePerOutput"`
	OffpeakPricePerInput  *float64         `json:"offpeakPricePerInput"`
	OffpeakPricePerOutput *float64         `json:"offpeakPricePerOutput"`
	PricingStatus         string           `json:"pricingStatus"`
	PricingUnit           string           `json:"pricingUnit"`
	UnitPrice             *json.RawMessage `json:"unitPrice,omitempty"`
	UpdatedAt             time.Time        `json:"updatedAt"`
}

