package provider

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"
)

// ChatProtocol 标识一次调用的协议类型。
type ChatProtocol string

const (
	ProtocolOpenAI    ChatProtocol = "openai"
	ProtocolAnthropic ChatProtocol = "anthropic"
)

// DefaultAnthropicMaxTokens OpenAI 入站请求缺少 max_tokens（Anthropic 必填）时的默认值。
const DefaultAnthropicMaxTokens = 4096

const anthropicVersion = "2023-06-01"

// ---------- OpenAI Chat Completions 请求结构 ----------

type oaiChatRequest struct {
	Model       string          `json:"model"`
	Messages    []oaiMessage    `json:"messages"`
	MaxTokens   *int            `json:"max_tokens,omitempty"`
	Temperature *float64        `json:"temperature,omitempty"`
	TopP        *float64        `json:"top_p,omitempty"`
	Stream      bool            `json:"stream"`
	Tools       []oaiTool       `json:"tools,omitempty"`
	ToolChoice  json.RawMessage `json:"tool_choice,omitempty"`
}

type oaiMessage struct {
	Role       string          `json:"role"`
	Content    json.RawMessage `json:"content"`
	ToolCallID string          `json:"tool_call_id,omitempty"`
	ToolCalls  []oaiToolCall   `json:"tool_calls,omitempty"`
}

type oaiTool struct {
	Type     string      `json:"type"`
	Function oaiToolFunc `json:"function"`
}

type oaiToolFunc struct {
	Name        string          `json:"name"`
	Description string          `json:"description,omitempty"`
	Parameters  json.RawMessage `json:"parameters,omitempty"`
}

type oaiToolCall struct {
	ID       string          `json:"id"`
	Type     string          `json:"type,omitempty"`
	Function oaiToolCallFunc `json:"function"`
}

type oaiToolCallFunc struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

// ---------- Anthropic Messages 请求结构 ----------

type antMessage struct {
	Role    string          `json:"role"`
	Content json.RawMessage `json:"content"`
}

type antContentBlock struct {
	Type       string          `json:"type"`
	Text       string          `json:"text,omitempty"`
	ID         string          `json:"id,omitempty"`
	Name       string          `json:"name,omitempty"`
	Input      json.RawMessage `json:"input,omitempty"`
	ToolUseID  string          `json:"tool_use_id,omitempty"`
	Content    json.RawMessage `json:"content,omitempty"`
	IsError    bool            `json:"is_error,omitempty"`
	Thinking   string          `json:"thinking,omitempty"`
}

type antTool struct {
	Name        string          `json:"name"`
	Description string          `json:"description,omitempty"`
	InputSchema json.RawMessage `json:"input_schema"`
}

type antRequest struct {
	Model       string          `json:"model"`
	MaxTokens   int             `json:"max_tokens"`
	Messages    []antMessage    `json:"messages"`
	System      string          `json:"system,omitempty"`
	Temperature *float64        `json:"temperature,omitempty"`
	TopP        *float64        `json:"top_p,omitempty"`
	Stream      bool            `json:"stream"`
	Tools       []antTool       `json:"tools,omitempty"`
	ToolChoice  json.RawMessage `json:"tool_choice,omitempty"`
}

// ---------- 响应结构 ----------

type antUsage struct {
	InputTokens  int `json:"input_tokens"`
	OutputTokens int `json:"output_tokens"`
}

type antResponse struct {
	ID         string            `json:"id"`
	Type       string            `json:"type"`
	Role       string            `json:"role"`
	Content    []antContentBlock `json:"content"`
	Model      string            `json:"model"`
	StopReason string            `json:"stop_reason"`
	Usage      *antUsage         `json:"usage"`
}

type oaiUsage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

type oaiRespMsg struct {
	Role      string        `json:"role"`
	Content   string        `json:"content"`
	ToolCalls []oaiToolCall `json:"tool_calls,omitempty"`
}

type oaiChoice struct {
	Index        int        `json:"index"`
	Message      oaiRespMsg `json:"message"`
	FinishReason string     `json:"finish_reason"`
}

type oaiResponse struct {
	ID      string      `json:"id"`
	Object  string      `json:"object"`
	Created int64       `json:"created"`
	Model   string      `json:"model,omitempty"`
	Choices []oaiChoice `json:"choices"`
	Usage   *oaiUsage   `json:"usage,omitempty"`
}

