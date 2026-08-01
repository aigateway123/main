package controller

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strconv"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/service"
)

type QuotaController struct {
	svc    *service.PolicyService
	logger *slog.Logger
}

func NewQuotaController(svc *service.PolicyService, logger *slog.Logger) *QuotaController {
	return &QuotaController{svc: svc, logger: logger}
}

func (c *QuotaController) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateQuotaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	resp, err := c.svc.CreateQuota(r.Context(), &req)
	if err != nil {
		if errors.Is(err, service.ErrDuplicateName) {
			writeError(w, http.StatusConflict, "CONFLICT", "duplicate quota configuration")
			return
		}
		c.logger.Error("create quota failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "create quota failed")
		return
	}

	writeJSON(w, http.StatusCreated, resp)
}

func (c *QuotaController) HandleList(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("userID")
	var userID int64
	if userIDStr != "" {
		var err error
		userID, err = strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			writeError(w, http.StatusBadRequest, "VALID001", "invalid userID")
			return
		}
	}

	items, err := c.svc.ListQuotas(r.Context(), userID)
	if err != nil {
		c.logger.Error("list quotas failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list quotas failed")
		return
	}

	writeJSON(w, http.StatusOK, items)
}

func (c *QuotaController) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid id")
		return
	}

	var req dto.UpdateQuotaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	resp, err := c.svc.UpdateQuota(r.Context(), id, &req)
	if err != nil {
		if errors.Is(err, service.ErrQuotaNotFound) {
			writeError(w, http.StatusNotFound, "NOT_FOUND", "quota not found")
			return
		}
		c.logger.Error("update quota failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "update quota failed")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}
