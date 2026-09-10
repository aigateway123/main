package dto

type CreateProviderRequest struct {
	ProviderName  string `json:"providerName"`
	BaseURL       string `json:"baseUrl"`
	APIKeyRef     string `json:"apiKeyRef,omitempty"`
	APIPath       string `json:"apiPath"`
	ProtocolType  string `json:"protocolType"`
	AuthType      string `json:"authType"`
	Priority      int    `json:"priority"`
	Weight        int    `json:"weight"`
	IsEnabledFlag bool   `json:"isEnabledFlag"`

	// Anthropic 协议端点（可选）
	AnthropicBaseURL   string `json:"anthropicBaseUrl,omitempty"`
	AnthropicAPIPath   string `json:"anthropicApiPath,omitempty"`
	AnthropicAPIKeyRef string `json:"anthropicApiKeyRef,omitempty"`
	AnthropicAuthType  string `json:"anthropicAuthType,omitempty"`
}

type UpdateProviderRequest struct {
	ProviderName  string `json:"providerName"`
	BaseURL       string `json:"baseUrl"`
	APIKeyRef     string `json:"apiKeyRef,omitempty"`
	APIPath       string `json:"apiPath"`
	ProtocolType  string `json:"protocolType"`
	AuthType      string `json:"authType"`
	Priority      int    `json:"priority"`
	Weight        int    `json:"weight"`
	IsEnabledFlag bool   `json:"isEnabledFlag"`

	// Anthropic 协议端点（可选）
	AnthropicBaseURL   string `json:"anthropicBaseUrl,omitempty"`
	AnthropicAPIPath   string `json:"anthropicApiPath,omitempty"`
	AnthropicAPIKeyRef string `json:"anthropicApiKeyRef,omitempty"`
	AnthropicAuthType  string `json:"anthropicAuthType,omitempty"`
}

type ProviderResponse struct {
	ID              int64   `json:"id"`
	ProviderName    string  `json:"providerName"`
	BaseURL         string  `json:"baseUrl"`
	APIKeyRef       string  `json:"apiKeyRef,omitempty"`
	APIPath         string  `json:"apiPath"`
	ProtocolType    string  `json:"protocolType"`
	AuthType        string  `json:"authType"`
	Priority        int     `json:"priority"`
	Weight          int     `json:"weight"`
	IsEnabledFlag   bool    `json:"isEnabledFlag"`
	APIPathOverride *string `json:"apiPathOverride,omitempty"`

	// Anthropic 协议端点（可选）
	AnthropicBaseURL   string `json:"anthropicBaseUrl,omitempty"`
	AnthropicAPIPath   string `json:"anthropicApiPath,omitempty"`
	AnthropicAPIKeyRef string `json:"anthropicApiKeyRef,omitempty"`
	AnthropicAuthType  string `json:"anthropicAuthType,omitempty"`

	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

// TestEndpointRequest 端点连通性探测请求（不落库，供 Admin 表单即时测试）。
type TestEndpointRequest struct {
	Protocol  string `json:"protocol"` // openai | anthropic，空视为 openai
	BaseURL   string `json:"baseUrl"`
	APIPath   string `json:"apiPath"`
	AuthType  string `json:"authType"`
	APIKeyRef string `json:"apiKeyRef"`
}

type TestEndpointResponse struct {
	Reachable  bool   `json:"reachable"`
	AuthOK     bool   `json:"authOk"`
	StatusCode int    `json:"statusCode"`
	LatencyMs  int64  `json:"latencyMs"`
	Message    string `json:"message"`
}
