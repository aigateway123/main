package dto

type CreateModelRequest struct {
	ModelName string  `json:"modelName"`
	ModelCode string  `json:"modelCode"`
	ModelType *string `json:"modelType,omitempty"`
}

type UpdateModelRequest struct {
	ModelName   string  `json:"modelName"`
	ModelCode   string  `json:"modelCode"`
	ModelStatus string  `json:"modelStatus"`
	ModelType   *string `json:"modelType,omitempty"`
}

type ModelResponse struct {
	ID          int64  `json:"id"`
	ModelName   string `json:"modelName"`
	ModelCode   string `json:"modelCode"`
	ModelType   string `json:"modelType"`
	ModelStatus string `json:"modelStatus"`
	CreatedAt   string `json:"createdAt"`
	CreatedTime int64  `json:"-"`
	UpdatedAt   string `json:"updatedAt"`
}

type ModelDetailResponse struct {
	Model     ModelResponse            `json:"model"`
	Providers []*ProviderResponse      `json:"providers"`
}

type BindProviderRequest struct {
	ProviderID      int64   `json:"providerId"`
	Weight          int     `json:"weight"`
	APIPathOverride *string `json:"apiPathOverride,omitempty"`
}
