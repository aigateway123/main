package controller

// QA 集成测试：Provider 双协议原生直连端到端验证。
// 使用 httptest mock Anthropic / OpenAI 协议 Provider，内存 Repository 组装真实依赖链，
// 通过真实 HTTP 请求验证：入站路径决定出站协议、请求/响应/SSE 原样透传、出站请求头、
// 4xx 错误原样透传、严格模式下缺少对应协议端点时的 503 报错。

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
	"aigateway/backend/internal/service"
)

// setupQAEnv 组装内存依赖链 + 双协议 mock Provider，返回网关测试地址。
// Provider 布局：
//   - QA-Dual(id=5)    ：同时配置 OpenAI 与 Anthropic 端点（oaiSrv / antSrv）
//   - QA-AntOnly(id=6) ：仅配置 Anthropic 端点（antSrv）
//   - QA-Oai(id=7)     ：仅配置 OpenAI 端点（oaiSrv）
//
// 绑定：deepseek-chat → QA-Dual；glm-4 → QA-AntOnly；qwen-max → QA-Oai
func setupQAEnv(t *testing.T, antHandler, oaiHandler http.HandlerFunc) string {
	t.Helper()
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	ctx := context.Background()

	// mock Provider
	antSrv := httptest.NewServer(antHandler)
	oaiSrv := httptest.NewServer(oaiHandler)
	t.Cleanup(antSrv.Close)
	t.Cleanup(oaiSrv.Close)

	// Repositories（同 gateway main.go memory 分支）
	logRepo := repository.NewInMemoryRequestLogRepository()
	keyRepo := repository.NewInMemoryApiKeyRepository()
	providerRepo := repository.NewInMemoryProviderRepository()
	modelRepo := repository.NewInMemoryModelRepository()
	bindingRepo := repository.NewInMemoryModelBindingRepository()
	pricingRepo := repository.NewInMemoryPricingRepository()
	quotaRepo := repository.NewInMemoryQuotaRepository()
	modelPricingRepo := repository.NewInMemoryModelPricingRepository()
	userModelPermRepo := repository.NewInMemoryUserModelPermissionRepository()

	// Services
	policySvc := service.NewPolicyService(pricingRepo, quotaRepo, providerRepo, logRepo, 2.0, logger)
	usageSvc := service.NewUsageService(logRepo, keyRepo, providerRepo, modelRepo, bindingRepo, policySvc, logger)
	modelSvc := service.NewModelService(modelRepo, bindingRepo, providerRepo, modelPricingRepo, userModelPermRepo, logger)
	routerSvc := service.NewRouterService(modelRepo, bindingRepo, providerRepo, keyRepo, logger)
	chatCtrl := NewChatController(routerSvc, usageSvc, modelSvc, nil, policySvc, logger)

	// 双协议 Provider：OpenAI 端点 → oaiSrv；Anthropic 端点 → antSrv
	if err := providerRepo.Create(ctx, &entity.Provider{
		ProviderName:       "QA-Dual",
		BaseURL:            oaiSrv.URL,
		APIPath:            "/v1/chat/completions",
		APIKeyRef:          "oai-key",
		AuthType:           "bearer",
		AnthropicBaseURL:   antSrv.URL,
		AnthropicAPIPath:   "/v1/messages",
		AnthropicAPIKeyRef: "ant-key",
		AnthropicAuthType:  "api_key",
		ProtocolType:       "openai",
		Priority:           1, Weight: 100, IsEnabledFlag: true,
	}); err != nil {
		t.Fatalf("create dual provider: %v", err)
	}
	// 仅 Anthropic 端点
	if err := providerRepo.Create(ctx, &entity.Provider{
		ProviderName:       "QA-AntOnly",
		AnthropicBaseURL:   antSrv.URL,
		AnthropicAPIPath:   "/v1/messages",
		AnthropicAPIKeyRef: "ant-key",
		AnthropicAuthType:  "api_key",
		ProtocolType:       "anthropic",
		Priority:           1, Weight: 100, IsEnabledFlag: true,
	}); err != nil {
		t.Fatalf("create ant-only provider: %v", err)
	}
	// 仅 OpenAI 端点
	if err := providerRepo.Create(ctx, &entity.Provider{
		ProviderName: "QA-Oai",
		BaseURL:      oaiSrv.URL,
		APIPath:      "/v1/chat/completions",
		APIKeyRef:    "oai-key",
		AuthType:     "bearer",
		ProtocolType: "openai",
		Priority:     1, Weight: 100, IsEnabledFlag: true,
	}); err != nil {
		t.Fatalf("create oai provider: %v", err)
	}

	dualProvider, _ := providerRepo.GetByID(ctx, 5)
	antOnlyProvider, _ := providerRepo.GetByID(ctx, 6)
	oaiProvider, _ := providerRepo.GetByID(ctx, 7)
	dualModel, _ := modelRepo.GetByCode(ctx, "deepseek-chat")
	antOnlyModel, _ := modelRepo.GetByCode(ctx, "glm-4")
	oaiModel, _ := modelRepo.GetByCode(ctx, "qwen-max")
	// deepseek-chat 的绑定带 api_path_override（OpenAI 语义），用于验证它不会污染 Anthropic 出站路径
	oaiPathOverride := "/v1/chat/completions"
	for _, b := range []*entity.ModelProviderBinding{
		{ModelID: dualModel.ID, ProviderID: dualProvider.ID, Weight: 100, BindingStatus: "active", APIPathOverride: &oaiPathOverride},
		{ModelID: antOnlyModel.ID, ProviderID: antOnlyProvider.ID, Weight: 100, BindingStatus: "active"},
		{ModelID: oaiModel.ID, ProviderID: oaiProvider.ID, Weight: 100, BindingStatus: "active"},
	} {
		if err := bindingRepo.Create(ctx, b); err != nil {
			t.Fatalf("create binding: %v", err)
		}
	}

	// API Key（sk- 前缀 + 12 位 prefix + sha256 hash）
	rawKey := "sk-qa-test-1234567890abcdef"
	hash := sha256.Sum256([]byte(rawKey))
	if err := keyRepo.Create(ctx, &entity.ApiKey{
		UserID: 1, KeyPrefix: rawKey[:12], KeyHash: hex.EncodeToString(hash[:]),
		PermissionScope: "default", KeyStatus: "active",
	}); err != nil {
		t.Fatalf("create api key: %v", err)
	}

	// 暴露网关
	mux := http.NewServeMux()
	mux.HandleFunc("POST /v1/chat/completions", chatCtrl.HandleChatCompletions)
	mux.HandleFunc("POST /v1/messages", chatCtrl.HandleMessages)
	mux.HandleFunc("POST /v1/messages/count_tokens", chatCtrl.HandleCountTokens)
	mux.HandleFunc("GET /v1/models", chatCtrl.HandleListOpenAIModels)
	gw := httptest.NewServer(mux)
	t.Cleanup(gw.Close)
	return gw.URL
}

