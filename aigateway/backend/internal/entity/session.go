package entity

import "time"

type UserSession struct {
	ID               int64      `json:"id"`
	UserID           int64      `json:"userId"`
	RefreshTokenHash string     `json:"-"`
	ExpiresAt        time.Time  `json:"expiresAt"`
	CreatedAt        time.Time  `json:"createdAt"`
	DeletedAt        *time.Time `json:"deletedAt,omitempty"`
}
