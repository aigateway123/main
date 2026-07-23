package dto

type DashboardStatsResponse struct {
	TodayRequests  int     `json:"todayRequests"`
	TodayTokens    int     `json:"todayTokens"`
	TodayCost      float64 `json:"todayCost"`
	TotalRequests  int     `json:"totalRequests"`
	TotalTokens    int     `json:"totalTokens"`
	TotalCost      float64 `json:"totalCost"`
	AverageLatency float64 `json:"averageLatency"`
	ActiveApiKeys  int     `json:"activeApiKeys"`
	ActiveProviders int    `json:"activeProviders"`
}

type RequestLogResponse struct {
	ID            int64   `json:"id"`
	ModelCode     string  `json:"modelCode"`
	ProviderName  string  `json:"providerName"`
	InputTokens   int     `json:"inputTokens"`
	OutputTokens  int     `json:"outputTokens"`
	LatencyMs     int     `json:"latencyMs"`
	CostAmount    float64 `json:"costAmount"`
	RequestStatus string  `json:"requestStatus"`
	CreatedAt     string  `json:"createdAt"`
}