// capture 记录 mock Provider 收到的路径、请求头与 body 及命中次数，用于断言出站请求正确性。
type capture struct {
	mu   sync.Mutex
	hits int
	path string
	hdr  http.Header
	body map[string]any
}

func (c *capture) set(path string, hdr http.Header, body []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.hits++
	c.path = path
	c.hdr = hdr.Clone()
	_ = json.Unmarshal(body, &c.body)
}

func (c *capture) reqPath() string {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.path
}

func (c *capture) count() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.hits
}

func (c *capture) header(key string) string {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.hdr == nil {
		return ""
	}
	return c.hdr.Get(key)
}

func (c *capture) field(key string) any {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.body == nil {
		return nil
	}
	return c.body[key]
}

func qaPost(t *testing.T, baseURL, path, keyHeader string, body string) (int, string) {
	t.Helper()
	req, _ := http.NewRequest("POST", baseURL+path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	if keyHeader != "" {
		val := "sk-qa-test-1234567890abcdef"
		if keyHeader == "Authorization" {
			val = "Bearer " + val
		}
		req.Header.Set(keyHeader, val)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request %s: %v", path, err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return resp.StatusCode, string(b)
}

// ---------- 场景 1：OpenAI 入站 → OpenAI 端点（原生直连，非流式） ----------

func TestQA_OpenAIIn_OpenAIOut_NonStream(t *testing.T) {
	oaiCap := &capture{}
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		oaiCap.set(r.URL.Path, r.Header, body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"id":"cmpl_1","object":"chat.completion","created":1700000000,"model":"deepseek-chat","choices":[{"index":0,"message":{"role":"assistant","content":"Hello from OpenAI"},"finish_reason":"stop"}],"usage":{"prompt_tokens":5,"completion_tokens":7,"total_tokens":12}}`)
	}
	base := setupQAEnv(t, nil, oaiHandler)

	status, body := qaPost(t, base, "/v1/chat/completions", "Authorization", `{
		"model":"deepseek-chat",
		"messages":[
			{"role":"system","content":"You are helpful"},
			{"role":"user","content":"Hi"}
		]
	}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}

	// 响应原样透传（OpenAI 格式）
	var resp struct {
		Object  string `json:"object"`
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
		Usage struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal([]byte(body), &resp); err != nil {
		t.Fatalf("unmarshal oai resp: %v, body=%s", err, body)
	}
	if resp.Object != "chat.completion" {
		t.Errorf("object = %q, want chat.completion", resp.Object)
	}
	if len(resp.Choices) == 0 || resp.Choices[0].Message.Content != "Hello from OpenAI" {
		t.Errorf("content = %+v, want Hello from OpenAI", resp.Choices)
	}
	if resp.Usage.PromptTokens != 5 || resp.Usage.CompletionTokens != 7 {
		t.Errorf("usage = %+v, want 5/7", resp.Usage)
	}

	// 出站请求正确性：Bearer 头 + 请求体原样透传（system 消息保留）
	if got := oaiCap.header("Authorization"); got != "Bearer oai-key" {
		t.Errorf("outbound Authorization = %q, want Bearer oai-key", got)
	}
	if got := oaiCap.header("x-api-key"); got != "" {
		t.Errorf("outbound should not have x-api-key, got %q", got)
	}
	if got := oaiCap.reqPath(); got != "/v1/chat/completions" {
		t.Errorf("outbound path = %q, want /v1/chat/completions", got)
	}
	msgs, _ := oaiCap.field("messages").([]any)
	if len(msgs) != 2 {
		t.Fatalf("outbound messages len = %d, want 2 (system + user)", len(msgs))
	}
	first := msgs[0].(map[string]any)
	if first["role"] != "system" || first["content"] != "You are helpful" {
		t.Errorf("outbound msg0 = %v, want system/You are helpful", first)
	}
}

// ---------- 场景 2：Anthropic 入站 → Anthropic 端点（原生直连，非流式） ----------

func TestQA_AnthropicIn_AnthropicOut_NonStream(t *testing.T) {
	antCap := &capture{}
	antHandler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		antCap.set(r.URL.Path, r.Header, body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"id":"msg_1","type":"message","role":"assistant","model":"deepseek-chat","content":[{"type":"text","text":"Hello from Anthropic"}],"stop_reason":"end_turn","usage":{"input_tokens":10,"output_tokens":20}}`)
	}
	base := setupQAEnv(t, antHandler, nil)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{
		"model":"deepseek-chat",
		"max_tokens":2048,
		"system":"Be nice",
		"messages":[{"role":"user","content":"Hi"}]
	}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}

	// 响应原样透传（Anthropic 格式）
	var resp struct {
		Type    string `json:"type"`
		Content []struct {
			Type string `json:"type"`
			Text string `json:"text"`
		} `json:"content"`
		Usage struct {
			InputTokens  int `json:"input_tokens"`
			OutputTokens int `json:"output_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal([]byte(body), &resp); err != nil {
		t.Fatalf("unmarshal ant resp: %v, body=%s", err, body)
	}
	if resp.Type != "message" || len(resp.Content) == 0 || resp.Content[0].Text != "Hello from Anthropic" {
		t.Errorf("content = %+v, want message/Hello from Anthropic", resp)
	}
	if resp.Usage.InputTokens != 10 || resp.Usage.OutputTokens != 20 {
		t.Errorf("usage = %+v, want 10/20", resp.Usage)
	}

	// 出站请求正确性：x-api-key + anthropic-version，且无 Authorization
	if got := antCap.header("x-api-key"); got != "ant-key" {
		t.Errorf("outbound x-api-key = %q, want ant-key", got)
	}
	if got := antCap.header("anthropic-version"); got == "" {
		t.Error("outbound missing anthropic-version header")
	}
	if got := antCap.header("Authorization"); got != "" {
		t.Errorf("outbound should not have Authorization header, got %q", got)
	}
	// 回归：绑定的 api_path_override（OpenAI 语义）不得污染 Anthropic 出站路径
	if got := antCap.reqPath(); got != "/v1/messages" {
		t.Errorf("outbound path = %q, want /v1/messages", got)
	}
	// 请求体原样透传：system 保持顶层字符串，max_tokens 不变
	if got := antCap.field("system"); got != "Be nice" {
		t.Errorf("outbound system = %v, want 'Be nice'", got)
	}
	if got := antCap.field("max_tokens"); got != float64(2048) {
		t.Errorf("outbound max_tokens = %v, want 2048", got)
	}
}

// ---------- 场景 3：单 Provider 双端点，两条入站路径各自命中对应 mock ----------

func TestQA_DualProtocolProvider_BothPaths(t *testing.T) {
	antCap := &capture{}
	oaiCap := &capture{}
	antHandler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		antCap.set(r.URL.Path, r.Header, body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"id":"msg_1","type":"message","role":"assistant","content":[{"type":"text","text":"from ANT"}],"usage":{"input_tokens":1,"output_tokens":2}}`)
	}
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		oaiCap.set(r.URL.Path, r.Header, body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"id":"cmpl_1","object":"chat.completion","choices":[{"index":0,"message":{"role":"assistant","content":"from OAI"},"finish_reason":"stop"}],"usage":{"prompt_tokens":1,"completion_tokens":2}}`)
	}
	base := setupQAEnv(t, antHandler, oaiHandler)

	// 同一 Provider（QA-Dual）承载两条路径
	if status, body := qaPost(t, base, "/v1/chat/completions", "Authorization", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}`); status != http.StatusOK {
		t.Fatalf("openai path: status = %d, body = %s", status, body)
	}
	if status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"deepseek-chat","max_tokens":64,"messages":[{"role":"user","content":"Hi"}]}`); status != http.StatusOK {
		t.Fatalf("anthropic path: status = %d, body = %s", status, body)
	}

	if got := oaiCap.count(); got != 1 {
		t.Errorf("openai mock hits = %d, want 1", got)
	}
	if got := antCap.count(); got != 1 {
		t.Errorf("anthropic mock hits = %d, want 1", got)
	}
}

