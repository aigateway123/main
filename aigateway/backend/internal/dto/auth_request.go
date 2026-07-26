package dto

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	UserID       int64  `json:"userId"`
	Email        string `json:"email"`
	Nickname     string `json:"nickname"`
	Role         string `json:"role"`
	QuotaBalance float64 `json:"quotaBalance"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken,omitempty"`
}

type ProfileResponse struct {
	UserID       int64    `json:"userId"`
	Email        string   `json:"email"`
	Nickname     string   `json:"nickname"`
	Role         string   `json:"role"`
	QuotaBalance float64  `json:"quotaBalance"`
	Permissions  []string `json:"permissions"`
}