// ---------- 工具函数 ----------

func strToRaw(s string) json.RawMessage {
	b, _ := json.Marshal(s)
	return b
}

// rawContentToString 提取 OpenAI message.content（string 或块数组）为纯文本。
func rawContentToString(raw json.RawMessage) string {
	if len(raw) == 0 || string(raw) == "null" {
		return ""
	}
	var s string
	if err := json.Unmarshal(raw, &s); err == nil {
		return s
	}
	var blocks []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	}
	if err := json.Unmarshal(raw, &blocks); err == nil {
		var sb strings.Builder
		for _, b := range blocks {
			if b.Type == "text" || b.Type == "" {
				sb.WriteString(b.Text)
			}
		}
		return sb.String()
	}
	return ""
}

func isStringContent(raw json.RawMessage) bool {
	if len(raw) == 0 {
		return true
	}
	return raw[0] == '"'
}

// blockContentToString 把 Anthropic content 块（string 或 text 块数组）转为纯文本。
func blockContentToString(raw json.RawMessage) string {
	if len(raw) == 0 || string(raw) == "null" {
		return ""
	}
	var s string
	if err := json.Unmarshal(raw, &s); err == nil {
		return s
	}
	var blocks []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	}
	if err := json.Unmarshal(raw, &blocks); err == nil {
		var sb strings.Builder
		for _, b := range blocks {
			if b.Type == "text" || b.Type == "" {
				sb.WriteString(b.Text)
			}
		}
		return sb.String()
	}
	return string(raw)
}

// convertOAIToolChoice 把 OpenAI tool_choice 转为 Anthropic 格式。
// Anthropic 仅支持 auto/any/tool/none；OpenAI 的 "required" 映射为 "any"。
func convertOAIToolChoice(raw json.RawMessage) json.RawMessage {
	if len(raw) == 0 {
		return nil
	}
	var s string
	if err := json.Unmarshal(raw, &s); err == nil {
		if s == "required" {
			return strToRaw("any")
		}
		return strToRaw(s)
	}
	var tc struct {
		Type     string `json:"type"`
		Function struct {
			Name string `json:"name"`
		} `json:"function"`
	}
	if err := json.Unmarshal(raw, &tc); err == nil && tc.Type == "function" {
		return mustJSON(map[string]any{"type": "tool", "name": tc.Function.Name})
	}
	return nil
}

// convertANTToolChoice 把 Anthropic tool_choice 转为 OpenAI 格式。
func convertANTToolChoice(raw json.RawMessage) json.RawMessage {
	if len(raw) == 0 {
		return nil
	}
	var s string
	if err := json.Unmarshal(raw, &s); err == nil {
		if s == "any" {
			return strToRaw("required")
		}
		return strToRaw(s)
	}
	var tc struct {
		Type string `json:"type"`
		Name string `json:"name"`
	}
	if err := json.Unmarshal(raw, &tc); err == nil && tc.Type == "tool" && tc.Name != "" {
		return mustJSON(map[string]any{"type": "function", "function": map[string]any{"name": tc.Name}})
	}
	return nil
}

func mustJSON(v any) json.RawMessage {
	b, _ := json.Marshal(v)
	return b
}

// ---------- 请求转换 ----------

// convertOAItoANTMessages 把 OpenAI messages 转为 Anthropic messages，
// 并将 system 消息抽取到 systemParts。
func convertOAItoANTMessages(msgs []oaiMessage) (antMessages []antMessage, systemParts []string) {
	var pendingToolResults []antContentBlock
	for _, m := range msgs {
		switch m.Role {
		case "system":
			if t := rawContentToString(m.Content); t != "" {
				systemParts = append(systemParts, t)
			}
		case "tool":
			pendingToolResults = append(pendingToolResults, antContentBlock{
				Type:      "tool_result",
				ToolUseID: m.ToolCallID,
				Content:   strToRaw(rawContentToString(m.Content)),
			})
		case "assistant", "user":
			if len(pendingToolResults) > 0 {
				blocks := mustJSON(pendingToolResults)
				antMessages = append(antMessages, antMessage{Role: "user", Content: blocks})
				pendingToolResults = nil
			}
			if m.Role == "assistant" && len(m.ToolCalls) > 0 {
				var blocks []antContentBlock
				if t := rawContentToString(m.Content); t != "" {
					blocks = append(blocks, antContentBlock{Type: "text", Text: t})
				}
				for _, tc := range m.ToolCalls {
					blocks = append(blocks, antContentBlock{
						Type:  "tool_use",
						ID:    tc.ID,
						Name:  tc.Function.Name,
						Input: json.RawMessage(tc.Function.Arguments),
					})
				}
				antMessages = append(antMessages, antMessage{Role: "assistant", Content: mustJSON(blocks)})
			} else {
				antMessages = append(antMessages, antMessage{Role: m.Role, Content: m.Content})
			}
		}
	}
	if len(pendingToolResults) > 0 {
		antMessages = append(antMessages, antMessage{Role: "user", Content: mustJSON(pendingToolResults)})
	}
	return
}

