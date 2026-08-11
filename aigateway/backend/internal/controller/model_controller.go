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

type ModelController struct {
	svc      *service.ModelService
	rbacSvc  *service.RBACService
	routerSvc *service.RouterService
	logger   *slog.Logger
}

func NewModelController(svc *service.ModelService, rbacSvc *service.RBACService, routerSvc *service.RouterService, logger *slog.Logger) *ModelController {
	return &ModelController{svc: svc, rbacSvc: rbacSvc, routerSvc: routerSvc, logger: logger}
}

func (c *ModelController) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateModelRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	result, err := c.svc.Create(r.Context(), &req)
	if err != nil {
		c.logger.Error("create model failed", "error", err)
		switch err {
		case service.ErrDuplicateModelCode:
			writeError(w, http.StatusConflict, "VALID001", "model code already exists")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "create model failed")
		}
		return
	}

	writeJSON(w, http.StatusCreated, types.APIResponse[*dto.ModelResponse]{
		Code: 0, Message: "success", Data: result,
	})
}

func (c *ModelController) HandleList(w http.ResponseWriter, r *http.Request) {
	modelType := r.URL.Query().Get("modelType")

	// Admin sees all models; other roles only see granted models.
	var items []*dto.ModelResponse
	var err error
	userID, ok := UserIDFromContext(r.Context())
	isAdmin := false
	if ok && c.rbacSvc != nil {
		if has, perr := c.rbacSvc.HasPermission(r.Context(), userID, "admin:model:manage"); perr == nil && has {
			isAdmin = true
		}
	}
	if ok && !isAdmin {
		items, err = c.svc.ListForUser(r.Context(), userID, modelType)
	} else {
		items, err = c.svc.List(r.Context(), modelType)
	}
	if err != nil {
		c.logger.Error("list models failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list models failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.ModelResponse]{
		Code: 0, Message: "success", Data: items,
	})
}

func (c *ModelController) HandleGetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid model id")
		return
	}

	// Non-admin users may only view granted models.
	userID, ok := UserIDFromContext(r.Context())
	isAdmin := false
	if ok && c.rbacSvc != nil {
		if has, perr := c.rbacSvc.HasPermission(r.Context(), userID, "admin:model:manage"); perr == nil && has {
			isAdmin = true
		}
	}
	if ok && !isAdmin {
		models, lerr := c.svc.ListForUser(r.Context(), userID, "")
		if lerr == nil {
			found := false
			for _, m := range models {
				if m.ID == id {
					found = true
					break
				}
			}
			if !found {
				writeError(w, http.StatusNotFound, "AUTH002", "model not found")
				return
			}
		}
	}

	result, err := c.svc.GetByID(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusNotFound, "AUTH002", "model not found")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.ModelDetailResponse]{
		Code: 0, Message: "success", Data: result,
	})
}

func (c *ModelController) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid model id")
		return
	}

	var req dto.UpdateModelRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	result, err := c.svc.Update(r.Context(), id, &req)
	if err != nil {
		c.logger.Error("update model failed", "error", err)
		switch err {
		case service.ErrModelNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "model not found")
		case service.ErrDuplicateModelCode:
			writeError(w, http.StatusConflict, "VALID001", "model code already exists")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "update failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.ModelResponse]{
		Code: 0, Message: "success", Data: result,
	})
}

func (c *ModelController) HandleBindProvider(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	modelID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid model id")
		return
	}

	var req dto.BindProviderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if err := c.svc.BindProvider(r.Context(), modelID, &req); err != nil {
		c.logger.Error("bind provider failed", "error", err)
		switch err {
		case service.ErrModelNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "model not found")
		case service.ErrProviderNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "provider not found")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "bind provider failed")
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (c *ModelController) HandleUnbindProvider(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	bindingID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid binding id")
		return
	}

	if err := c.svc.UnbindProvider(r.Context(), bindingID); err != nil {
		c.logger.Error("unbind provider failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "unbind provider failed")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (c *ModelController) HandleDelete(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid model id")
		return
	}

	if err := c.svc.Delete(r.Context(), id); err != nil {
		c.logger.Error("delete model failed", "error", err)
		switch err {
		case service.ErrModelNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "model not found")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "delete model failed")
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
