package repository

import (
	"context"
	"errors"

	"aigateway/backend/internal/entity"
)

var ErrQuotaExceeded = errors.New("quota exceeded")

type BillingRepository interface {
	DeductQuotaAndRecord(ctx context.Context, log *entity.RequestLog, costAmount float64) error
}

