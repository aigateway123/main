package provider

import (
	"encoding/json"
	"testing"
)

func mustMarshal(t *testing.T, v any) []byte {
	t.Helper()
	b, err := json.Marshal(v)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	return b
}

func TestBuildAnthropicRequest(t *testing.T) {
	oaiBody := mustMarshal(t, map[string]any{
		"model": "deepseek-v4-pro",
		"messages": []map[string]any{
			{"role": "system", "content": "You are helpful"},
			{"role": "user", "content": "Hello"},
			{"role": "assistant", "content": "", "tool_calls": []map[string]any{
				{"id": "call_1", "type": "function", "function": map[string]any{"name": "get_weather", "arguments": `{"city":"beijing"}`}},
			}},
			{"role": "tool", "tool_call_id": "call_1", "content": "sunny"},
		},
		"tools": []map[string]any{
			{"type": "function", "function": map[string]any{"name": "get_weather", "description": "Get weather", "parameters": map[string]any{"type": "object", "properties": map[string]any{}}}},
		},
		"tool_choice": "auto",
		"stream":      false,
	})

	out, err := BuildAnthropicRequest(oaiBody)
	if err != nil {
		t.Fatalf("BuildAnthropicRequest: %v", err)
	}

	var ant map[string]any
	if err := json.Unmarshal(out, &ant); err != nil {
		t.Fatalf("unmarshal ant request: %v", err)
	}

	if ant["system"] != "You are helpful" {
		t.Errorf("system = %v, want You are helpful", ant["system"])
	}
	if ant["max_tokens"] != float64(DefaultAnthropicMaxTokens) {
		t.Errorf("max_tokens = %v, want %d", ant["max_tokens"], DefaultAnthropicMaxTokens)
	}
	if ant["tool_choice"] != "auto" {
		t.Errorf("tool_choice = %v, want auto", ant["tool_choice"])
	}

	msgs := ant["messages"].([]any)
	if len(msgs) != 3 {
		t.Fatalf("messages len = %d, want 3", len(msgs))
	}
	// assistant 消息应含 tool_use 块
	assistant := msgs[1].(map[string]any)
	blocks := assistant["content"].([]any)
	toolUse := blocks[0].(map[string]any)
	if toolUse["type"] != "tool_use" || toolUse["name"] != "get_weather" {
		t.Errorf("assistant block = %v, want tool_use/get_weather", toolUse)
	}
	// tool 消息聚合为 user 消息的 tool_result 块
	userMsg := msgs[2].(map[string]any)
	if userMsg["role"] != "user" {
		t.Errorf("tool aggregate role = %v, want user", userMsg["role"])
	}
	trBlocks := userMsg["content"].([]any)
	tr := trBlocks[0].(map[string]any)
	if tr["type"] != "tool_result" || tr["tool_use_id"] != "call_1" {
		t.Errorf("tool_result block = %v", tr)
	}

	tools := ant["tools"].([]any)
	tool := tools[0].(map[string]any)
	if tool["name"] != "get_weather" {
		t.Errorf("ant tool name = %v", tool["name"])
	}
	if _, ok := tool["input_schema"]; !ok {
		t.Errorf("ant tool missing input_schema: %v", tool)
	}
}

