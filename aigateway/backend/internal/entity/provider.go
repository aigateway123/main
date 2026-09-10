package entity

import "time"

type Provider struct {
	ID           int64  `json:"id"`
	ProviderName string `json:"providerName"`
	BaseURL      string `json:"baseUrl"`
	APIKeyRef    string `json:"apiKeyRef,omitempty"`
	APIPath      string `json:"apiPath"`
	ProtocolType string `json:"protocolType"`
	AuthType     string `json:"authType"`

	// Anthropic 协议原生端点（为空表示未配置该协议）
	AnthropicBaseURL   string `json:"anthropicBaseUrl"`
	AnthropicAPIPath   string `json:"anthropicApiPath"`
	AnthropicAPIKeyRef string `json:"anthropicApiKeyRef,omitempty"`
	AnthropicAuthType  string `json:"anthropicAuthType"`

	Priority      int        `json:"priority"`
	Weight        int        `json:"weight"`
	IsEnabledFlag bool       `json:"isEnabledFlag"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty"`
}
