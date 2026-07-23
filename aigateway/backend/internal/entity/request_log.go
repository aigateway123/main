package entity

import "time"

type RequestLog struct {
	ID           int64     `json:"id"`
	UserID       int64     `json:"userId"`
	ApiKeyID     int64     `json:"apiKeyId"`
	ModelID      int64     `json:"modelId"`
	ProviderID   int64     `json:"providerId"`
	ModelCode    string    `json:"modelCode"`
	ProviderName string    `json:"providerName"`
	InputTokens  int       `json:"inputTokens"`
	OutputTokens int       `json:"outputTokens"`
	LatencyMs    int       `json:"latencyMs"`
	CostAmount   float64   `json:"costAmount"`
	RequestStatus string   `json:"requestStatus"`
	CreatedAt    time.Time `json:"createdAt"`
}