func TestBuildOpenAIRequest(t *testing.T) {
	antBody := mustMarshal(t, map[string]any{
		"model":     "deepseek-v4-pro",
		"max_tokens": 2048,
		"system":    "Be nice",
		"messages": []map[string]any{
			{"role": "user", "content": []map[string]any{{"type": "text", "text": "Hello"}}},
			{"role": "assistant", "content": []map[string]any{{"type": "tool_use", "id": "tu_1", "name": "get_weather", "input": map[string]any{"city": "shanghai"}}}},
			{"role": "user", "content": []map[string]any{{"type": "tool_result", "tool_use_id": "tu_1", "content": "rain"}}},
		},
		"tools":       []map[string]any{{"name": "get_weather", "input_schema": map[string]any{"type": "object"}}},
		"tool_choice": map[string]any{"type": "tool", "name": "get_weather"},
	})

	out, err := BuildOpenAICompatibleRequest(antBody)
	if err != nil {
		t.Fatalf("BuildOpenAICompatibleRequest: %v", err)
	}

	var oai map[string]any
	if err := json.Unmarshal(out, &oai); err != nil {
		t.Fatalf("unmarshal oai request: %v", err)
	}

	msgs := oai["messages"].([]any)
	if len(msgs) != 4 {
		t.Fatalf("messages len = %d, want 4", len(msgs))
	}
	if msgs[0].(map[string]any)["role"] != "system" {
		t.Errorf("msg0 role = %v, want system", msgs[0].(map[string]any)["role"])
	}
	// assistant 消息转 tool_calls
	assistant := msgs[2].(map[string]any)
	tcs := assistant["tool_calls"].([]any)
	tc := tcs[0].(map[string]any)
	fn := tc["function"].(map[string]any)
	if tc["id"] != "tu_1" || fn["name"] != "get_weather" {
		t.Errorf("tool_call = %v", tc)
	}
	// tool_result 转 tool 消息
	toolMsg := msgs[3].(map[string]any)
	if toolMsg["role"] != "tool" || toolMsg["tool_call_id"] != "tu_1" {
		t.Errorf("tool msg = %v", toolMsg)
	}

	tools := oai["tools"].([]any)
	if tools[0].(map[string]any)["type"] != "function" {
		t.Errorf("oai tool type = %v", tools[0])
	}
	tcChoice := oai["tool_choice"].(map[string]any)
	fnChoice := tcChoice["function"].(map[string]any)
	if tcChoice["type"] != "function" || fnChoice["name"] != "get_weather" {
		t.Errorf("tool_choice = %v", tcChoice)
	}
}

func TestBuildInboundResponseAnthropicToOpenAI(t *testing.T) {
	antResp := mustMarshal(t, map[string]any{
		"id":         "msg_1",
		"type":       "message",
		"role":       "assistant",
		"model":      "deepseek-v4-pro",
		"content": []map[string]any{
			{"type": "text", "text": "Hello!"},
			{"type": "tool_use", "id": "tu1", "name": "get_weather", "input": map[string]any{"city": "x"}},
		},
		"stop_reason": "tool_use",
		"usage":       map[string]any{"input_tokens": 10, "output_tokens": 20},
	})

	out, err := BuildInboundResponse(ProtocolOpenAI, ProtocolAnthropic, antResp)
	if err != nil {
		t.Fatalf("BuildInboundResponse: %v", err)
	}

	var oai map[string]any
	if err := json.Unmarshal(out, &oai); err != nil {
		t.Fatalf("unmarshal oai resp: %v", err)
	}
	choices := oai["choices"].([]any)
	msg := choices[0].(map[string]any)["message"].(map[string]any)
	if msg["content"] != "Hello!" {
		t.Errorf("content = %v, want Hello!", msg["content"])
	}
	tcs := msg["tool_calls"].([]any)
	if tcs[0].(map[string]any)["id"] != "tu1" {
		t.Errorf("tool_calls = %v", tcs)
	}
	if choices[0].(map[string]any)["finish_reason"] != "tool_calls" {
		t.Errorf("finish_reason = %v", choices[0].(map[string]any)["finish_reason"])
	}
	usage := oai["usage"].(map[string]any)
	if usage["prompt_tokens"] != float64(10) || usage["completion_tokens"] != float64(20) {
		t.Errorf("usage = %v", usage)
	}
}

func TestBuildInboundResponseOpenAIToAnthropic(t *testing.T) {
	oaiResp := mustMarshal(t, map[string]any{
		"id":      "chatcmpl_1",
		"object":  "chat.completion",
		"created": 1700000000,
		"choices": []map[string]any{
			{
				"index": 0,
				"message": map[string]any{
					"role":    "assistant",
					"content": "hi",
					"tool_calls": []map[string]any{
						{"id": "c1", "type": "function", "function": map[string]any{"name": "f1", "arguments": `{"a":1}`}},
					},
				},
				"finish_reason": "tool_calls",
			},
		},
		"usage": map[string]any{"prompt_tokens": 5, "completion_tokens": 7, "total_tokens": 12},
	})

	out, err := BuildInboundResponse(ProtocolAnthropic, ProtocolOpenAI, oaiResp)
	if err != nil {
		t.Fatalf("BuildInboundResponse: %v", err)
	}
	var ant map[string]any
	if err := json.Unmarshal(out, &ant); err != nil {
		t.Fatalf("unmarshal ant resp: %v", err)
	}
	if ant["type"] != "message" {
		t.Errorf("type = %v, want message", ant["type"])
	}
	content := ant["content"].([]any)
	if content[0].(map[string]any)["type"] != "text" {
		t.Errorf("content[0] = %v", content[0])
	}
	tu := content[1].(map[string]any)
	if tu["type"] != "tool_use" || tu["name"] != "f1" {
		t.Errorf("tool_use = %v", tu)
	}
	if ant["stop_reason"] != "tool_use" {
		t.Errorf("stop_reason = %v", ant["stop_reason"])
	}
	usage := ant["usage"].(map[string]any)
	if usage["input_tokens"] != float64(5) || usage["output_tokens"] != float64(7) {
		t.Errorf("usage = %v", usage)
	}
}

