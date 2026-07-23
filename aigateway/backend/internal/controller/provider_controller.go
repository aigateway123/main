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

type ProviderController struct {
	svc    *service.ProviderService
	logger *slog.Logger
}

func NewProviderController(svc *service.ProviderService, logger *slog.Logger) *ProviderController {
	return &ProviderController{svc: svc, logger: logger}
}

func (c *ProviderController) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateProviderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	result, err := c.svc.Create(r.Context(), &req)
	if err != nil {
		c.logger.Error("create provider failed", "error", err)
		switch err {
		case service.ErrDuplicateName:
			writeError(w, http.StatusConflict, "VALID001", "provider name already exists")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "create provider failed")
		}
		return
	}

	writeJSON(w, http.StatusCreated, types.APIResponse[*dto.ProviderResponse]{
		Code: 0, Message: "success", Data: result,
	})
}

func (c *ProviderController) HandleList(w http.ResponseWriter, r *http.Request) {
	items, err := c.svc.List(r.Context())
	if err != nil {
		c.logger.Error("list providers failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list providers failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.ProviderResponse]{
		Code: 0, Message: "success", Data: items,
	})
}

func (c *ProviderController) HandleGetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid provider id")
		return
	}

	result, err := c.svc.GetByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "AUTH002", "provider not found")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.ProviderResponse]{
		Code: 0, Message: "success", Data: result,
	})
}

func (c *ProviderController) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid provider id")
		return
	}

	var req dto.UpdateProviderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	result, err := c.svc.Update(r.Context(), id, &req)
	if err != nil {
		c.logger.Error("update provider failed", "error", err)
		switch err {
		case service.ErrProviderNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "provider not found")
		case service.ErrDuplicateName:
			writeError(w, http.StatusConflict, "VALID001", "name already exists")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "update failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.ProviderResponse]{
		Code: 0, Message: "success", Data: result,
	})
}

func (c *ProviderController) HandleDelete(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid provider id")
		return
	}

	if err := c.svc.Delete(r.Context(), id); err != nil {
		c.logger.Error("delete provider failed", "error", err)
		switch err {
		case service.ErrProviderNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "provider not found")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "delete provider failed")
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
