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