// convertANTtoOAIMessages 把 Anthropic messages 转为 OpenAI messages，
// system 字段折叠为首条 system 消息。
func convertANTtoOAIMessages(msgs []antMessage, system string) []oaiMessage {
	var out []oaiMessage
	if system != "" {
		out = append(out, oaiMessage{Role: "system", Content: strToRaw(system)})
	}
	for _, m := range msgs {
		if isStringContent(m.Content) {
			var s string
			_ = json.Unmarshal(m.Content, &s)
			out = append(out, oaiMessage{Role: m.Role, Content: strToRaw(s)})
			continue
		}
		var blocks []antContentBlock
		if err := json.Unmarshal(m.Content, &blocks); err != nil {
			out = append(out, oaiMessage{Role: m.Role, Content: m.Content})
			continue
		}
		switch m.Role {
		case "user":
			var textParts []string
			for _, b := range blocks {
				switch b.Type {
				case "text":
					textParts = append(textParts, b.Text)
				case "tool_result":
					// tool 消息必须紧跟相关 assistant(tool_calls)，因此先输出
					out = append(out, oaiMessage{
						Role:       "tool",
						ToolCallID: b.ToolUseID,
						Content:    strToRaw(blockContentToString(b.Content)),
					})
				}
			}
			if len(textParts) > 0 {
				out = append(out, oaiMessage{Role: "user", Content: strToRaw(strings.Join(textParts, ""))})
			}
		case "assistant":
			var textParts []string
			var toolCalls []oaiToolCall
			for _, b := range blocks {
				switch b.Type {
				case "text":
					textParts = append(textParts, b.Text)
				case "tool_use":
					toolCalls = append(toolCalls, oaiToolCall{
						ID:   b.ID,
						Type: "function",
						Function: oaiToolCallFunc{Name: b.Name, Arguments: string(b.Input)},
					})
				}
			}
			msg := oaiMessage{Role: "assistant"}
			if len(textParts) > 0 {
				msg.Content = strToRaw(strings.Join(textParts, ""))
			} else {
				msg.Content = json.RawMessage("null")
			}
			if len(toolCalls) > 0 {
				msg.ToolCalls = toolCalls
			}
			out = append(out, msg)
		default:
			out = append(out, oaiMessage{Role: m.Role, Content: m.Content})
		}
	}
	return out
}

// BuildAnthropicRequest 把 OpenAI 请求体转换为 Anthropic Messages 请求体。
func BuildAnthropicRequest(body []byte) ([]byte, error) {
	var req oaiChatRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, fmt.Errorf("parse openai request: %w", err)
	}
	ant := antRequest{
		Model:     req.Model,
		Stream:    req.Stream,
		MaxTokens: DefaultAnthropicMaxTokens,
	}
	if req.MaxTokens != nil {
		ant.MaxTokens = *req.MaxTokens
	}
	ant.Temperature = req.Temperature
	ant.TopP = req.TopP
	for _, t := range req.Tools {
		ant.Tools = append(ant.Tools, antTool{
			Name:        t.Function.Name,
			Description: t.Function.Description,
			InputSchema: t.Function.Parameters,
		})
	}
	if len(req.ToolChoice) > 0 {
		ant.ToolChoice = convertOAIToolChoice(req.ToolChoice)
	}
	var systemParts []string
	ant.Messages, systemParts = convertOAItoANTMessages(req.Messages)
	if len(systemParts) > 0 {
		ant.System = strings.Join(systemParts, "\n")
	}
	return json.Marshal(ant)
}

