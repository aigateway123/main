package dto

// ReportSummary 全平台费用总览
type ReportSummary struct {
	Today struct {
		Revenue      float64 `json:"revenue"`
		RequestCount int     `json:"requestCount"`
	} `json:"today"`
	CurrentMonth struct {
		Revenue      float64 `json:"revenue"`
		RequestCount int     `json:"requestCount"`
	} `json:"currentMonth"`
}

// DailyTrendPoint 每日趋势点
type DailyTrendPoint struct {
	Date    string  `json:"date"`
	Revenue float64 `json:"revenue"`
}

// ModelStats 模型维度统计
type ModelStats struct {
	ModelID      int64   `json:"modelId"`
	ModelName    string  `json:"modelName"`
	RequestCount int     `json:"requestCount"`
	InputTokens  int64   `json:"inputTokens"`
	OutputTokens int64   `json:"outputTokens"`
	Revenue      float64 `json:"revenue"`
}

// UserStats 用户维度统计
type UserStats struct {
	UserID       int64   `json:"userId"`
	Email        string  `json:"email"`
	RequestCount int     `json:"requestCount"`
	Revenue      float64 `json:"revenue"`
}

// UserUsageSummary 学生个人用量总览
type UserUsageSummary struct {
	TodayRevenue float64 `json:"todayRevenue"`
	MonthRevenue float64 `json:"monthRevenue"`
	TotalRevenue float64 `json:"totalRevenue"`
}

// UsageDetailItem 学生个人用量明细项
type UsageDetailItem struct {
	Timestamp    string  `json:"timestamp"`
	ModelName    string  `json:"modelName"`
	InputTokens  int     `json:"inputTokens"`
	OutputTokens int     `json:"outputTokens"`
	Cost         float64 `json:"cost"`
}
