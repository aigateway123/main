package controller

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

type UsageController struct {
	svc    *service.UsageService
	logger *slog.Logger
}

func NewUsageController(svc *service.UsageService, logger *slog.Logger) *UsageController {
	return &UsageController{svc: svc, logger: logger}
}

func (c *UsageController) HandleDashboard(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	stats, err := c.svc.Dashboard(r.Context(), userID)
	if err != nil {
		c.logger.Error("dashboard failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "dashboard failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.DashboardStatsResponse]{
		Code: 0, Message: "success", Data: stats,
	})
}

func (c *UsageController) HandleRecentLogs(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	logs, err := c.svc.RecentLogs(r.Context(), userID, 10)
	if err != nil {
		c.logger.Error("recent logs failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "recent logs failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.RequestLogResponse]{
		Code: 0, Message: "success", Data: logs,
	})
}

func (c *UsageController) HandleListLogs(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
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

	logs, total, err := c.svc.ListLogs(r.Context(), userID, page, pageSize)
	if err != nil {
		c.logger.Error("list logs failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list logs failed")
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

func (c *UsageController) HandleRecordLog(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	var log entity.RequestLog
	if err := json.NewDecoder(r.Body).Decode(&log); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	log.UserID = userID

	if err := c.svc.RecordLog(r.Context(), &log); err != nil {
		c.logger.Error("record log failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "record log failed")
		return
	}

	w.WriteHeader(http.StatusCreated)
}