// BuildOpenAICompatibleRequest 把 Anthropic 请求体转换为 OpenAI Chat Completions 请求体。
func BuildOpenAICompatibleRequest(body []byte) ([]byte, error) {
	var req antRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return nil, fmt.Errorf("parse anthropic request: %w", err)
	}
	oai := oaiChatRequest{
		Model:     req.Model,
		Stream:    req.Stream,
		MaxTokens: &req.MaxTokens,
	}
	oai.Temperature = req.Temperature
	oai.TopP = req.TopP
	for _, t := range req.Tools {
		oai.Tools = append(oai.Tools, oaiTool{
			Type: "function",
			Function: oaiToolFunc{
				Name:        t.Name,
				Description: t.Description,
				Parameters:  t.InputSchema,
			},
		})
	}
	if len(req.ToolChoice) > 0 {
		oai.ToolChoice = convertANTToolChoice(req.ToolChoice)
	}
	oai.Messages = convertANTtoOAIMessages(req.Messages, req.System)
	return json.Marshal(oai)
}

// BuildOutboundRequest 把入站协议请求体转换为 Provider 协议请求体。
func BuildOutboundRequest(inbound, outbound ChatProtocol, body []byte) ([]byte, error) {
	if inbound == outbound {
		return body, nil
	}
	switch {
	case inbound == ProtocolOpenAI && outbound == ProtocolAnthropic:
		return BuildAnthropicRequest(body)
	case inbound == ProtocolAnthropic && outbound == ProtocolOpenAI:
		return BuildOpenAICompatibleRequest(body)
	}
	return body, nil
}

// ---------- 响应转换 ----------

func antToOAIFinish(stopReason string) string {
	switch stopReason {
	case "max_tokens":
		return "length"
	case "stop_sequence":
		return "stop"
	case "tool_use":
		return "tool_calls"
	case "end_turn":
		return "stop"
	}
	return "stop"
}

func oaiToANTStop(finishReason string) string {
	switch finishReason {
	case "length":
		return "max_tokens"
	case "tool_calls":
		return "tool_use"
	}
	return "end_turn"
}

func antToOAIResponse(body []byte) ([]byte, error) {
	var ant antResponse
	if err := json.Unmarshal(body, &ant); err != nil {
		return nil, fmt.Errorf("parse anthropic response: %w", err)
	}
	var textParts []string
	var toolCalls []oaiToolCall
	for _, b := range ant.Content {
		switch b.Type {
		case "text":
			textParts = append(textParts, b.Text)
		case "tool_use":
			toolCalls = append(toolCalls, oaiToolCall{
				ID:   b.ID,
				Type: "function",
				Function: oaiToolCallFunc{Name: b.Name, Arguments: string(b.Input)},
			})
		}
	}
	resp := oaiResponse{
		ID:      ant.ID,
		Object:  "chat.completion",
		Created: time.Now().Unix(),
		Model:   ant.Model,
		Choices: []oaiChoice{{
			Index:        0,
			Message:      oaiRespMsg{Role: "assistant", Content: strings.Join(textParts, ""), ToolCalls: toolCalls},
			FinishReason: antToOAIFinish(ant.StopReason),
		}},
	}
	if ant.Usage != nil {
		resp.Usage = &oaiUsage{
			PromptTokens:     ant.Usage.InputTokens,
			CompletionTokens: ant.Usage.OutputTokens,
			TotalTokens:      ant.Usage.InputTokens + ant.Usage.OutputTokens,
		}
	}
	return json.Marshal(resp)
}

