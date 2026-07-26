package entity

import "time"

type Permission struct {
	ID          int64     `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	Module      string    `json:"module"`
	CreatedAt   time.Time `json:"createdAt"`
}

