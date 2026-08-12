package controller

// QA 集成测试：Anthropic 协议支持端到端验证。
// 使用 httptest mock Anthropic / OpenAI 协议 Provider，内存 Repository 组装真实依赖链，
// 通过真实 HTTP 请求验证：双向非流式/流式协议转换、出站请求头、4xx 错误转换。

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
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
	"aigateway/backend/internal/service"
)

// antEnv 组装内存依赖链 + 双协议 mock Provider，返回网关测试地址。
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

	// Provider：Anthropic 协议 → antSrv；OpenAI 协议 → oaiSrv
	if err := providerRepo.Create(ctx, &entity.Provider{
		ProviderName: "QA-Ant", BaseURL: antSrv.URL, APIKeyRef: "ant-key", APIPath: "/v1/messages",
		ProtocolType: "anthropic", AuthType: "api_key", Priority: 1, Weight: 100, IsEnabledFlag: true,
	}); err != nil {
		t.Fatalf("create ant provider: %v", err)
	}
	if err := providerRepo.Create(ctx, &entity.Provider{
		ProviderName: "QA-Oai", BaseURL: oaiSrv.URL, APIKeyRef: "oai-key", APIPath: "/v1/chat/completions",
		ProtocolType: "openai", AuthType: "api_key", Priority: 1, Weight: 100, IsEnabledFlag: true,
	}); err != nil {
		t.Fatalf("create oai provider: %v", err)
	}

	// 绑定：deepseek-chat(id=2, seed) → ant provider(id=5)；qwen-max(id=4, seed) → oai provider(id=6)
	antModel, _ := modelRepo.GetByCode(ctx, "deepseek-chat")
	oaiModel, _ := modelRepo.GetByCode(ctx, "qwen-max")
	antProvider, _ := providerRepo.GetByID(ctx, 5)
	oaiProvider, _ := providerRepo.GetByID(ctx, 6)
	for _, b := range []*entity.ModelProviderBinding{
		{ModelID: antModel.ID, ProviderID: antProvider.ID, Weight: 100, BindingStatus: "active"},
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

// capture 记录 mock Provider 收到的请求头与 body，用于断言出站转换正确性。
type capture struct {
	mu   sync.Mutex
	hdr  http.Header
	body map[string]any
}

func (c *capture) set(hdr http.Header, body []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.hdr = hdr.Clone()
	_ = json.Unmarshal(body, &c.body)
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

// ---------- 场景 1：OAI 入站 → Anthropic Provider（非流式） ----------

func TestQA_OpenAIIn_AnthropicOut_NonStream(t *testing.T) {
	antCap := &capture{}
	antHandler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		antCap.set(r.Header, body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"id":"msg_1","type":"message","role":"assistant","model":"deepseek-chat","content":[{"type":"text","text":"Hello from Anthropic"}],"stop_reason":"end_turn","usage":{"input_tokens":10,"output_tokens":20}}`)
	}
	base := setupQAEnv(t, antHandler, nil)

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

	// 响应转换为 OpenAI 格式
	var resp struct {
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
	if len(resp.Choices) == 0 || resp.Choices[0].Message.Content != "Hello from Anthropic" {
		t.Errorf("content = %+v, want Hello from Anthropic", resp.Choices)
	}
	if resp.Usage.PromptTokens != 10 || resp.Usage.CompletionTokens != 20 {
		t.Errorf("usage = %+v, want 10/20", resp.Usage)
	}

	// 出站请求正确性：x-api-key 头 + anthropic-version + system 拆分 + max_tokens 缺省 4096
	if got := antCap.header("x-api-key"); got != "ant-key" {
		t.Errorf("outbound x-api-key = %q, want ant-key", got)
	}
	if got := antCap.header("anthropic-version"); got == "" {
		t.Error("outbound missing anthropic-version header")
	}
	if got := antCap.header("Authorization"); got != "" {
		t.Errorf("outbound should not have Authorization header, got %q", got)
	}
	if got := antCap.field("system"); got != "You are helpful" {
		t.Errorf("outbound system = %v, want 'You are helpful'", got)
	}
	if got := antCap.field("max_tokens"); got != float64(4096) {
		t.Errorf("outbound max_tokens = %v, want 4096", got)
	}
}

// ---------- 场景 2：Anthropic 入站 → OpenAI Provider（非流式） ----------

func TestQA_AnthropicIn_OpenAIOut_NonStream(t *testing.T) {
	oaiCap := &capture{}
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		oaiCap.set(r.Header, body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"id":"cmpl_1","object":"chat.completion","created":1700000000,"model":"qwen-max","choices":[{"index":0,"message":{"role":"assistant","content":"Hello from OpenAI"},"finish_reason":"stop"}],"usage":{"prompt_tokens":5,"completion_tokens":7,"total_tokens":12}}`)
	}
	base := setupQAEnv(t, nil, oaiHandler)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{
		"model":"qwen-max",
		"max_tokens":2048,
		"system":"Be nice",
		"messages":[{"role":"user","content":"Hi"}]
	}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}

	// 响应转换为 Anthropic 格式
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
	if resp.Type != "message" || len(resp.Content) == 0 || resp.Content[0].Text != "Hello from OpenAI" {
		t.Errorf("content = %+v, want message/Hello from OpenAI", resp)
	}
	if resp.Usage.InputTokens != 5 || resp.Usage.OutputTokens != 7 {
		t.Errorf("usage = %+v, want 5/7", resp.Usage)
	}

	// 出站请求正确性：Bearer 头 + system 折叠为 system 消息
	if got := oaiCap.header("Authorization"); got != "Bearer oai-key" {
		t.Errorf("outbound Authorization = %q, want Bearer oai-key", got)
	}
	if got := oaiCap.header("x-api-key"); got != "" {
		t.Errorf("outbound should not have x-api-key, got %q", got)
	}
	msgs, _ := oaiCap.field("messages").([]any)
	if len(msgs) != 2 {
		t.Fatalf("outbound messages len = %d, want 2 (system + user)", len(msgs))
	}
	first := msgs[0].(map[string]any)
	if first["role"] != "system" || first["content"] != "Be nice" {
		t.Errorf("outbound msg0 = %v, want system/Be nice", first)
	}
}

