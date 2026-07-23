package entity

import "time"

type User struct {
	ID             int64      `json:"id"`
	OrganizationID *int64     `json:"organizationId"`
	Email          string     `json:"email"`
	Nickname       string     `json:"nickname"`
	PasswordHash   string     `json:"-"`
	UserStatus     string     `json:"userStatus"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
	DeletedAt      *time.Time `json:"deletedAt,omitempty"`
}