func TestParseUsage(t *testing.T) {
	antResp := mustMarshal(t, map[string]any{"usage": map[string]any{"input_tokens": 3, "output_tokens": 4}})
	in, out := ParseUsage(ProtocolAnthropic, antResp)
	if in != 3 || out != 4 {
		t.Errorf("anthropic parse = %d/%d, want 3/4", in, out)
	}

	oaiResp := mustMarshal(t, map[string]any{"usage": map[string]any{"prompt_tokens": 5, "completion_tokens": 6}})
	in, out = ParseUsage(ProtocolOpenAI, oaiResp)
	if in != 5 || out != 6 {
		t.Errorf("openai parse = %d/%d, want 5/6", in, out)
	}
}

func TestParseStreamUsageAnthropic(t *testing.T) {
	data := `data: {"type":"message_start","message":{"id":"msg_1","usage":{"input_tokens":10,"output_tokens":0}}}
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"hi"}}
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":25}}
data: {"type":"message_stop"}
`
	in, out := ParseStreamUsage(ProtocolAnthropic, []byte(data))
	if in != 10 || out != 25 {
		t.Errorf("anthropic stream parse = %d/%d, want 10/25", in, out)
	}
}

func TestParseStreamUsageOpenAI(t *testing.T) {
	data := `data: {"id":"x","choices":[{"delta":{"content":"a"}}]}
data: {"id":"x","choices":[],"usage":{"prompt_tokens":2,"completion_tokens":3}}
data: [DONE]
`
	in, out := ParseStreamUsage(ProtocolOpenAI, []byte(data))
	if in != 2 || out != 3 {
		t.Errorf("openai stream parse = %d/%d, want 2/3", in, out)
	}
}

func TestStreamTransformerAnthropicToOpenAI(t *testing.T) {
	// 客户端 OpenAI、Provider Anthropic：输入 Anthropic 流，输出 OpenAI 流
	tr := NewStreamTransformer(ProtocolOpenAI, ProtocolAnthropic)

	var out []string
	out = append(out, tr.Transform(`{"type":"message_start","message":{"id":"msg_9","usage":{"input_tokens":10,"output_tokens":0}}}`)...)
	out = append(out, tr.Transform(`{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}`)...)
	out = append(out, tr.Transform(`{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hel"}}`)...)
	out = append(out, tr.Transform(`{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"lo"}}`)...)
	out = append(out, tr.Transform(`{"type":"content_block_stop","index":0}`)...)
	out = append(out, tr.Transform(`{"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":20}}`)...)
	out = append(out, tr.Finish()...)

	if len(out) < 3 {
		t.Fatalf("out len = %d, want >=3", len(out))
	}
	// 内容 chunk
	foundText := false
	for _, o := range out {
		var c oaiChunk
		if err := json.Unmarshal([]byte(o), &c); err == nil {
			if len(c.Choices) > 0 && c.Choices[0].Delta.Content == "Hel" {
				foundText = true
			}
			if c.Usage != nil {
				if c.Usage.PromptTokens != 10 || c.Usage.CompletionTokens != 20 {
					t.Errorf("usage chunk = %v, want 10/20", c.Usage)
				}
			}
		}
	}
	if !foundText {
		t.Error("text delta chunk not found")
	}
	if out[len(out)-1] != "[DONE]" {
		t.Errorf("last event = %v, want [DONE]", out[len(out)-1])
	}
}