// ---------- 场景 3：OAI 入站 → Anthropic Provider（流式 SSE） ----------

func TestQA_OpenAIIn_AnthropicOut_Stream(t *testing.T) {
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
		if len(ch.Choices) > 0 {
			gotText += ch.Choices[0].Delta.Content
		}
		if ch.Usage != nil {
			gotUsage["prompt"] = ch.Usage.PromptTokens
			gotUsage["completion"] = ch.Usage.CompletionTokens
		}
	}
	if gotText != "Hi from ANT" {
		t.Errorf("streamed text = %q, want 'Hi from ANT'", gotText)
	}
	if gotUsage["prompt"] != 11 || gotUsage["completion"] != 6 {
		t.Errorf("usage = %v, want prompt=11 completion=6", gotUsage)
	}
	if !sawDone {
		t.Error("missing [DONE] terminator")
	}
}

// ---------- 场景 4：Anthropic 入站 → OpenAI Provider（流式 SSE） ----------

func TestQA_AnthropicIn_OpenAIOut_Stream(t *testing.T) {
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"}}]}`+"\n\n")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Hi from"}}]}`+"\n\n")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" OAI"}}]}`+"\n\n")
		fmt.Fprint(w, `data: {"id":"cmpl_s","object":"chat.completion.chunk","choices":[],"usage":{"prompt_tokens":8,"completion_tokens":4}}`+"\n\n")
		fmt.Fprint(w, `data: [DONE]`+"\n\n")
	}
	base := setupQAEnv(t, nil, oaiHandler)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"qwen-max","max_tokens":1024,"messages":[{"role":"user","content":"Hi"}],"stream":true}`)
	if status != http.StatusOK {
		t.Fatalf("status = %d, body = %s", status, body)
	}

	var text, stopType string
	var usage map[string]int
	sawStop := false
	blockIdx := map[string]int{}
	for _, line := range strings.Split(body, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		payload := strings.TrimPrefix(line, "data: ")
		var ev struct {
			Type    string `json:"type"`
			Index   *int   `json:"index"`
			Content *struct {
				Type string `json:"type"`
			} `json:"content_block"`
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
		case "content_block_start":
			if ev.Index != nil {
				blockIdx["start"] = *ev.Index
			}
		case "content_block_delta":
			if ev.Delta != nil && ev.Delta.Type == "text_delta" {
				text += ev.Delta.Text
				if ev.Index != nil {
					blockIdx["delta"] = *ev.Index
				}
			}
		case "content_block_stop":
			if ev.Index != nil {
				blockIdx["stop"] = *ev.Index
			}
		case "message_delta":
			if ev.Usage != nil {
				usage = map[string]int{"input": ev.Usage.InputTokens, "output": ev.Usage.OutputTokens}
			}
		case "message_stop":
			sawStop = true
		}
	}
	_ = stopType
	if text != "Hi from OAI" {
		t.Errorf("streamed text = %q, want 'Hi from OAI'", text)
	}
	if usage == nil || usage["input"] != 8 || usage["output"] != 4 {
		t.Errorf("usage = %v, want input=8 output=4", usage)
	}
	if !sawStop {
		t.Error("missing message_stop")
	}
	// index 一致性（修复 #2 后 start/delta/stop 应一致）
	if blockIdx["start"] != blockIdx["delta"] || blockIdx["delta"] != blockIdx["stop"] {
		t.Errorf("block index mismatch: %v", blockIdx)
	}
}

// ---------- 场景 5：OAI 入站 → Anthropic Provider 4xx 错误转换 ----------

func TestQA_OpenAIIn_AnthropicOut_4xx(t *testing.T) {
	antHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusTooManyRequests)
		fmt.Fprint(w, `{"type":"error","error":{"type":"rate_limit_error","message":"rate limited"}}`)
	}
	base := setupQAEnv(t, antHandler, nil)

	status, body := qaPost(t, base, "/v1/chat/completions", "Authorization", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusTooManyRequests {
		t.Fatalf("status = %d, want 429", status)
	}
	// 应转换为 OpenAI 错误格式
	var oaiErr struct {
		Error struct {
			Message string `json:"message"`
			Type    string `json:"type"`
		} `json:"error"`
	}
	if err := json.Unmarshal([]byte(body), &oaiErr); err != nil {
		t.Fatalf("unmarshal oai error: %v, body=%s", err, body)
	}
	if oaiErr.Error.Message != "rate limited" {
		t.Errorf("error message = %q, want 'rate limited'", oaiErr.Error.Message)
	}
}

// ---------- 场景 6：Anthropic 入站 → OpenAI Provider 4xx 错误转换 ----------

func TestQA_AnthropicIn_OpenAIOut_4xx(t *testing.T) {
	oaiHandler := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusTooManyRequests)
		fmt.Fprint(w, `{"error":{"message":"rate limited","type":"rate_limit_error"}}`)
	}
	base := setupQAEnv(t, nil, oaiHandler)

	status, body := qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"qwen-max","max_tokens":1024,"messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusTooManyRequests {
		t.Fatalf("status = %d, want 429", status)
	}
	// 应转换为 Anthropic 错误格式
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
	if antErr.Type != "error" || antErr.Error.Message != "rate limited" {
		t.Errorf("ant error = %+v, want type=error message='rate limited'", antErr)
	}
}

// ---------- 场景 7：认证与参数校验 ----------

func TestQA_AuthAndValidation(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	// 缺失认证头 → AUTH001
	status, body := qaPost(t, base, "/v1/chat/completions", "", `{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusUnauthorized || !strings.Contains(body, "AUTH001") {
		t.Errorf("missing auth: status=%d body=%s, want 401 AUTH001", status, body)
	}

	// Anthropic 端点缺失 max_tokens → 400
	status, body = qaPost(t, base, "/v1/messages", "x-api-key", `{"model":"qwen-max","messages":[{"role":"user","content":"Hi"}]}`)
	if status != http.StatusBadRequest || !strings.Contains(body, "max_tokens") {
		t.Errorf("missing max_tokens: status=%d body=%s, want 400", status, body)
	}
}

// ---------- 场景 8：Anthropic 错误码标准化 ----------

func TestQA_AnthropicStandardErrorCodes(t *testing.T) {
	base := setupQAEnv(t, nil, nil)

	// 无效 Key → 401 authentication_error（Anthropic 标准类型）
	req, _ := http.NewRequest("POST", base+"/v1/messages", strings.NewReader(`{"model":"qwen-max","max_tokens":1024,"messages":[{"role":"user","content":"Hi"}]}`))
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

// ---------- 场景 9：GET /v1/models 超集格式 ----------

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

// ---------- 场景 10：count_tokens 端点 ----------

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

var _ = time.Now
