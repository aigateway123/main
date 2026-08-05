package controller

import (
	"log/slog"
	"net/http"
	"strconv"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

type BillingController struct {
	billingSvc *service.BillingService
	reportSvc  *service.ReportService
	logger     *slog.Logger
}

func NewBillingController(billingSvc *service.BillingService, logger *slog.Logger) *BillingController {
	return &BillingController{billingSvc: billingSvc, logger: logger}
}

// SetReportService sets the report service for student billing endpoints.
func (c *BillingController) SetReportService(reportSvc *service.ReportService) {
	c.reportSvc = reportSvc
}

// HandleGetQuota handles GET /api/v1/billing/quota
func (c *BillingController) HandleGetQuota(w http.ResponseWriter, r *http.Request) {
	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
		return
	}

	quotaBalance, totalSpent, totalAllocated, err := c.billingSvc.GetQuota(r.Context(), userID)
	if err != nil {
		c.logger.Error("get quota failed", "error", err)
		switch err {
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "get quota failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"quotaBalance":   quotaBalance,
			"totalSpent":     totalSpent,
			"totalAllocated": totalAllocated,
		},
	})
}

// HandleGetUsage handles GET /api/v1/billing/usage
func (c *BillingController) HandleGetUsage(w http.ResponseWriter, r *http.Request) {
	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
		return
	}

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	startDate := r.URL.Query().Get("startDate")
	endDate := r.URL.Query().Get("endDate")
	modelCode := r.URL.Query().Get("modelCode")

	logs, total, err := c.billingSvc.GetUsage(r.Context(), userID, page, pageSize, startDate, endDate, modelCode)
	if err != nil {
		c.logger.Error("get usage failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get usage failed")
		return
	}

	totalPages := total / pageSize
	if total%pageSize > 0 {
		totalPages++
	}

	items := make([]map[string]interface{}, 0, len(logs))
	for _, l := range logs {
		items = append(items, logToUsageItem(l))
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"items": items,
			"pagination": map[string]int{
				"page":       page,
				"pageSize":   pageSize,
				"total":      total,
				"totalPages": totalPages,
			},
		},
	})
}

// HandleAdminSummary handles GET /api/v1/billing/admin/summary
func (c *BillingController) HandleAdminSummary(w http.ResponseWriter, r *http.Request) {
	stats, err := c.billingSvc.GetAdminSummary(r.Context())
	if err != nil {
		c.logger.Error("get admin summary failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get admin summary failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"totalUsers":   stats.TotalUsers,
			"activeUsers":  stats.ActiveUsers,
			"totalRequests": stats.TotalRequests,
			"todayRequests": stats.TodayRequests,
			"todayCost":    stats.TodayCost,
			"totalCost":    stats.TotalCost,
			"totalTokens":  stats.TotalTokens,
			"todayTokens":  stats.TodayTokens,
			"costByModel":  stats.CostByModel,
		},
	})
}

// HandleAdminUsage handles GET /api/v1/billing/admin/usage
func (c *BillingController) HandleAdminUsage(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	var filterUserID int64
	if uidStr := r.URL.Query().Get("userId"); uidStr != "" {
		filterUserID, _ = strconv.ParseInt(uidStr, 10, 64)
	}
	startDate := r.URL.Query().Get("startDate")
	endDate := r.URL.Query().Get("endDate")
	status := r.URL.Query().Get("status")

	logs, total, err := c.billingSvc.GetAdminUsageItems(r.Context(), filterUserID, page, pageSize, startDate, endDate, status)
	if err != nil {
		c.logger.Error("get admin usage failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get admin usage failed")
		return
	}

	totalPages := total / pageSize
	if total%pageSize > 0 {
		totalPages++
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"items": logs,
			"pagination": map[string]int{
				"page":       page,
				"pageSize":   pageSize,
				"total":      total,
				"totalPages": totalPages,
			},
		},
	})
}

func logToUsageItem(l *entity.RequestLog) map[string]interface{} {
	return map[string]interface{}{
		"id":            l.ID,
		"modelCode":     l.ModelCode,
		"providerName":  l.ProviderName,
		"inputTokens":   l.InputTokens,
		"outputTokens":  l.OutputTokens,
		"latencyMs":     l.LatencyMs,
		"costAmount":    l.CostAmount,
		"requestStatus": l.RequestStatus,
		"createdAt":     l.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// HandleMyUsageSummary handles GET /api/v1/billing/my/usage-summary
func (c *BillingController) HandleMyUsageSummary(w http.ResponseWriter, r *http.Request) {
	if c.reportSvc == nil {
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "report service not available")
		return
	}

	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
		return
	}

	summary, err := c.reportSvc.GetUserUsageSummary(r.Context(), userID)
	if err != nil {
		c.logger.Error("get my usage summary failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get usage summary failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.UserUsageSummary]{
		Code:    0,
		Message: "success",
		Data:    summary,
	})
}

// HandleMyUsageTrend handles GET /api/v1/billing/my/usage-trend?days=7
func (c *BillingController) HandleMyUsageTrend(w http.ResponseWriter, r *http.Request) {
	if c.reportSvc == nil {
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "report service not available")
		return
	}

	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
		return
	}

	days := 7
	if daysStr := r.URL.Query().Get("days"); daysStr != "" {
		if parsed, err := strconv.Atoi(daysStr); err == nil && parsed > 0 && parsed <= 365 {
			days = parsed
		}
	}

	trend, err := c.reportSvc.GetUserUsageTrend(r.Context(), userID, days)
	if err != nil {
		c.logger.Error("get my usage trend failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get usage trend failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.DailyTrendPoint]{
		Code:    0,
		Message: "success",
		Data:    trend,
	})
}

// HandleMyUsageDetail handles GET /api/v1/billing/my/usage-detail?page=1&pageSize=20
func (c *BillingController) HandleMyUsageDetail(w http.ResponseWriter, r *http.Request) {
	if c.reportSvc == nil {
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "report service not available")
		return
	}

	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
		return
	}

	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	items, total, err := c.reportSvc.GetUserUsageDetail(r.Context(), userID, page, pageSize, r.URL.Query().Get("startDate"), r.URL.Query().Get("endDate"))
	if err != nil {
		c.logger.Error("get my usage detail failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get usage detail failed")
		return
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"items": items,
			"pagination": map[string]int{
				"page":       page,
				"pageSize":   pageSize,
				"total":      int(total),
				"totalPages": totalPages,
			},
		},
	})
}
