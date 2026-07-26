package entity

import "time"

type QuotaTransaction struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"userId"`
	Amount      float64   `json:"amount"`
	Type        string    `json:"type"`
	ReferenceID *int64    `json:"referenceId,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

