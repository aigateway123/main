package dto

type ProfitResponse struct {
	TotalRevenue  float64 `json:"totalRevenue"`
	TotalCost     float64 `json:"totalCost"`
	TotalProfit   float64 `json:"totalProfit"`
	TodayRevenue  float64 `json:"todayRevenue"`
	TodayCost     float64 `json:"todayCost"`
	TodayProfit   float64 `json:"todayProfit"`
	ProfitMargin  float64 `json:"profitMargin"` // 利润率 %
}
