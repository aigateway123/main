package entity

import "time"

type Provider struct {
	ID            int64      `json:"id"`
	ProviderName  string     `json:"providerName"`
	BaseURL       string     `json:"baseUrl"`
	APIKeyRef     string     `json:"apiKeyRef,omitempty"`
	APIPath       string     `json:"apiPath"`
	Priority      int        `json:"priority"`
	Weight        int        `json:"weight"`
	IsEnabledFlag bool       `json:"isEnabledFlag"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty"`
}
