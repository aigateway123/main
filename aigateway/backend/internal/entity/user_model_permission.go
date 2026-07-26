package entity

import "time"

type UserModelPermission struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"userId"`
	ModelID   int64     `json:"modelId"`
	CreatedAt time.Time `json:"createdAt"`
}