// ---------- 场景 4：严格模式 — Anthropic 入站 + 仅 OpenAI 端点 → 503 ----------

func TestQA_StrictMode_AnthropicIn_OpenAIOnlyProvider(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"qwen-max","max_tokens":64,"messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want 503, body = %s", status, body)
	}
	var antErr struct {
		Type  string `json:"type"`
		Error struct {
			Type    string `json:"type"`
			Message string `json:"message"`
		} `json:"error"`
	}
	if err := json.Unmarshal([]byte(body), &antErr); err != nil {
		t.Fatalf("unmarshal: %v, body=%s", err, body)
	}
	if antErr.Type != "error" || antErr.Error.Type != "overloaded_error" {
		t.Errorf("error = %+v, want type=error/overloaded_error", antErr)
	}
	if !strings.Contains(antErr.Error.Message, "anthropic") {
		t.Errorf("message = %q, want mention anthropic protocol", antErr.Error.Message)
	}
}

// ---------- 场景 5：严格模式 — OpenAI 入站 + 仅 Anthropic 端点 → 503 ----------

func TestQA_StrictMode_OpenAIIn_AnthropicOnlyProvider(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	status, body := qaPost(t, base, "/v1/chat/completions", "Authorization", `{"model":"glm-4","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want 503, body = %s", status, body)
	}
	var oaiErr struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	}
	if err := json.Unmarshal([]byte(body), &oaiErr); err != nil {
		t.Fatalf("unmarshal: %v, body=%s", err, body)
	}
	if oaiErr.Code != "ROUTER001" {
		t.Errorf("error code = %q, want ROUTER001", oaiErr.Code)
	}
	if !strings.Contains(oaiErr.Message, "openai") {
		t.Errorf("message = %q, want mention openai protocol", oaiErr.Message)
	}
}

// ---------- 场景 6：OpenAI 入站 → OpenAI 端点（流式 SSE 原样透传） ----------

func TestQA_OpenAIIn_OpenAIOut_Stream(t *testing.T) {
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"}}]}`+"\n\n")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Hi"}}]}`+"\n\n")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" from OAI"}}]}`+"\n\n")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[],"usage":{"prompt_tokens":8,"completion_tokens":4}}`+"\n\n")
		fmt.Fprint(w, `data: [DONE]`+"\n\n")
	}
	base := setupQAEnv(t, nil, oaiHandler)

	status, body := qaPost(t, base, "/v1/chat/completions", "Authorization", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}],"stream":true}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}

	var gotText string
	gotUsage := map[string]int{}
	sawDone := false
	for _, line := range strings.Split(body, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		payload := strings.TrimPrefix(line, "data: ")
		if payload == "[DONE]" {
			sawDone = true
			continue
		}
		var ch struct {
			Object  string `json:"object"`
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
			Usage *struct {
				PromptTokens     int `json:"prompt_tokens"`
				CompletionTokens int `json:"completion_tokens"`
			} `json:"usage"`
		}
		if json.Unmarshal([]byte(payload), &ch) != nil {
			continue
		}
		// 原样透传：chunk 的 object 字段应保持 OpenAI 语义
		if ch.Object != "" && ch.Object != "chat.completion.chunk" {
			t.Errorf("chunk object = %q, want chat.completion.chunk", ch.Object)
		}
		if len(ch.Choices) > 0 {
			gotText += ch.Choices[0].Delta.Content
		}
		if ch.Usage != nil {
			gotUsage["prompt"] = ch.Usage.PromptTokens
			gotUsage["completion"] = ch.Usage.CompletionTokens
		}
	}
	if gotText != "Hi from OAI" {
		t.Errorf("streamed text = %q, want 'Hi from OAI'", gotText)
	}
	if gotUsage["prompt"] != 8 || gotUsage["completion"] != 4 {
		t.Errorf("usage = %v, want prompt=8 completion=4", gotUsage)
	}
	if !sawDone {
		t.Error("missing [DONE] terminator")
	}
}