func oaiToANTResponse(body []byte) ([]byte, error) {
	var oai oaiResponse
	if err := json.Unmarshal(body, &oai); err != nil {
		return nil, fmt.Errorf("parse openai response: %w", err)
	}
	resp := antResponse{
		ID:   oai.ID,
		Type: "message",
		Role: "assistant",
		Model: oai.Model,
	}
	if len(oai.Choices) > 0 {
		m := oai.Choices[0].Message
		var blocks []antContentBlock
		if m.Content != "" {
			blocks = append(blocks, antContentBlock{Type: "text", Text: m.Content})
		}
		for _, tc := range m.ToolCalls {
			blocks = append(blocks, antContentBlock{
				Type:  "tool_use",
				ID:    tc.ID,
				Name:  tc.Function.Name,
				Input: json.RawMessage(tc.Function.Arguments),
			})
		}
		resp.Content = blocks
		resp.StopReason = oaiToANTStop(oai.Choices[0].FinishReason)
	}
	if oai.Usage != nil {
		resp.Usage = &antUsage{InputTokens: oai.Usage.PromptTokens, OutputTokens: oai.Usage.CompletionTokens}
	}
	return json.Marshal(resp)
}

// ConvertErrorBody 把 Provider 返回的错误体转换为入站协议错误格式。
// 转换失败（无法识别或消息为空）返回 nil，调用方应降级为原样透传。
func ConvertErrorBody(inbound, outbound ChatProtocol, body []byte) []byte {
	switch {
	case inbound == ProtocolAnthropic && outbound == ProtocolOpenAI:
		// OpenAI 错误 → Anthropic 错误
		var o struct {
			Error *struct {
				Message string `json:"message"`
				Type    string `json:"type"`
			} `json:"error"`
		}
		if err := json.Unmarshal(body, &o); err == nil && o.Error != nil && o.Error.Message != "" {
			et := o.Error.Type
			if et == "" {
				et = "api_error"
			}
			return mustJSON(map[string]any{
				"type": "error",
				"error": map[string]any{"type": et, "message": o.Error.Message},
			})
		}
	case inbound == ProtocolOpenAI && outbound == ProtocolAnthropic:
		// Anthropic 错误 → OpenAI 错误
		var a struct {
			Error *struct {
				Type    string `json:"type"`
				Message string `json:"message"`
			} `json:"error"`
		}
		if err := json.Unmarshal(body, &a); err == nil && a.Error != nil && a.Error.Message != "" {
			et := a.Error.Type
			if et == "" {
				et = "api_error"
			}
			return mustJSON(map[string]any{
				"error": map[string]any{"message": a.Error.Message, "type": et},
			})
		}
	}
	return nil
}

// BuildInboundResponse 把 Provider 响应体转换为入站协议响应体。
func BuildInboundResponse(inbound, outbound ChatProtocol, body []byte) ([]byte, error) {
	if inbound == outbound {
		return body, nil
	}
	switch {
	case inbound == ProtocolOpenAI && outbound == ProtocolAnthropic:
		return antToOAIResponse(body)
	case inbound == ProtocolAnthropic && outbound == ProtocolOpenAI:
		return oaiToANTResponse(body)
	}
	return body, nil
}

// ---------- usage 解析 ----------

// ParseUsage 按 Provider 协议解析非流式响应体 token 数。
func ParseUsage(protocol ChatProtocol, body []byte) (input, output int) {
	switch protocol {
	case ProtocolAnthropic:
		var r struct {
			Usage *antUsage `json:"usage"`
		}
		if err := json.Unmarshal(body, &r); err == nil && r.Usage != nil {
			return r.Usage.InputTokens, r.Usage.OutputTokens
		}
	case ProtocolOpenAI:
		var r struct {
			Usage *oaiUsage `json:"usage"`
		}
		if err := json.Unmarshal(body, &r); err == nil && r.Usage != nil {
			return r.Usage.PromptTokens, r.Usage.CompletionTokens
		}
	}
	return 0, 0
}

