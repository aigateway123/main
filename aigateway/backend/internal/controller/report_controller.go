package controller

import (
	"log/slog"
	"net/http"

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

// HandleSummary handles GET /api/v1/billing/report/summary
func (c *ReportController) HandleSummary(w http.ResponseWriter, r *http.Request) {
	startDateStr := r.URL.Query().Get("startDate")
	endDateStr := r.URL.Query().Get("endDate")

	startDate, endDate, err := service.ParseDateRange(startDateStr, endDateStr)
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
	startDateStr := r.URL.Query().Get("startDate")
	endDateStr := r.URL.Query().Get("endDate")

	startDate, endDate, err := service.ParseDateRange(startDateStr, endDateStr)
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
	startDateStr := r.URL.Query().Get("startDate")
	endDateStr := r.URL.Query().Get("endDate")

	startDate, endDate, err := service.ParseDateRange(startDateStr, endDateStr)
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
	startDateStr := r.URL.Query().Get("startDate")
	endDateStr := r.URL.Query().Get("endDate")

	startDate, endDate, err := service.ParseDateRange(startDateStr, endDateStr)
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
	startDateStr := r.URL.Query().Get("startDate")
	endDateStr := r.URL.Query().Get("endDate")

	startDate, endDate, err := service.ParseDateRange(startDateStr, endDateStr)
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
