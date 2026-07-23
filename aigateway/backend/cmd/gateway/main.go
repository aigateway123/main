package main

import (
	"log/slog"
	"net/http"
	"os"

	"aigateway/backend/internal/config"
	"aigateway/backend/internal/controller"
	"aigateway/backend/internal/database"
	"aigateway/backend/internal/logger"
	"aigateway/backend/internal/middleware"
	"aigateway/backend/internal/repository"
	"aigateway/backend/internal/service"
)

func main() {
	cfg := config.Load("gateway", "8080")
	appLogger := logger.New(cfg.LogLevel, cfg.ServiceName)

	// ---- Repositories (switchable by STORAGE_DRIVER) ----
	var (
		healthRepo   repository.HealthRepository
		userRepo     repository.UserRepository
		keyRepo      repository.ApiKeyRepository
		sessionRepo  repository.SessionRepository
		providerRepo repository.ProviderRepository
		modelRepo    repository.ModelRepository
		bindingRepo  repository.ModelBindingRepository
		logRepo      repository.RequestLogRepository
	)

	switch cfg.StorageDriver {
	case "postgres":
		// Open database/sql connection for migrations
		db, err := repository.NewPostgresDB(cfg.DatabaseURL)
		if err != nil {
			appLogger.Error("failed to connect to database", "error", err)
			os.Exit(1)
		}
		defer db.Close()

		// Run migrations
		if err := database.RunMigrations(db, "migrations"); err != nil {
			appLogger.Error("failed to run migrations", "error", err)
			os.Exit(1)
		}

		// Create pgxpool for repositories
		pool, err := repository.NewPostgresPool(cfg.DatabaseURL)
		if err != nil {
			appLogger.Error("failed to create connection pool", "error", err)
			os.Exit(1)
		}
		defer pool.Close()

		// Create PostgreSQL repositories
		healthRepo = repository.NewStaticHealthRepository(cfg.ServiceName, cfg.AppEnv)
		userRepo = repository.NewPostgresUserRepository(pool)
		keyRepo = repository.NewPostgresApiKeyRepository(pool)
		sessionRepo = repository.NewPostgresSessionRepository(pool)
		providerRepo = repository.NewPostgresProviderRepository(pool)
		modelRepo = repository.NewPostgresModelRepository(pool)
		bindingRepo = repository.NewPostgresModelBindingRepository(pool)
		logRepo = repository.NewPostgresRequestLogRepository(pool)

	default: // "memory"
		healthRepo = repository.NewStaticHealthRepository(cfg.ServiceName, cfg.AppEnv)
		userRepo = repository.NewInMemoryUserRepository()
		keyRepo = repository.NewInMemoryApiKeyRepository()
		sessionRepo = repository.NewInMemorySessionRepository()
		providerRepo = repository.NewInMemoryProviderRepository()
		modelRepo = repository.NewInMemoryModelRepository()
		bindingRepo = repository.NewInMemoryModelBindingRepository()
		logRepo = repository.NewInMemoryRequestLogRepository()
	}

	// ---- Services ----
	healthSvc := service.NewHealthService(healthRepo)
	authSvc := service.NewAuthService(userRepo, sessionRepo, appLogger, cfg.JWTSecret)
	apiKeySvc := service.NewApiKeyService(keyRepo, userRepo, appLogger)
	providerSvc := service.NewProviderService(providerRepo, appLogger)
	modelSvc := service.NewModelService(modelRepo, bindingRepo, providerRepo, appLogger)
	usageSvc := service.NewUsageService(logRepo, keyRepo, providerRepo, appLogger)
	routerSvc := service.NewRouterService(modelRepo, bindingRepo, providerRepo, keyRepo, appLogger)

	// ---- Controllers ----
	healthCtrl := controller.NewHealthController(healthSvc, appLogger)
	authCtrl := controller.NewAuthController(authSvc, appLogger)
	apiKeyCtrl := controller.NewApiKeyController(apiKeySvc, appLogger)
	providerCtrl := controller.NewProviderController(providerSvc, appLogger)
	modelCtrl := controller.NewModelController(modelSvc, appLogger)
	usageCtrl := controller.NewUsageController(usageSvc, appLogger)
	chatCtrl := controller.NewChatController(routerSvc, usageSvc, appLogger)

	// ---- Router ----
	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("/health", healthCtrl.HandleHealth)
	mux.HandleFunc("POST /api/v1/auth/register", authCtrl.HandleRegister)
	mux.HandleFunc("POST /api/v1/auth/login", authCtrl.HandleLogin)

	// OpenAI-compatible chat completions (API Key auth, not JWT)
	mux.HandleFunc("POST /api/v1/chat/completions", chatCtrl.HandleChatCompletions)

	// Protected routes (JWT required)
	protectedMux := http.NewServeMux()
	protectedMux.HandleFunc("GET /api/v1/auth/profile", authCtrl.HandleProfile)
	protectedMux.HandleFunc("POST /api/v1/api-keys", apiKeyCtrl.HandleCreate)
	protectedMux.HandleFunc("GET /api/v1/api-keys", apiKeyCtrl.HandleList)
	protectedMux.HandleFunc("PATCH /api/v1/api-keys/{id}/revoke", apiKeyCtrl.HandleRevoke)

	protectedMux.HandleFunc("POST /api/v1/providers", providerCtrl.HandleCreate)
	protectedMux.HandleFunc("GET /api/v1/providers", providerCtrl.HandleList)
	protectedMux.HandleFunc("GET /api/v1/providers/{id}", providerCtrl.HandleGetByID)
	protectedMux.HandleFunc("PUT /api/v1/providers/{id}", providerCtrl.HandleUpdate)
	protectedMux.HandleFunc("DELETE /api/v1/providers/{id}", providerCtrl.HandleDelete)

	protectedMux.HandleFunc("POST /api/v1/models", modelCtrl.HandleCreate)
	protectedMux.HandleFunc("GET /api/v1/models", modelCtrl.HandleList)
	protectedMux.HandleFunc("GET /api/v1/models/{id}", modelCtrl.HandleGetByID)
	protectedMux.HandleFunc("PUT /api/v1/models/{id}", modelCtrl.HandleUpdate)
	protectedMux.HandleFunc("DELETE /api/v1/models/{id}", modelCtrl.HandleDelete)
	protectedMux.HandleFunc("POST /api/v1/models/{id}/bind", modelCtrl.HandleBindProvider)
	protectedMux.HandleFunc("DELETE /api/v1/bindings/{id}", modelCtrl.HandleUnbindProvider)

	protectedMux.HandleFunc("GET /api/v1/dashboard", usageCtrl.HandleDashboard)
	protectedMux.HandleFunc("GET /api/v1/dashboard/recent-logs", usageCtrl.HandleRecentLogs)
	protectedMux.HandleFunc("GET /api/v1/usage/logs", usageCtrl.HandleListLogs)
	protectedMux.HandleFunc("POST /api/v1/usage/logs", usageCtrl.HandleRecordLog)

	authMiddleware := middleware.AuthMiddleware(authSvc, appLogger)
	mux.Handle("/api/v1/auth/profile", authMiddleware(protectedMux))
	mux.Handle("/api/v1/api-keys", authMiddleware(protectedMux))
	mux.Handle("/api/v1/api-keys/", authMiddleware(protectedMux))
	mux.Handle("/api/v1/providers", authMiddleware(protectedMux))
	mux.Handle("/api/v1/providers/", authMiddleware(protectedMux))
	mux.Handle("/api/v1/models", authMiddleware(protectedMux))
	mux.Handle("/api/v1/models/", authMiddleware(protectedMux))
	mux.Handle("/api/v1/bindings/", authMiddleware(protectedMux))
	mux.Handle("/api/v1/dashboard", authMiddleware(protectedMux))
	mux.Handle("/api/v1/dashboard/", authMiddleware(protectedMux))
	mux.Handle("/api/v1/usage/", authMiddleware(protectedMux))

	// ---- Middleware chain ----
	handler := middleware.RequestLogMiddleware(appLogger)(mux)
	handler = middleware.CORSMiddleware(handler)

	appLogger.Info("service started",
		slog.String("service", cfg.ServiceName),
		slog.String("port", cfg.Port),
		slog.String("env", cfg.AppEnv),
		slog.String("storage", cfg.StorageDriver),
	)

	addr := ":" + cfg.Port
	appLogger.Info("listening", slog.String("addr", addr))
	if err := http.ListenAndServe(addr, handler); err != nil {
		appLogger.Error("service stopped", slog.Any("error", err))
	}
}