// ---------- 场景 7：Anthropic 入站 → Anthropic 端点（流式 SSE 原样透传） ----------

func TestQA_AnthropicIn_AnthropicOut_Stream(t *testing.T) {
	antHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, `data: {"type":"message_start","message":{"id":"msg_s","type":"message","role":"assistant","content":[],"usage":{"input_tokens":11,"output_tokens":0}}}`+"\n\n")
		fmt.Fprint(w, `data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}`+"\n\n")
		fmt.Fprint(w, `data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hi"}}`+"\n\n")
		fmt.Fprint(w, `data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" from ANT"}}`+"\n\n")
		fmt.Fprint(w, `data: {"type":"content_block_stop","index":0}`+"\n\n")
		fmt.Fprint(w, `data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":6}}`+"\n\n")
		fmt.Fprint(w, `data: {"type":"message_stop"}`+"\n\n")
	}
	base := setupQAEnv(t, antHandler, nil)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"deepseek-chat","max_tokens":64,"messages":[{"role":"user","content":"Hi"}],"stream":true}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}

	var text string
	var usage map[string]int
	sawStop := false
	for _, line := range strings.Split(body, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		payload := strings.TrimPrefix(line, "data: ")
		var ev struct {
			Type  string `json:"type"`
			Delta *struct {
				Type string `json:"type"`
				Text string `json:"text"`
			} `json:"delta"`
			Usage *struct {
				InputTokens  int `json:"input_tokens"`
				OutputTokens int `json:"output_tokens"`
			} `json:"usage"`
		}
		if json.Unmarshal([]byte(payload), &ev) != nil {
			continue
		}
		switch ev.Type {
		case "content_block_delta":
			if ev.Delta != nil && ev.Delta.Type == "text_delta" {
				text += ev.Delta.Text
			}
		case "message_start":
			var start struct {
				Message struct {
					Usage struct {
						InputTokens int `json:"input_tokens"`
					} `json:"usage"`
				} `json:"message"`
			}
			if json.Unmarshal([]byte(payload), &start) == nil {
				usage = map[string]int{"input": start.Message.Usage.InputTokens}
			}
		case "message_delta":
			if ev.Usage != nil {
				if usage == nil {
					usage = map[string]int{}
				}
				usage["output"] = ev.Usage.OutputTokens
			}
		case "message_stop":
			sawStop = true
		}
	}
	if text != "Hi from ANT" {
		t.Errorf("streamed text = %q, want 'Hi from ANT'", text)
	}
	if usage == nil || usage["input"] != 11 || usage["output"] != 6 {
		t.Errorf("usage = %v, want input=11 output=6", usage)
	}
	if !sawStop {
		t.Error("missing message_stop")
	}
}

