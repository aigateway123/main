package dto

type CreateQuotaRequest struct {
	UserID      int64  `json:"userId"`
	ModelCode   string `json:"modelCode"`
	MaxTokens   int64  `json:"maxTokens"`
	MaxRequests int64  `json:"maxRequests"`
	ResetPeriod string `json:"resetPeriod"` // "daily" | "monthly" | "never"
}

type UpdateQuotaRequest struct {
	MaxTokens    *int64  `json:"maxTokens,omitempty"`
	MaxRequests  *int64  `json:"maxRequests,omitempty"`
	UsedTokens   *int64  `json:"usedTokens,omitempty"`
	UsedRequests *int64  `json:"usedRequests,omitempty"`
	ResetPeriod  *string `json:"resetPeriod,omitempty"`
}

type QuotaResponse struct {
	ID           int64  `json:"id"`
	UserID       int64  `json:"userId"`
	ModelCode    string `json:"modelCode"`
	MaxTokens    int64  `json:"maxTokens"`
	MaxRequests  int64  `json:"maxRequests"`
	UsedTokens   int64  `json:"usedTokens"`
	UsedRequests int64  `json:"usedRequests"`
	ResetPeriod  string `json:"resetPeriod"`
	CreatedAt    string `json:"createdAt"`
	UpdatedAt    string `json:"updatedAt"`
}
