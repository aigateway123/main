package dto

type CreateApiKeyRequest struct {
	PermissionScope string `json:"permissionScope"`
}

type ApiKeyResponse struct {
	ID              int64  `json:"id"`
	UserID          int64  `json:"userId"`
	KeyPrefix       string `json:"keyPrefix"`
	FullKey         string `json:"fullKey,omitempty"`
	PermissionScope string `json:"permissionScope"`
	KeyStatus       string `json:"keyStatus"`
	CreatedAt       string `json:"createdAt"`
}

type UpdateApiKeyStatusRequest struct {
	Status string `json:"status"`
}