// ---------- 场景 8：OpenAI 入站 → OpenAI 端点 4xx 原样透传 ----------

func TestQA_OpenAIIn_OpenAIOut_4xx(t *testing.T) {
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusTooManyRequests)
		fmt.Fprint(w, `{"error":{"message":"rate limited","type":"rate_limit_error"}}`)
	}
	base := setupQAEnv(t, nil, oaiHandler)

	status, body := qaPost(t, base, "/v1/chat/completions", "Authorization", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusTooManyRequests {
		t.Fatalf("status = %d, want 429", status)
	}
	var oaiErr struct {
		Error struct {
			Message string `json:"message"`
			Type    string `json:"type"`
		} `json:"error"`
	}
	if err := json.Unmarshal([]byte(body), &oaiErr); err != nil {
		t.Fatalf("unmarshal oai error: %v, body=%s", err, body)
	}
	if oaiErr.Error.Message != "rate limited" || oaiErr.Error.Type != "rate_limit_error" {
		t.Errorf("error = %+v, want message='rate limited' type=rate_limit_error", oaiErr.Error)
	}
}

// ---------- 场景 9：Anthropic 入站 → Anthropic 端点 4xx 原样透传 ----------

func TestQA_AnthropicIn_AnthropicOut_4xx(t *testing.T) {
	antHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusTooManyRequests)
		fmt.Fprint(w, `{"type":"error","error":{"type":"rate_limit_error","message":"rate limited"}}`)
	}
	base := setupQAEnv(t, antHandler, nil)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"deepseek-chat","max_tokens":64,"messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusTooManyRequests {
		t.Fatalf("status = %d, want 429", status)
	}
	var antErr struct {
		Type  string `json:"type"`
		Error struct {
			Type    string `json:"type"`
			Message string `json:"message"`
		} `json:"error"`
	}
	if err := json.Unmarshal([]byte(body), &antErr); err != nil {
		t.Fatalf("unmarshal ant error: %v, body=%s", err, body)
	}
	if antErr.Type != "error" || antErr.Error.Type != "rate_limit_error" || antErr.Error.Message != "rate limited" {
		t.Errorf("ant error = %+v, want type=error/rate_limit_error/'rate limited'", antErr)
	}
}

