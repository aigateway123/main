package entity

import "time"

type Pricing struct {
	ID            int64      `json:"id"`
	ModelCode     string     `json:"modelCode"`
	ProviderID    int64      `json:"providerId"`
	InputPrice    float64    `json:"inputPrice"`    // per token
	OutputPrice   float64    `json:"outputPrice"`   // per token
	EffectiveFrom time.Time  `json:"effectiveFrom"`
	EffectiveTo   *time.Time `json:"effectiveTo,omitempty"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty"`
}
