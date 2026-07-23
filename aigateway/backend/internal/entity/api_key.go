package entity

import "time"

type ApiKey struct {
	ID              int64      `json:"id"`
	UserID          int64      `json:"userId"`
	KeyPrefix       string     `json:"keyPrefix"`
	KeyHash         string     `json:"-"`
	PermissionScope string     `json:"permissionScope"`
	KeyStatus       string     `json:"keyStatus"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
	DeletedAt       *time.Time `json:"deletedAt,omitempty"`
}
