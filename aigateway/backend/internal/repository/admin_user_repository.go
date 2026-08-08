package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type AdminUserRepository interface {
	ListByRoleID(ctx context.Context, roleID int64, search string, status string, offset int, limit int) ([]*entity.User, int, error)
	UpdateStatus(ctx context.Context, userID int64, status string) error
	SetQuotaBalance(ctx context.Context, userID int64, newBalance float64) error
	GetLastQuotaTransaction(ctx context.Context, userID int64) (*entity.QuotaTransaction, error)
	GetQuotaTotals(ctx context.Context, userID int64) (totalAllocated float64, totalSpent float64, error error)
	UpdatePassword(ctx context.Context, userID int64, passwordHash string, plainPassword string) error
}

type InMemoryAdminUserRepository struct {
	mu           sync.RWMutex
	userRepo     *InMemoryUserRepository
	transactions []*entity.QuotaTransaction
	nextTxID     int64
}

func NewInMemoryAdminUserRepository(userRepo *InMemoryUserRepository) *InMemoryAdminUserRepository {
	return &InMemoryAdminUserRepository{
		userRepo:     userRepo,
		transactions: make([]*entity.QuotaTransaction, 0),
		nextTxID:     1,
	}
}

func (r *InMemoryAdminUserRepository) ListByRoleID(ctx context.Context, roleID int64, search string, status string, offset int, limit int) ([]*entity.User, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	all := r.userRepo.ListAll(ctx)
	var filtered []*entity.User
	for _, u := range all {
		if u.RoleID == nil || *u.RoleID != roleID {
			continue
		}
		if search != "" {
			if !contains(u.Email, search) && !contains(u.Nickname, search) {
				continue
			}
		}
		if status != "" && u.UserStatus != status {
			continue
		}
		filtered = append(filtered, u)
	}

	total := len(filtered)

	// Apply pagination
	if offset >= len(filtered) {
		return []*entity.User{}, total, nil
	}
	end := offset + limit
	if end > len(filtered) {
		end = len(filtered)
	}

	return filtered[offset:end], total, nil
}

func (r *InMemoryAdminUserRepository) UpdateStatus(ctx context.Context, userID int64, status string) error {
	u, err := r.userRepo.GetByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}
	u.UserStatus = status
	return r.userRepo.UpdateUser(ctx, u)
}

func (r *InMemoryAdminUserRepository) UpdatePassword(ctx context.Context, userID int64, passwordHash string, plainPassword string) error {
	u, err := r.userRepo.GetByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}
	u.PasswordHash = passwordHash
	u.PlainPassword = &plainPassword
	return r.userRepo.UpdateUser(ctx, u)
}

func (r *InMemoryAdminUserRepository) SetQuotaBalance(ctx context.Context, userID int64, newBalance float64) error {
	u, err := r.userRepo.GetByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	delta := newBalance - u.QuotaBalance
	u.QuotaBalance = newBalance

	if err := r.userRepo.UpdateUser(ctx, u); err != nil {
		return err
	}

	now := time.Now()
	tx := &entity.QuotaTransaction{
		ID:        r.nextTxID,
		UserID:    userID,
		Amount:    delta,
		Type:      "admin_allocation",
		CreatedAt: now,
	}
	r.nextTxID++
	r.transactions = append(r.transactions, tx)

	return nil
}

func (r *InMemoryAdminUserRepository) GetLastQuotaTransaction(_ context.Context, userID int64) (*entity.QuotaTransaction, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var last *entity.QuotaTransaction
	for _, tx := range r.transactions {
		if tx.UserID == userID {
			if last == nil || tx.CreatedAt.After(last.CreatedAt) {
				cp := *tx
				last = &cp
			}
		}
	}
	return last, nil
}

func (r *InMemoryAdminUserRepository) GetQuotaTotals(_ context.Context, userID int64) (totalAllocated float64, totalSpent float64, error error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, tx := range r.transactions {
		if tx.UserID == userID {
			if tx.Type == "admin_allocation" && tx.Amount > 0 {
				totalAllocated += tx.Amount
			} else if tx.Type == "deduction" {
				totalSpent += -tx.Amount
			}
		}
	}
	return totalAllocated, totalSpent, nil
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 || (len(s) > 0 && len(substr) > 0 && containsStr(s, substr)))
}

func containsStr(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
