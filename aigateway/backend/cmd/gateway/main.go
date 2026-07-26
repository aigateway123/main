package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"

	"aigateway/backend/internal/config"
	"aigateway/backend/internal/controller"
	"aigateway/backend/internal/database"
	"aigateway/backend/internal/entity"
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
		healthRepo      repository.HealthRepository
		userRepo        repository.UserRepository
		keyRepo         repository.ApiKeyRepository
		sessionRepo     repository.SessionRepository
		providerRepo    repository.ProviderRepository
		modelRepo       repository.ModelRepository
		bindingRepo     repository.ModelBindingRepository
		logRepo         repository.RequestLogRepository
		rbacRepo        repository.RBACRepository
		billingRepo     repository.BillingRepository
		pricingRepo     repository.ModelPricingRepository
		userModelPermRepo repository.UserModelPermissionRepository
		adminUserRepo   repository.AdminUserRepository
		reportRepo      repository.ReportRepository
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
		rbacRepo = repository.NewPostgresRBACRepository(pool)
		billingRepo = repository.NewPostgresBillingRepository(pool)
		pricingRepo = repository.NewPostgresModelPricingRepository(pool)
		userModelPermRepo = repository.NewPostgresUserModelPermissionRepository(pool)
		adminUserRepo = repository.NewPostgresAdminUserRepository(pool)
		reportRepo = repository.NewPostgresReportRepository(pool)

	default: // "memory"
		inMemUserRepo := repository.NewInMemoryUserRepository()
		inMemLogRepo := repository.NewInMemoryRequestLogRepository()
		healthRepo = repository.NewStaticHealthRepository(cfg.ServiceName, cfg.AppEnv)
		userRepo = inMemUserRepo
		keyRepo = repository.NewInMemoryApiKeyRepository()
		sessionRepo = repository.NewInMemorySessionRepository()
		providerRepo = repository.NewInMemoryProviderRepository()
		modelRepo = repository.NewInMemoryModelRepository()
		bindingRepo = repository.NewInMemoryModelBindingRepository()
		logRepo = inMemLogRepo
		rbacRepo = repository.NewInMemoryRBACRepository()
		billingRepo = repository.NewInMemoryBillingRepository(inMemUserRepo, inMemLogRepo)
		pricingRepo = repository.NewInMemoryModelPricingRepository()
		userModelPermRepo = repository.NewInMemoryUserModelPermissionRepository()
		adminUserRepo = repository.NewInMemoryAdminUserRepository(inMemUserRepo)
		reportRepo = repository.NewInMemoryReportRepository(inMemLogRepo, inMemUserRepo)
	}

	// ---- Seed data for in-memory mode ----
	if cfg.StorageDriver != "postgres" {
		ctx := context.Background()
		now := time.Now()

		// Seed admin user: admin@nova.com / admin123
		adminHash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		adminRoleID := int64(1) // Admin role ID from InMemoryRBACRepository
		adminUser := &entity.User{
			Email:        "admin@nova.com",
			Nickname:     "Admin",
			PasswordHash: string(adminHash),
			UserStatus:   "active",
			RoleID:       &adminRoleID,
			QuotaBalance: 1000,
			CreatedAt:    now,
			UpdatedAt:    now,
		}
		_ = userRepo.Create(ctx, adminUser)

		// Seed models (matching prototype mock data)
		models := []*entity.Model{
			{ModelName: "GPT-4o Omni", ModelCode: "gpt-4o", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
			{ModelName: "DeepSeek V3", ModelCode: "deepseek-v3", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
			{ModelName: "Claude 3.5 Sonnet", ModelCode: "claude-3-5-sonnet", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
			{ModelName: "GPT-4o Mini", ModelCode: "gpt-4o-mini", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
			{ModelName: "Qwen 2.5 72B", ModelCode: "qwen-2-5-72b", ModelStatus: "inactive", CreatedAt: now, UpdatedAt: now},
		}
		modelIDs := make(map[string]int64)
		for _, m := range models {
			_ = modelRepo.Create(ctx, m)
		}
		// Reload to get auto-assigned IDs
		allModels, _ := modelRepo.List(ctx)
		for _, m := range allModels {
			modelIDs[m.ModelCode] = m.ID
		}

		// Seed providers (matching prototype mock data)
		providers := []*entity.Provider{
			{ProviderName: "OpenAI", BaseURL: "https://api.openai.com", APIPath: "/v1/chat/completions", Priority: 1, Weight: 100, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
			{ProviderName: "DeepSeek", BaseURL: "https://api.deepseek.com", APIPath: "/v1/chat/completions", Priority: 1, Weight: 90, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
			{ProviderName: "Anthropic", BaseURL: "https://api.anthropic.com", APIPath: "/v1/messages", Priority: 2, Weight: 80, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
		}
		providerIDs := make(map[string]int64)
		for _, p := range providers {
			_ = providerRepo.Create(ctx, p)
		}
		allProviders, _ := providerRepo.List(ctx)
		for _, p := range allProviders {
			providerIDs[p.ProviderName] = p.ID
		}

		// Seed model-provider bindings (matching prototype)
		bindings := []struct {
			modelCode   string
			providerName string
			weight      int
		}{
			{"gpt-4o", "OpenAI", 80},
			{"gpt-4o", "DeepSeek", 20},
			{"deepseek-v3", "DeepSeek", 100},
			{"claude-3-5-sonnet", "Anthropic", 100},
			{"gpt-4o-mini", "OpenAI", 100},
		}
		for _, b := range bindings {
			mid, mok := modelIDs[b.modelCode]
			pid, pok := providerIDs[b.providerName]
			if mok && pok {
				_ = bindingRepo.Create(ctx, &entity.ModelProviderBinding{
					ModelID:       mid,
					ProviderID:    pid,
					Weight:        b.weight,
					BindingStatus: "active",
					CreatedAt:     now,
					UpdatedAt:     now,
				})
			}
		}

		// Seed pricing for models (matching prototype)
		type pricingSeed struct {
			modelCode           string
			pricingType         string
			inputPrice          float64
			outputPrice         float64
			peakStart           *string
			peakEnd             *string
			peakInputPrice      *float64
			peakOutputPrice     *float64
			offPeakInputPrice   *float64
			offPeakOutputPrice  *float64
		}
		strPtr := func(s string) *string { return &s }
		f64Ptr := func(f float64) *float64 { return &f }

		pricings := []pricingSeed{
			{"gpt-4o", "flat", 0.018, 0.072, nil, nil, nil, nil, nil, nil},
			{"deepseek-v3", "time_based", 0.002, 0.008, strPtr("09:00"), strPtr("21:00"), f64Ptr(0.003), f64Ptr(0.012), f64Ptr(0.001), f64Ptr(0.004)},
			{"claude-3-5-sonnet", "flat", 0.022, 0.088, nil, nil, nil, nil, nil, nil},
			{"gpt-4o-mini", "time_based", 0.001, 0.004, strPtr("08:00"), strPtr("20:00"), f64Ptr(0.0015), f64Ptr(0.005), f64Ptr(0.0008), f64Ptr(0.0025)},
		}
		for _, ps := range pricings {
			mid, ok := modelIDs[ps.modelCode]
			if !ok {
				continue
			}
			pricing := &entity.ModelPricing{
				ModelID:             mid,
				PricingType:         ps.pricingType,
				PricePerInputToken:  ps.inputPrice,
				PricePerOutputToken: ps.outputPrice,
				Currency:            "CNY",
				PeakStart:           ps.peakStart,
				PeakEnd:             ps.peakEnd,
				PeakPricePerInput:   ps.peakInputPrice,
				PeakPricePerOutput:  ps.peakOutputPrice,
				OffpeakPricePerInput:  ps.offPeakInputPrice,
				OffpeakPricePerOutput: ps.offPeakOutputPrice,
				UpdatedAt:           now,
			}
			_, _ = pricingRepo.Upsert(ctx, pricing)
		}

		// Seed demo students
		studentHash, _ := bcrypt.GenerateFromPassword([]byte("student123"), bcrypt.DefaultCost)
		sRoleID := int64(2) // default/student role
		students := []*entity.User{
			{Email: "zhangsan@university.edu.cn", Nickname: "张三", PasswordHash: string(studentHash), UserStatus: "active", RoleID: &sRoleID, QuotaBalance: 150.0, CreatedAt: now, UpdatedAt: now},
			{Email: "lisi@nova-lab.com", Nickname: "李四", PasswordHash: string(studentHash), UserStatus: "active", RoleID: &sRoleID, QuotaBalance: 500.5, CreatedAt: now, UpdatedAt: now},
			{Email: "wangwu@student.tsinghua.edu.cn", Nickname: "王五", PasswordHash: string(studentHash), UserStatus: "disabled", RoleID: &sRoleID, QuotaBalance: 0.0, CreatedAt: now, UpdatedAt: now},
		}
		for _, s := range students {
			_ = userRepo.Create(ctx, s)
		}

		appLogger.Info("seed data loaded for in-memory mode",
			slog.String("admin_email", "admin@nova.com"),
			slog.Int("models", len(models)),
			slog.Int("providers", len(providers)),
			slog.Int("bindings", len(bindings)),
			slog.Int("pricings", len(pricings)),
			slog.Int("students", len(students)),
		)
	}

	// ---- Services ----
	healthSvc := service.NewHealthService(healthRepo)
	rbacSvc := service.NewRBACService(userRepo, rbacRepo)
	authSvc := service.NewAuthService(userRepo, sessionRepo, rbacSvc, appLogger, cfg.JWTSecret)
	apiKeySvc := service.NewApiKeyService(keyRepo, userRepo, appLogger)
	providerSvc := service.NewProviderService(providerRepo, appLogger)
	modelSvc := service.NewModelService(modelRepo, bindingRepo, providerRepo, pricingRepo, appLogger)
	usageSvc := service.NewUsageService(logRepo, keyRepo, providerRepo, appLogger)
	routerSvc := service.NewRouterService(modelRepo, bindingRepo, providerRepo, keyRepo, appLogger)
	pricingSvc := service.NewPricingService(pricingRepo, modelRepo)
	adminUserSvc := service.NewAdminUserService(userRepo, adminUserRepo, rbacRepo, keyRepo, modelRepo, userModelPermRepo)
	billingSvc := service.NewBillingService(userRepo, rbacSvc, userModelPermRepo, pricingRepo, billingRepo, adminUserRepo, logRepo)
	reportSvc := service.NewReportService(reportRepo, modelRepo, userRepo, logRepo, appLogger)

	// ---- Controllers ----
	healthCtrl := controller.NewHealthController(healthSvc, appLogger)
	authCtrl := controller.NewAuthController(authSvc, appLogger)
	apiKeyCtrl := controller.NewApiKeyController(apiKeySvc, appLogger)
	providerCtrl := controller.NewProviderController(providerSvc, appLogger)
	modelCtrl := controller.NewModelController(modelSvc, appLogger)
	usageCtrl := controller.NewUsageController(usageSvc, appLogger)
	chatCtrl := controller.NewChatController(routerSvc, usageSvc, modelSvc, billingSvc, appLogger)
	adminPricingCtrl := controller.NewAdminPricingController(pricingSvc, appLogger)
	adminUserCtrl := controller.NewAdminUserController(adminUserSvc, appLogger)
	billingCtrl := controller.NewBillingController(billingSvc, appLogger)
	billingCtrl.SetReportService(reportSvc)
	roleCtrl := controller.NewRoleController(rbacSvc, appLogger)
	reportCtrl := controller.NewReportController(reportSvc, appLogger)

	// ---- Router ----
	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("/health", healthCtrl.HandleHealth)
	mux.HandleFunc("POST /api/v1/auth/register", authCtrl.HandleRegister)
	mux.HandleFunc("POST /api/v1/auth/login", authCtrl.HandleLogin)

	// OpenAI-compatible endpoints (API Key auth, not JWT)
	mux.HandleFunc("GET /v1/models", chatCtrl.HandleListOpenAIModels)
	mux.HandleFunc("POST /v1/chat/completions", chatCtrl.HandleChatCompletions)

	// Our API v1 endpoints (API Key auth, not JWT)
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

	// Billing self-service routes (JWT required)
	protectedMux.HandleFunc("GET /api/v1/billing/quota", billingCtrl.HandleGetQuota)
	protectedMux.HandleFunc("GET /api/v1/billing/usage", billingCtrl.HandleGetUsage)

	// Student billing report routes (JWT required)
	protectedMux.HandleFunc("GET /api/v1/billing/my/usage-summary", billingCtrl.HandleMyUsageSummary)
	protectedMux.HandleFunc("GET /api/v1/billing/my/usage-trend", billingCtrl.HandleMyUsageTrend)
	protectedMux.HandleFunc("GET /api/v1/billing/my/usage-detail", billingCtrl.HandleMyUsageDetail)

	// Admin routes (JWT + RBAC required) - placed under separate mux for RBAC middleware
	adminMux := http.NewServeMux()
	adminMux.HandleFunc("GET /api/v1/admin/users", adminUserCtrl.HandleListUsers)
	adminMux.HandleFunc("POST /api/v1/admin/users", adminUserCtrl.HandleCreateUser)
	adminMux.HandleFunc("GET /api/v1/admin/users/{id}", adminUserCtrl.HandleGetUser)
	adminMux.HandleFunc("GET /api/v1/admin/users/{id}/quota", adminUserCtrl.HandleGetQuota)
	adminMux.HandleFunc("PUT /api/v1/admin/users/{id}/quota", adminUserCtrl.HandleSetQuota)
	adminMux.HandleFunc("GET /api/v1/admin/users/{id}/models", adminUserCtrl.HandleGetModels)
	adminMux.HandleFunc("PUT /api/v1/admin/users/{id}/models", adminUserCtrl.HandleSetModels)
	adminMux.HandleFunc("PUT /api/v1/admin/users/{id}/status", adminUserCtrl.HandleUpdateStatus)

	adminMux.HandleFunc("GET /api/v1/admin/pricing", adminPricingCtrl.HandleList)
	adminMux.HandleFunc("GET /api/v1/admin/pricing/{modelId}", adminPricingCtrl.HandleGet)
	adminMux.HandleFunc("PUT /api/v1/admin/pricing/{modelId}", adminPricingCtrl.HandleUpdate)

	adminMux.HandleFunc("GET /api/v1/admin/roles", roleCtrl.HandleListRoles)
	adminMux.HandleFunc("POST /api/v1/admin/roles", roleCtrl.HandleCreateRole)
	adminMux.HandleFunc("GET /api/v1/admin/roles/{id}", roleCtrl.HandleGetRole)
	adminMux.HandleFunc("PUT /api/v1/admin/roles/{id}", roleCtrl.HandleUpdateRole)
	adminMux.HandleFunc("DELETE /api/v1/admin/roles/{id}", roleCtrl.HandleDeleteRole)
	adminMux.HandleFunc("PUT /api/v1/admin/roles/{id}/permissions", roleCtrl.HandleUpdateRolePermissions)
	adminMux.HandleFunc("GET /api/v1/admin/permissions", roleCtrl.HandleListPermissions)

	adminMux.HandleFunc("GET /api/v1/billing/admin/summary", billingCtrl.HandleAdminSummary)
	adminMux.HandleFunc("GET /api/v1/billing/admin/usage", billingCtrl.HandleAdminUsage)

	// Admin report routes
	adminMux.HandleFunc("GET /api/v1/billing/report/summary", reportCtrl.HandleSummary)
	adminMux.HandleFunc("GET /api/v1/billing/report/revenue-trend", reportCtrl.HandleRevenueTrend)
	adminMux.HandleFunc("GET /api/v1/billing/report/by-model", reportCtrl.HandleByModel)
	adminMux.HandleFunc("GET /api/v1/billing/report/by-user", reportCtrl.HandleByUser)
	adminMux.HandleFunc("GET /api/v1/billing/report/export", reportCtrl.HandleExport)

	authMiddleware := middleware.AuthMiddleware(authSvc, appLogger)
	rbacMiddleware := middleware.RBACMiddleware(rbacSvc, appLogger)

	// Apply auth middleware to protected routes
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
	mux.Handle("/api/v1/billing/quota", authMiddleware(protectedMux))
	mux.Handle("/api/v1/billing/usage", authMiddleware(protectedMux))
	mux.Handle("/api/v1/billing/usage/", authMiddleware(protectedMux))
	mux.Handle("/api/v1/billing/my/", authMiddleware(protectedMux))

	// Apply auth + RBAC middleware to admin routes
	mux.Handle("/api/v1/admin/", authMiddleware(rbacMiddleware(adminMux)))
	mux.Handle("/api/v1/billing/admin/", authMiddleware(rbacMiddleware(adminMux)))
	mux.Handle("/api/v1/billing/report/", authMiddleware(rbacMiddleware(adminMux)))

	// ---- Daily aggregation CronJob ----
	if cfg.StorageDriver == "postgres" {
		go func() {
			defer func() {
				if r := recover(); r != nil {
					appLogger.Error("daily aggregation cron panic", slog.Any("recover", r))
				}
			}()

			ticker := time.NewTicker(1 * time.Hour)
			defer ticker.Stop()

			lastRunDate := ""

			for range ticker.C {
				now := time.Now()
				if now.Hour() == 1 {
					yesterday := now.AddDate(0, 0, -1).Format("2006-01-02")
					if yesterday == lastRunDate {
						continue
					}
					statDate := now.AddDate(0, 0, -1)
					appLogger.Info("running daily aggregation", slog.String("date", yesterday))
					if err := reportRepo.RunDailyAggregation(context.Background(), statDate); err != nil {
						appLogger.Error("daily aggregation failed", slog.String("date", yesterday), slog.Any("error", err))
					} else {
						appLogger.Info("daily aggregation completed", slog.String("date", yesterday))
						lastRunDate = yesterday
					}
				}
			}
		}()
		appLogger.Info("daily aggregation cron started (runs at 01:00 daily)")
	}

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
