//go:build ignore

// 临时 QA 服务：为 Anthropic SDK 端到端实测提供本地网关宿主。
// 内存 Repository 组装完整依赖链（同 gateway main.go memory 分支），
// Provider 指向真实智谱 Anthropic 兼容端点（Key 已验证可用）。
// 运行：go run scripts/qa_anthropic_sdk_server.go
package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"aigateway/backend/internal/controller"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
	"aigateway/backend/internal/service"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	ctx := context.Background()

	// ---- Repositories（同 gateway main.go memory 分支）----
	logRepo := repository.NewInMemoryRequestLogRepository()
	keyRepo := repository.NewInMemoryApiKeyRepository()
	providerRepo := repository.NewInMemoryProviderRepository()
	modelRepo := repository.NewInMemoryModelRepository()
	bindingRepo := repository.NewInMemoryModelBindingRepository()
	pricingRepo := repository.NewInMemoryPricingRepository()
	quotaRepo := repository.NewInMemoryQuotaRepository()
	modelPricingRepo := repository.NewInMemoryModelPricingRepository()
	userModelPermRepo := repository.NewInMemoryUserModelPermissionRepository()

	// ---- Services ----
	policySvc := service.NewPolicyService(pricingRepo, quotaRepo, providerRepo, logRepo, 2.0, logger)
	usageSvc := service.NewUsageService(logRepo, keyRepo, providerRepo, modelRepo, bindingRepo, policySvc, logger)
	modelSvc := service.NewModelService(modelRepo, bindingRepo, providerRepo, modelPricingRepo, userModelPermRepo, logger)
	routerSvc := service.NewRouterService(modelRepo, bindingRepo, providerRepo, keyRepo, logger)
	chatCtrl := controller.NewChatController(routerSvc, usageSvc, modelSvc, nil, policySvc, logger)

	// ---- 真实智谱 Anthropic Provider（Key 通过环境变量 ZHIPU_API_KEY 注入，勿硬编码）----
	zhipuKey := os.Getenv("ZHIPU_API_KEY")
	if zhipuKey == "" {
		fmt.Fprintln(os.Stderr, "请设置环境变量 ZHIPU_API_KEY 后再运行")
		os.Exit(1)
	}
	if err := providerRepo.Create(ctx, &entity.Provider{
		ProviderName: "Zhipu-Anthropic", BaseURL: "https://open.bigmodel.cn", APIKeyRef: zhipuKey,
		APIPath: "/api/anthropic/v1/messages", ProtocolType: "anthropic", AuthType: "api_key",
		Priority: 1, Weight: 100, IsEnabledFlag: true,
	}); err != nil {
		panic(err)
	}

	// ---- 模型 glm-5.2 + 绑定 ----
	model := &entity.Model{ModelName: "GLM-5.2", ModelCode: "glm-5.2", ModelType: "chat", ModelStatus: "active", IsPublic: true}
	if err := modelRepo.Create(ctx, model); err != nil {
		panic(err)
	}
	provider, _ := providerRepo.GetByID(ctx, 5)
	if err := bindingRepo.Create(ctx, &entity.ModelProviderBinding{
		ModelID: model.ID, ProviderID: provider.ID, Weight: 100, BindingStatus: "active",
	}); err != nil {
		panic(err)
	}

	// ---- API Key（供 SDK 使用）----
	rawKey := "sk-qa-zhipu-1234567890abcdef"
	hash := sha256.Sum256([]byte(rawKey))
	if err := keyRepo.Create(ctx, &entity.ApiKey{
		UserID: 1, KeyPrefix: rawKey[:12], KeyHash: hex.EncodeToString(hash[:]),
		PermissionScope: "default", KeyStatus: "active",
	}); err != nil {
		panic(err)
	}

	// ---- 路由 ----
	mux := http.NewServeMux()
	mux.HandleFunc("POST /v1/messages", chatCtrl.HandleMessages)
	mux.HandleFunc("POST /v1/messages/count_tokens", chatCtrl.HandleCountTokens)
	mux.HandleFunc("GET /v1/models", chatCtrl.HandleListOpenAIModels)
	mux.HandleFunc("POST /v1/chat/completions", chatCtrl.HandleChatCompletions)

	addr := ":8081"
	fmt.Printf("QA Anthropic SDK server listening on http://localhost%s\n", addr)
	fmt.Printf("API key: %s\n", rawKey)
	if err := http.ListenAndServe(addr, mux); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
