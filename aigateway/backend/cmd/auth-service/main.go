package main

import (
	"net/http"

	"aigateway/backend/internal/config"
	"aigateway/backend/internal/controller"
	"aigateway/backend/internal/logger"
	"aigateway/backend/internal/middleware"
	"aigateway/backend/internal/repository"
	"aigateway/backend/internal/service"
)

func main() {
	cfg := config.Load("auth-service", "8083")
	appLogger := logger.New(cfg.LogLevel, cfg.ServiceName)

	healthRepo := repository.NewStaticHealthRepository(cfg.ServiceName, cfg.AppEnv)
	healthService := service.NewHealthService(healthRepo)
	healthController := controller.NewHealthController(healthService, appLogger)

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthController.HandleHealth)

	handler := middleware.RequestLogMiddleware(appLogger)(mux)

	appLogger.Info("service started", "port", cfg.Port)

	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		appLogger.Error("service stopped", "error", err)
	}
}