// ---------- 场景 10：认证与参数校验 ----------

func TestQA_AuthAndValidation(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	// 缺失认证头 → AUTH001
	status, body := qaPost(t, base, "/v1/chat/completions", "", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusUnauthorized || !strings.Contains(body, "AUTH001") {
		t.Errorf("missing auth: status=%d body=%s, want 401 AUTH001", status, body)
	}

	// Anthropic 端点缺失 max_tokens → 400
	status, body = qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusBadRequest || !strings.Contains(body, "max_tokens") {
		t.Errorf("missing max_tokens: status=%d body=%s, want 400", status, body)
	}
}

// ---------- 场景 11：Anthropic 错误码标准化 ----------

func TestQA_AnthropicStandardErrorCodes(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	// 无效 Key → 401 authentication_error（Anthropic 标准类型）
	req, _ := http.NewRequest("POST", base+"/v1/messages", strings.NewReader(`{"model":"deepseek-chat","max_tokens":1024,"messages":[{"role":"user","content":"Hi"}]}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", "sk-invalid-key-xxxx")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	var antErr struct {
		Type  string `json:"type"`
		Error struct {
			Type string `json:"type"`
		} `json:"error"`
	}
	if err := json.Unmarshal(b, &antErr); err != nil {
		t.Fatalf("unmarshal: %v, body=%s", err, b)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", resp.StatusCode)
	}
	if antErr.Type != "error" || antErr.Error.Type != "authentication_error" {
		t.Errorf("error = %+v, want type=error/authentication_error", antErr)
	}

	// 模型不存在 → 404 not_found_error（Anthropic 标准类型）
	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"no-such-model","max_tokens":1024,"messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusNotFound || !strings.Contains(body, "not_found_error") {
		t.Errorf("model not found: status=%d body=%s, want 404 not_found_error", status, body)
	}
}

// ---------- 场景 12：GET /v1/models 超集格式 ----------

func TestQA_ModelsListCompatible(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	req, _ := http.NewRequest("GET", base+"/v1/models", nil)
	req.Header.Set("x-api-key", "sk-qa-test-1234567890abcdef")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)

	var list struct {
		Data []struct {
			ID          string `json:"id"`
			Type        string `json:"type"`
			DisplayName string `json:"display_name"`
			Object      string `json:"object"`
		} `json:"data"`
		HasMore bool `json:"has_more"`
	}
	if err := json.Unmarshal(b, &list); err != nil {
		t.Fatalf("unmarshal models: %v, body=%s", err, b)
	}
	if len(list.Data) == 0 {
		t.Fatal("empty model list")
	}
	// Anthropic 字段
	if list.Data[0].Type != "model" || list.Data[0].ID == "" {
		t.Errorf("anthropic fields = %+v, want type=model + id", list.Data[0])
	}
	// OpenAI 字段
	if list.Data[0].Object != "model" {
		t.Errorf("openai field object = %q, want model", list.Data[0].Object)
	}
	if list.Data[0].DisplayName == "" {
		t.Errorf("display_name should not be empty: %+v", list.Data[0])
	}
}

// ---------- 场景 13：count_tokens 端点 ----------

func TestQA_CountTokens(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	status, body := qaPost(t, base, "/v1/messages/count_tokens", "x-api-key", `{"model":"qwen-max","messages":[{"role":"user","content":"Hello world, how are you today?"}]}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}
	var resp struct {
		InputTokens int `json:"input_tokens"`
	}
	if err := json.Unmarshal([]byte(body), &resp); err != nil {
		t.Fatalf("unmarshal: %v, body=%s", err, body)
	}
	// 24 个 ASCII 字符 ≈ 6 token + 结构开销
	if resp.InputTokens <= 0 {
		t.Errorf("input_tokens = %d, want > 0", resp.InputTokens)
	}

	// 缺少 messages → 400
	status, _ = qaPost(t, base, "/v1/messages/count_tokens", "x-api-key", `{"model":"qwen-max"}`)
	if status != http.StatusBadRequest {
		t.Errorf("missing messages: status = %d, want 400", status)
	}
}
