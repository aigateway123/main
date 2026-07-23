package dto

type CreateProviderRequest struct {
	ProviderName  string `json:"providerName"`
	BaseURL       string `json:"baseUrl"`
	APIKeyRef     string `json:"apiKeyRef,omitempty"`
	APIPath       string `json:"apiPath"`
	Priority      int    `json:"priority"`
	Weight        int    `json:"weight"`
	IsEnabledFlag bool   `json:"isEnabledFlag"`
}

type UpdateProviderRequest struct {
	ProviderName  string `json:"providerName"`
	BaseURL       string `json:"baseUrl"`
	APIKeyRef     string `json:"apiKeyRef,omitempty"`
	APIPath       string `json:"apiPath"`
	Priority      int    `json:"priority"`
	Weight        int    `json:"weight"`
	IsEnabledFlag bool   `json:"isEnabledFlag"`
}

type ProviderResponse struct {
	ID            int64  `json:"id"`
	ProviderName  string `json:"providerName"`
	BaseURL       string `json:"baseUrl"`
	APIKeyRef     string `json:"apiKeyRef,omitempty"`
	APIPath       string `json:"apiPath"`
	Priority      int    `json:"priority"`
	Weight        int    `json:"weight"`
	IsEnabledFlag bool   `json:"isEnabledFlag"`
	CreatedAt     string `json:"createdAt"`
	UpdatedAt     string `json:"updatedAt"`
}
