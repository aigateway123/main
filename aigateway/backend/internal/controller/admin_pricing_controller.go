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

type AdminPricingController struct {
	svc    *service.PricingService
	logger *slog.Logger
}

func NewAdminPricingController(svc *service.PricingService, logger *slog.Logger) *AdminPricingController {
	return &AdminPricingController{svc: svc, logger: logger}
}

func (c *AdminPricingController) HandleList(w http.ResponseWriter, r *http.Request) {
	items, err := c.svc.List(r.Context())
	if err != nil {
		c.logger.Error("list pricing failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list pricing failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.AdminPricingItem]{
		Code:    0,
		Message: "success",
		Data:    items,
	})
}

func (c *AdminPricingController) HandleGet(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("modelId")
	modelID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid model id")
		return
	}

	item, err := c.svc.GetByModelID(r.Context(), modelID)
	if err != nil {
		switch err {
		case service.ErrModelNotFound:
			writeError(w, http.StatusNotFound, "VALID001", "model not found")
		default:
			c.logger.Error("get pricing failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "get pricing failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.AdminPricingItem]{
		Code:    0,
		Message: "success",
		Data:    item,
	})
}

func (c *AdminPricingController) HandleGetTemplates(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, types.APIResponse[[]*dto.PricingTemplate]{
		Code:    0,
		Message: "success",
		Data:    []*dto.PricingTemplate{},
	})
}

func (c *AdminPricingController) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("modelId")
	modelID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid model id")
		return
	}

	var req dto.AdminUpdatePricingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}
	if req.PricingType == "" || req.Currency == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	item, err := c.svc.UpdateByModelID(r.Context(), modelID, &req)
	if err != nil {
		switch err {
		case service.ErrModelNotFound:
			writeError(w, http.StatusNotFound, "VALID001", "model not found")
		default:
			c.logger.Error("update pricing failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "update pricing failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.AdminPricingItem]{
		Code:    0,
		Message: "success",
		Data:    item,
	})
}