// ParseStreamUsage 按入站协议解析流式转发 buffer 中的 token 数。
// OpenAI 兼容流式在末尾 chunk 携带 usage；Anthropic 流式在
// message_start.usage.input_tokens + message_delta.usage.output_tokens。
func ParseStreamUsage(inbound ChatProtocol, data []byte) (input, output int) {
	lines := strings.Split(string(data), "\n")
	switch inbound {
	case ProtocolAnthropic:
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if !strings.HasPrefix(line, "data: ") {
				continue
			}
			jsonStr := strings.TrimPrefix(line, "data: ")
			var ev struct {
				Type    string `json:"type"`
				Message *struct {
					Usage *antUsage `json:"usage"`
				} `json:"message"`
				Usage *antUsage `json:"usage"` // message_delta 顶层
			}
			if err := json.Unmarshal([]byte(jsonStr), &ev); err != nil {
				continue
			}
			switch ev.Type {
			case "message_start":
				if ev.Message != nil && ev.Message.Usage != nil {
					input = ev.Message.Usage.InputTokens
				}
			case "message_delta":
				if ev.Usage != nil {
					output = ev.Usage.OutputTokens
				}
			}
		}
	default: // openai
		for i := len(lines) - 1; i >= 0; i-- {
			line := strings.TrimSpace(lines[i])
			if !strings.HasPrefix(line, "data: ") {
				continue
			}
			jsonStr := strings.TrimPrefix(line, "data: ")
			if jsonStr == "[DONE]" {
				continue
			}
			var chunk struct {
				Usage *oaiUsage `json:"usage"`
			}
			if err := json.Unmarshal([]byte(jsonStr), &chunk); err == nil && chunk.Usage != nil {
				return chunk.Usage.PromptTokens, chunk.Usage.CompletionTokens
			}
		}
	}
	return input, output
}

// ---------- 流式（SSE）转换 ----------

// StreamTransformer 转换单条 SSE data 行；返回值是转换后的 data 行（不含 "data: " 前缀），
// 空返回值表示丢弃该事件。
type StreamTransformer interface {
	Transform(eventData string) []string
	Finish() []string
}

func NewStreamTransformer(inbound, outbound ChatProtocol) StreamTransformer {
	// proxyStream 传入的是 Provider 返回的流（outbound 协议），需转换为入站协议（inbound）。
	// 因此 OAI 入站 + ANT 出站 → 输入 ANT 流输出 OAI 流（antToOAI）；反之 → oaiToANT。
	switch {
	case inbound == ProtocolOpenAI && outbound == ProtocolAnthropic:
		return &antToOAIStream{protocol: inbound}
	case inbound == ProtocolAnthropic && outbound == ProtocolOpenAI:
		return &oaiToANTStream{protocol: inbound, textBlockIdx: -1}
	}
	return &passthroughStream{}
}

type passthroughStream struct{}

func (p *passthroughStream) Transform(eventData string) []string {
	return []string{eventData}
}

func (p *passthroughStream) Finish() []string {
	return nil
}

// ---------- Anthropic SSE → OpenAI SSE ----------

type oaiChunk struct {
	ID      string           `json:"id"`
	Object  string           `json:"object"`
	Created int64            `json:"created,omitempty"`
	Choices []oaiChunkChoice `json:"choices"`
	Usage   *oaiUsage        `json:"usage,omitempty"`
}

type oaiChunkChoice struct {
	Index        int           `json:"index"`
	Delta        oaiChunkDelta `json:"delta"`
	FinishReason *string       `json:"finish_reason"`
}

type oaiChunkDelta struct {
	Role      string        `json:"role,omitempty"`
	Content   string        `json:"content,omitempty"`
	ToolCalls []oaiToolCall `json:"tool_calls,omitempty"`
}

type antToOAIStream struct {
	protocol    ChatProtocol
	id          string
	inputTokens int
	toolBlock   *toolAccum
}

type toolAccum struct {
	antIndex int
	id       string
	name     string
	args     []byte
}

