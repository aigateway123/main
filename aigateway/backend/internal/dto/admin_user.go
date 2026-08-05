package dto

type AdminCreateUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type AdminUserItem struct {
	ID           int64   `json:"userId"`
	Email        string  `json:"email"`
	Nickname     string  `json:"nickname"`
	Role         string  `json:"role"`
	UserStatus   string  `json:"status"`
	QuotaBalance float64 `json:"quotaBalance"`
	CreatedAt    string  `json:"createdAt"`
}

type AdminUpdateUserStatusRequest struct {
	Status string `json:"status"`
}

type AdminSetQuotaRequest struct {
	Amount float64 `json:"amount"`
}

type AdminSetModelsRequest struct {
	ModelIDs []int64 `json:"modelIds"`
}

type AdminAuthorizedModelItem struct {
	ModelID      int64  `json:"modelId"`
	ModelName    string `json:"modelName"`
	ModelCode    string `json:"modelCode"`
	AuthorizedAt string `json:"authorizedAt"`
}

type AdminModelWithAuthFlag struct {
	ModelID     int64  `json:"modelId"`
	ModelName   string `json:"modelName"`
	ModelCode   string `json:"modelCode"`
	Authorized  bool   `json:"authorized"`
}

type AdminUserDetail struct {
	ID           int64   `json:"id"`
	Email        string  `json:"email"`
	Nickname     string  `json:"nickname"`
	Role         string  `json:"role"`
	RoleID       *int64  `json:"roleId"`
	UserStatus   string  `json:"userStatus"`
	QuotaBalance float64 `json:"quotaBalance"`
	TotalSpent   float64 `json:"totalSpent"`
	TotalRequests int    `json:"totalRequests"`
	CreatedAt    string  `json:"createdAt"`
	UpdatedAt    string  `json:"updatedAt"`
}
