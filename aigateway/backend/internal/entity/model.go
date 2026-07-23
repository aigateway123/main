package entity

import "time"

type Model struct {
	ID          int64      `json:"id"`
	ModelName   string     `json:"modelName"`
	ModelCode   string     `json:"modelCode"`
	ModelStatus string     `json:"modelStatus"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `json:"deletedAt,omitempty"`
}

type ModelProviderBinding struct {
	ID            int64      `json:"id"`
	ModelID       int64      `json:"modelId"`
	ProviderID    int64      `json:"providerId"`
	Weight        int        `json:"weight"`
	BindingStatus string     `json:"bindingStatus"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty"`
}
