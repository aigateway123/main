package controller

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

type ApiKeyController struct {
	svc    *service.ApiKeyService
	logger *slog.Logger
}

func NewApiKeyController(svc *service.ApiKeyService, logger *slog.Logger) *ApiKeyController {
	return &ApiKeyController{svc: svc, logger: logger}
}

func (c *ApiKeyController) HandleCreate(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	var req dto.CreateApiKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	result, err := c.svc.Create(r.Context(), userID, &req)
	if err != nil {
		c.logger.Error("create api key failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "create api key failed")
		return
	}

	writeJSON(w, http.StatusCreated, types.APIResponse[*dto.ApiKeyResponse]{
		Code:    0,
		Message: "success",
		Data:    result,
	})
}

func (c *ApiKeyController) HandleList(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	keys, err := c.svc.ListByUser(r.Context(), userID)
	if err != nil {
		c.logger.Error("list api keys failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list api keys failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.ApiKeyResponse]{
		Code:    0,
		Message: "success",
		Data:    keys,
	})
}

func (c *ApiKeyController) HandleRevoke(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	idStr := r.PathValue("id")
	if idStr == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "missing api key id")
		return
	}

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid api key id")
		return
	}

	if err := c.svc.Revoke(r.Context(), id, userID); err != nil {
		c.logger.Error("revoke api key failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "revoke api key failed")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
