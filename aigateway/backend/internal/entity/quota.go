package entity

import "time"

type Quota struct {
	ID           int64     `json:"id"`
	UserID       int64     `json:"userId"`
	ModelCode    string    `json:"modelCode"`   // empty = global
	MaxTokens    int64     `json:"maxTokens"`    // 0 = unlimited
	MaxRequests  int64     `json:"maxRequests"`  // 0 = unlimited
	UsedTokens   int64     `json:"usedTokens"`
	UsedRequests int64     `json:"usedRequests"`
	ResetPeriod  string    `json:"resetPeriod"`  // "daily" | "monthly" | "never"
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