func TestStreamTransformerOpenAIToAnthropic(t *testing.T) {
	// 客户端 Anthropic、Provider OpenAI：输入 OpenAI 流，输出 Anthropic 流
	tr := NewStreamTransformer(ProtocolAnthropic, ProtocolOpenAI)

	var out []string
	out = append(out, tr.Transform(`{"id":"cmpl_1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"}}]}`)...)
	out = append(out, tr.Transform(`{"id":"cmpl_1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Hi"}}]}`)...)
	out = append(out, tr.Transform(`{"id":"cmpl_1","object":"chat.completion.chunk","choices":[],"usage":{"prompt_tokens":4,"completion_tokens":2}}`)...)
	out = append(out, tr.Finish()...)

	var foundDelta, foundStop, foundUsage bool
	// 校验 Anthropic 内容块 index 一致性：start / delta / stop 必须使用相同 index
	startIdx := -1
	deltaIdx := -1
	stopIdx := -1
	for _, o := range out {
		var ev antStreamMessage
		if json.Unmarshal([]byte(o), &ev) != nil {
			continue
		}
		switch ev.Type {
		case "content_block_start":
			if ev.Index != nil {
				startIdx = *ev.Index
			}
		case "content_block_delta":
			if ev.Delta != nil && ev.Delta.Text == "Hi" {
				foundDelta = true
				if ev.Index != nil {
					deltaIdx = *ev.Index
				}
			}
		case "content_block_stop":
			if ev.Index != nil {
				stopIdx = *ev.Index
			}
		case "message_stop":
			foundStop = true
		case "message_delta":
			if ev.Usage != nil && ev.Usage.OutputTokens == 2 {
				foundUsage = true
			}
		}
	}
	if !foundDelta {
		t.Error("anthropic text_delta not found")
	}
	if !foundStop {
		t.Error("anthropic message_stop not found")
	}
	if !foundUsage {
		t.Error("anthropic message_delta usage not found")
	}
	if startIdx != 0 || deltaIdx != startIdx || stopIdx != startIdx {
		t.Errorf("block index mismatch: start=%d delta=%d stop=%d, want all equal and 0", startIdx, deltaIdx, stopIdx)
	}
}

func TestConvertErrorBody(t *testing.T) {
	// OpenAI 错误 → Anthropic 错误
	oaiErr := mustMarshal(t, map[string]any{"error": map[string]any{"message": "bad request", "type": "invalid_request_error"}})
	out := ConvertErrorBody(ProtocolAnthropic, ProtocolOpenAI, oaiErr)
	if len(out) == 0 {
		t.Fatal("ConvertErrorBody returned empty for openai->anthropic")
	}
	var ant map[string]any
	if err := json.Unmarshal(out, &ant); err != nil {
		t.Fatalf("unmarshal ant error: %v", err)
	}
	if ant["type"] != "error" {
		t.Errorf("ant error type = %v, want error", ant["type"])
	}
	inner := ant["error"].(map[string]any)
	if inner["message"] != "bad request" {
		t.Errorf("ant error message = %v", inner["message"])
	}

	// Anthropic 错误 → OpenAI 错误
	antErr := mustMarshal(t, map[string]any{"type": "error", "error": map[string]any{"type": "overloaded_error", "message": "overloaded"}})
	out = ConvertErrorBody(ProtocolOpenAI, ProtocolAnthropic, antErr)
	if len(out) == 0 {
		t.Fatal("ConvertErrorBody returned empty for anthropic->openai")
	}
	var oai map[string]any
	if err := json.Unmarshal(out, &oai); err != nil {
		t.Fatalf("unmarshal oai error: %v", err)
	}
	if _, ok := oai["error"]; !ok {
		t.Errorf("oai error missing error field: %v", oai)
	}
	inner = oai["error"].(map[string]any)
	if inner["message"] != "overloaded" {
		t.Errorf("oai error message = %v", inner["message"])
	}

	// 无法识别时返回 nil（降级原样透传）
	if got := ConvertErrorBody(ProtocolAnthropic, ProtocolOpenAI, []byte(`{"foo":"bar"}`)); got != nil {
		t.Errorf("unrecognized body should return nil, got %s", got)
	}
}

func TestToolChoiceRequiredMapping(t *testing.T) {
	// OpenAI tool_choice="required" 应映射为 Anthropic "any"
	out, err := BuildAnthropicRequest(mustMarshal(t, map[string]any{
		"model":       "deepseek-v4-pro",
		"messages":    []map[string]any{{"role": "user", "content": "hi"}},
		"tool_choice": "required",
	}))
	if err != nil {
		t.Fatalf("BuildAnthropicRequest: %v", err)
	}
	var ant map[string]any
	if err := json.Unmarshal(out, &ant); err != nil {
		t.Fatalf("unmarshal ant: %v", err)
	}
	if ant["tool_choice"] != "any" {
		t.Errorf("tool_choice = %v, want any", ant["tool_choice"])
	}
}
