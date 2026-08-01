package dto

import "encoding/json"

type CreatePricingRequest struct {
	ModelCode     string           `json:"modelCode"`
	ProviderID    int64            `json:"providerId"`
	InputPrice    float64          `json:"inputPrice"`
	OutputPrice   float64          `json:"outputPrice"`
	PricingUnit   *string          `json:"pricingUnit,omitempty"`
	UnitPrice     *json.RawMessage `json:"unitPrice,omitempty"`
	EffectiveFrom string           `json:"effectiveFrom"`          // RFC3339
	EffectiveTo   string           `json:"effectiveTo,omitempty"` // RFC3339, optional
}

type UpdatePricingRequest struct {
	InputPrice   *float64         `json:"inputPrice,omitempty"`
	OutputPrice  *float64         `json:"outputPrice,omitempty"`
	PricingUnit  *string          `json:"pricingUnit,omitempty"`
	UnitPrice    *json.RawMessage `json:"unitPrice,omitempty"`
	EffectiveTo  *string          `json:"effectiveTo,omitempty"`
}

type PricingResponse struct {
	ID            int64   `json:"id"`
	ModelCode     string  `json:"modelCode"`
	ProviderID    int64   `json:"providerId"`
	InputPrice    float64 `json:"inputPrice"`
	OutputPrice   float64 `json:"outputPrice"`
	EffectiveFrom string  `json:"effectiveFrom"`
	EffectiveTo   string  `json:"effectiveTo,omitempty"`
	CreatedAt     string  `json:"createdAt"`
	UpdatedAt     string  `json:"updatedAt"`
}