func (t *antToOAIStream) Transform(eventData string) []string {
	if eventData == "" {
		return nil
	}
	var ev struct {
		Type         string `json:"type"`
		Message      *struct {
			ID    string `json:"id"`
			Usage *struct {
				InputTokens int `json:"input_tokens"`
			} `json:"usage"`
		} `json:"message"`
		Delta *struct {
			StopReason  string `json:"stop_reason"`
			Type        string `json:"type"`
			Text        string `json:"text"`
			PartialJSON string `json:"partial_json"`
		} `json:"delta"`
		Usage        *struct {
			OutputTokens int `json:"output_tokens"`
		} `json:"usage"`
		ContentBlock *struct {
			Type string `json:"type"`
			Text string `json:"text"`
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"content_block"`
	}
	if err := json.Unmarshal([]byte(eventData), &ev); err != nil {
		return nil
	}
	switch ev.Type {
	case "message_start":
		if ev.Message != nil {
			t.id = ev.Message.ID
			if ev.Message.Usage != nil {
				t.inputTokens = ev.Message.Usage.InputTokens
			}
		}
		// 首 chunk：告知 OpenAI SDK 角色
		return []string{string(mustJSON(oaiChunk{
			ID:      t.id,
			Object:  "chat.completion.chunk",
			Choices: []oaiChunkChoice{{Index: 0, Delta: oaiChunkDelta{Role: "assistant"}}},
		}))}
	case "content_block_start":
		if ev.ContentBlock != nil && ev.ContentBlock.Type == "tool_use" {
			t.toolBlock = &toolAccum{id: ev.ContentBlock.ID, name: ev.ContentBlock.Name}
		}
		return nil
	case "content_block_delta":
		if ev.Delta != nil {
			switch ev.Delta.Type {
			case "text_delta":
				if ev.Delta.Text == "" {
					return nil
				}
				return []string{string(mustJSON(oaiChunk{
					ID:      t.id,
					Object:  "chat.completion.chunk",
					Choices: []oaiChunkChoice{{Index: 0, Delta: oaiChunkDelta{Content: ev.Delta.Text}}},
				}))}
			case "input_json_delta":
				if t.toolBlock != nil {
					t.toolBlock.args = append(t.toolBlock.args, ev.Delta.PartialJSON...)
				}
				return nil
			}
		}
		return nil
	case "content_block_stop":
		if t.toolBlock != nil {
			args := string(t.toolBlock.args)
			chunk := oaiChunk{
				ID:     t.id,
				Object: "chat.completion.chunk",
				Choices: []oaiChunkChoice{{Index: 0, Delta: oaiChunkDelta{
					ToolCalls: []oaiToolCall{{
						ID:   t.toolBlock.id,
						Type: "function",
						Function: oaiToolCallFunc{Name: t.toolBlock.name, Arguments: args},
					}},
				}}},
			}
			t.toolBlock = nil
			return []string{string(mustJSON(chunk))}
		}
		return nil
	case "message_delta":
		var outputTokens int
		if ev.Usage != nil {
			outputTokens = ev.Usage.OutputTokens
		}
		// 末尾 usage chunk（含 input + output）
		return []string{string(mustJSON(oaiChunk{
			ID:      t.id,
			Object:  "chat.completion.chunk",
			Choices: make([]oaiChunkChoice, 0),
			Usage: &oaiUsage{
				PromptTokens:     t.inputTokens,
				CompletionTokens: outputTokens,
				TotalTokens:      t.inputTokens + outputTokens,
			},
		}))}
	default:
		return nil
	}
}

func (t *antToOAIStream) Finish() []string {
	return []string{"[DONE]"}
}

// ---------- OpenAI SSE → Anthropic SSE ----------

type antStreamMessage struct {
	Type         string            `json:"type"`
	Message      *antStreamMsg     `json:"message,omitempty"`
	Index        *int              `json:"index,omitempty"`
	ContentBlock *antContentBlock  `json:"content_block,omitempty"`
	Delta        *antStreamDelta   `json:"delta,omitempty"`
	Usage        *antUsage         `json:"usage,omitempty"`
}

type antStreamMsg struct {
	ID      string            `json:"id"`
	Type    string            `json:"type"`
	Role    string            `json:"role"`
	Content []antContentBlock `json:"content"`
	Model   string            `json:"model,omitempty"`
	Usage   *antUsage         `json:"usage"`
}

type antStreamDelta struct {
	Type         string  `json:"type,omitempty"`
	Text         string  `json:"text,omitempty"`
	PartialJSON  string  `json:"partial_json,omitempty"`
	StopReason   string  `json:"stop_reason,omitempty"`
	StopSequence *string `json:"stop_sequence"`
}

type oaiToANTStream struct {
	protocol     ChatProtocol
	id           string
	sentStart    bool
	blockIndex   int // 下一个可分配的 ANT 内容块 index
	textBlockIdx int // text 块 index，-1 表示未打开
	toolBlocks   map[int]*toolAccum // key = OpenAI tool_calls index（跨 chunk 累积）
	finishReason string
}

func (t *oaiToANTStream) Transform(eventData string) []string {
	if eventData == "" {
		return nil
	}
	if eventData == "[DONE]" {
		return nil
	}
	var ch struct {
		ID      string `json:"id"`
		Choices []struct {
			Delta struct {
				Role      string `json:"role"`
				Content   string `json:"content"`
				ToolCalls []struct {
					Index    int    `json:"index"`
					ID       string `json:"id"`
					Type     string `json:"type"`
					Function struct {
						Name      string `json:"name"`
						Arguments string `json:"arguments"`
					} `json:"function"`
				} `json:"tool_calls"`
			} `json:"delta"`
			FinishReason *string `json:"finish_reason"`
		} `json:"choices"`
		Usage *struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal([]byte(eventData), &ch); err != nil {
		return nil
	}
	var out []string
	if ch.ID != "" && !t.sentStart {
		t.id = ch.ID
		t.sentStart = true
		out = append(out, string(mustJSON(antStreamMessage{
			Type: "message_start",
			Message: &antStreamMsg{
				ID:      ch.ID,
				Type:    "message",
				Role:    "assistant",
				Content: []antContentBlock{},
				Usage:   &antUsage{InputTokens: 0, OutputTokens: 0},
			},
		})))
	}
	if len(ch.Choices) > 0 {
		delta := ch.Choices[0].Delta
		if delta.Content != "" {
			if t.textBlockIdx < 0 {
				idx := t.blockIndex
				t.blockIndex++
				t.textBlockIdx = idx
				out = append(out, string(mustJSON(antStreamMessage{
					Type:         "content_block_start",
					Index:        &idx,
					ContentBlock: &antContentBlock{Type: "text"},
				})))
			}
			idx := t.textBlockIdx
			out = append(out, string(mustJSON(antStreamMessage{
				Type:  "content_block_delta",
				Index: &idx,
				Delta: &antStreamDelta{Type: "text_delta", Text: delta.Content},
			})))
		}
		for _, tc := range delta.ToolCalls {
			if t.toolBlocks == nil {
				t.toolBlocks = make(map[int]*toolAccum)
			}
			acc, exists := t.toolBlocks[tc.Index]
			if !exists {
				idx := t.blockIndex
				t.blockIndex++
				acc = &toolAccum{antIndex: idx, id: tc.ID, name: tc.Function.Name}
				t.toolBlocks[tc.Index] = acc
				out = append(out, string(mustJSON(antStreamMessage{
					Type:         "content_block_start",
					Index:        &idx,
					ContentBlock: &antContentBlock{Type: "tool_use", ID: tc.ID, Name: tc.Function.Name},
				})))
			}
			if tc.Function.Arguments != "" {
				idx := acc.antIndex
				out = append(out, string(mustJSON(antStreamMessage{
					Type:  "content_block_delta",
					Index: &idx,
					Delta: &antStreamDelta{Type: "input_json_delta", PartialJSON: tc.Function.Arguments},
				})))
			}
		}
		if ch.Choices[0].FinishReason != nil {
			t.finishReason = *ch.Choices[0].FinishReason
		}
	}
	if ch.Usage != nil {
		stopReason := "end_turn"
		switch t.finishReason {
		case "tool_calls":
			stopReason = "tool_use"
		case "length":
			stopReason = "max_tokens"
		}
		out = append(out, string(mustJSON(antStreamMessage{
			Type:  "message_delta",
			Delta: &antStreamDelta{
				StopReason:   stopReason,
				StopSequence: nil,
			},
			Usage: &antUsage{InputTokens: ch.Usage.PromptTokens, OutputTokens: ch.Usage.CompletionTokens},
		})))
	}
	return out
}

func (t *oaiToANTStream) Finish() []string {
	var out []string
	// 按 ANT 内容块 index 升序输出 content_block_stop（index 必须与 start 一致）
	var stops []int
	for _, acc := range t.toolBlocks {
		stops = append(stops, acc.antIndex)
	}
	if t.textBlockIdx >= 0 {
		stops = append(stops, t.textBlockIdx)
	}
	sort.Ints(stops)
	for _, idx := range stops {
		out = append(out, string(mustJSON(antStreamMessage{Type: "content_block_stop", Index: &idx})))
	}
	out = append(out, string(mustJSON(antStreamMessage{Type: "message_stop"})))
	return out
}

// ---------- 对外辅助 ----------

// AnthropicHeaders 返回 Anthropic 协议所需的请求头（含版本头）。
func AnthropicHeaders() map[string]string {
	return map[string]string{"anthropic-version": anthropicVersion}
}
