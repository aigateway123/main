package entity

import "time"

// CostRecord 预定义供后续持久化使用，MVP 阶段成本金额直接写入 RequestLog.CostAmount
type CostRecord struct {
	ID            int64     `json:"id"`
	UserID        int64     `json:"userId"`
	RequestLogID  int64     `json:"requestLogId"`
	InputTokens   int       `json:"inputTokens"`
	OutputTokens  int       `json:"outputTokens"`
	CostAmount    float64   `json:"costAmount"`
	RevenueAmount float64   `json:"revenueAmount"`
	CreatedAt     time.Time `json:"createdAt"`
}
