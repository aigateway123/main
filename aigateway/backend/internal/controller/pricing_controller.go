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

type PricingController struct {
	svc    *service.PolicyService
	logger *slog.Logger
}

func NewPricingController(svc *service.PolicyService, logger *slog.Logger) *PricingController {
	return &PricingController{svc: svc, logger: logger}
}

func (c *PricingController) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var req dto.CreatePricingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	resp, err := c.svc.CreatePricing(r.Context(), &req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidArgument) {
			writeError(w, http.StatusBadRequest, "VALID001", "invalid effective_from format, use RFC3339")
			return
		}
		if errors.Is(err, service.ErrDuplicateName) {
			writeError(w, http.StatusConflict, "CONFLICT", "duplicate pricing configuration")
			return
		}
		c.logger.Error("create pricing failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "create pricing failed")
		return
	}

	writeJSON(w, http.StatusCreated, resp)
}

func (c *PricingController) HandleList(w http.ResponseWriter, r *http.Request) {
	items, err := c.svc.ListPricing(r.Context())
	if err != nil {
		c.logger.Error("list pricing failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list pricing failed")
		return
	}

	writeJSON(w, http.StatusOK, items)
}

func (c *PricingController) HandleUpdate(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid id")
		return
	}

	var req dto.UpdatePricingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	resp, err := c.svc.UpdatePricing(r.Context(), id, &req)
	if err != nil {
		if errors.Is(err, service.ErrPricingNotFound) {
			writeError(w, http.StatusNotFound, "NOT_FOUND", "pricing not found")
			return
		}
		if errors.Is(err, service.ErrInvalidArgument) {
			writeError(w, http.StatusBadRequest, "VALID001", "invalid effective_to format, use RFC3339")
			return
		}
		c.logger.Error("update pricing failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "update pricing failed")
		return
	}

	writeJSON(w, http.StatusOK, resp)
}
