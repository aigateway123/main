package controller

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/service"
)

type HealthController struct {
	service *service.HealthService
	logger  *slog.Logger
}

func NewHealthController(service *service.HealthService, logger *slog.Logger) *HealthController {
	return &HealthController{
		service: service,
		logger:  logger,
	}
}

func (c *HealthController) HandleHealth(w http.ResponseWriter, r *http.Request) {
	health, err := c.service.Check(r.Context())
	if err != nil {
		c.logger.Error("health check failed", "error", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	response := dto.HealthResponse{
		Code:    0,
		Message: "success",
		Data: dto.HealthResponseData{
			Service: health.Service,
			Status:  health.Status,
			Env:     health.Env,
		},
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		c.logger.Error("failed to encode response", "error", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}
