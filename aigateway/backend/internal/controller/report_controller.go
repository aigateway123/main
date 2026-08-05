package controller

import (
	"log/slog"
	"net/http"
	"time"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

// ReportController handles admin billing report endpoints.
type ReportController struct {
	reportSvc *service.ReportService
	logger    *slog.Logger
}

func NewReportController(reportSvc *service.ReportService, logger *slog.Logger) *ReportController {
	return &ReportController{reportSvc: reportSvc, logger: logger}
}

// parseReportDates resolves the date range for a report request.
// It prioritizes the frontend `range` query (today/yesterday/7d/month),
// then falls back to explicit startDate/endDate params.
func parseReportDates(r *http.Request) (time.Time, time.Time, error) {
	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	switch r.URL.Query().Get("range") {
	case "today":
		return startOfDay, now, nil
	case "yesterday":
		yesterday := startOfDay.AddDate(0, 0, -1)
		return yesterday, startOfDay, nil
	case "7d":
		return startOfDay.AddDate(0, 0, -6), now, nil
	case "month":
		return time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()), now, nil
	}
	return service.ParseDateRange(r.URL.Query().Get("startDate"), r.URL.Query().Get("endDate"))
}

// HandleSummary handles GET /api/v1/billing/report/summary
func (c *ReportController) HandleSummary(w http.ResponseWriter, r *http.Request) {
	startDate, endDate, err := parseReportDates(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "REPORT001", err.Error())
		return
	}

	summary, err := c.reportSvc.GetSummary(r.Context(), startDate, endDate)
	if err != nil {
		c.logger.Error("get report summary failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get report summary failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.ReportSummary]{
		Code:    0,
		Message: "success",
		Data:    summary,
	})
}

// HandleRevenueTrend handles GET /api/v1/billing/report/revenue-trend
func (c *ReportController) HandleRevenueTrend(w http.ResponseWriter, r *http.Request) {
	startDate, endDate, err := parseReportDates(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "REPORT001", err.Error())
		return
	}

	trend, err := c.reportSvc.GetRevenueTrend(r.Context(), startDate, endDate)
	if err != nil {
		c.logger.Error("get revenue trend failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get revenue trend failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.DailyTrendPoint]{
		Code:    0,
		Message: "success",
		Data:    trend,
	})
}

// HandleByModel handles GET /api/v1/billing/report/by-model
func (c *ReportController) HandleByModel(w http.ResponseWriter, r *http.Request) {
	startDate, endDate, err := parseReportDates(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "REPORT001", err.Error())
		return
	}

	stats, err := c.reportSvc.GetByModel(r.Context(), startDate, endDate)
	if err != nil {
		c.logger.Error("get by model failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get by model failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.ModelStats]{
		Code:    0,
		Message: "success",
		Data:    stats,
	})
}

// HandleByUser handles GET /api/v1/billing/report/by-user
func (c *ReportController) HandleByUser(w http.ResponseWriter, r *http.Request) {
	startDate, endDate, err := parseReportDates(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "REPORT001", err.Error())
		return
	}

	stats, err := c.reportSvc.GetByUser(r.Context(), startDate, endDate)
	if err != nil {
		c.logger.Error("get by user failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get by user failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.UserStats]{
		Code:    0,
		Message: "success",
		Data:    stats,
	})
}

// HandleExport handles GET /api/v1/billing/report/export
func (c *ReportController) HandleExport(w http.ResponseWriter, r *http.Request) {
	startDate, endDate, err := parseReportDates(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, "REPORT001", err.Error())
		return
	}

	csvData, err := c.reportSvc.ExportCSV(r.Context(), startDate, endDate)
	if err != nil {
		c.logger.Error("export csv failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "export csv failed")
		return
	}

	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=billing_report.csv")
	w.WriteHeader(http.StatusOK)
	w.Write(csvData)
}
