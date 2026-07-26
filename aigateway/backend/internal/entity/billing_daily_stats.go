package entity

import "time"

type BillingDailyStats struct {
	ID           int64     `json:"id"`
	StatDate     time.Time `json:"statDate"`
	UserID       int64     `json:"userId"`
	ModelID      int64     `json:"modelId"`
	RequestCount int       `json:"requestCount"`
	InputTokens  int64     `json:"inputTokens"`
	OutputTokens int64     `json:"outputTokens"`
	TotalRevenue float64   `json:"totalRevenue"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
