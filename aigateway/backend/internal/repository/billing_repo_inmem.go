package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type InMemoryBillingRepository struct {
	mu           sync.RWMutex
	userRepo     *InMemoryUserRepository
	logRepo      *InMemoryRequestLogRepository
	transactions []*entity.QuotaTransaction
	nextTxID     int64
}

func NewInMemoryBillingRepository(userRepo *InMemoryUserRepository, logRepo *InMemoryRequestLogRepository) *InMemoryBillingRepository {
	return &InMemoryBillingRepository{
		userRepo:     userRepo,
		logRepo:      logRepo,
		transactions: make([]*entity.QuotaTransaction, 0),
		nextTxID:     1,
	}
}

func (r *InMemoryBillingRepository) DeductQuotaAndRecord(ctx context.Context, log *entity.RequestLog, costAmount float64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Fetch user's current quota balance from shared user store
	u, err := r.userRepo.GetByID(ctx, log.UserID)
	if err != nil {
		return ErrUserNotFound
	}

	// Check if enough balance
	if costAmount > 0 && u.QuotaBalance < costAmount {
		return ErrQuotaExceeded
	}

	now := time.Now()
	log.CostAmount = costAmount

	// Deduct quota and record transaction
	if costAmount > 0 {
		u.QuotaBalance -= costAmount
		if err := r.userRepo.UpdateUser(ctx, u); err != nil {
			return err
		}

		tx := &entity.QuotaTransaction{
			ID:          r.nextTxID,
			UserID:      log.UserID,
			Amount:      -costAmount,
			Type:        "deduction",
			ReferenceID: &log.ID,
			CreatedAt:   now,
		}
		r.nextTxID++
		r.transactions = append(r.transactions, tx)
	}

	// Record the request log in the shared log repository
	if err := r.logRepo.Create(ctx, log); err != nil {
		return err
	}
	log.CreatedAt = now

	return nil
}
