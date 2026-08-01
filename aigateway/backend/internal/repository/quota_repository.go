package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type QuotaRepository interface {
	Create(ctx context.Context, q *entity.Quota) error
	GetByID(ctx context.Context, id int64) (*entity.Quota, error)
	GetByUserAndModel(ctx context.Context, userID int64, modelCode string) (*entity.Quota, error)
	GetByUserID(ctx context.Context, userID int64) ([]*entity.Quota, error)
	List(ctx context.Context) ([]*entity.Quota, error)
	Update(ctx context.Context, q *entity.Quota) error
	Consume(ctx context.Context, userID int64, modelCode string, tokens int, requests int) error
}

type InMemoryQuotaRepository struct {
	mu        sync.RWMutex
	items     map[int64]*entity.Quota
	byUserKey map[int64]map[string]*entity.Quota // userID -> "modelCode_or_empty" -> Quota
	nextID    int64
}

func NewInMemoryQuotaRepository() *InMemoryQuotaRepository {
	return &InMemoryQuotaRepository{
		items:     make(map[int64]*entity.Quota),
		byUserKey: make(map[int64]map[string]*entity.Quota),
		nextID:    1,
	}
}

func (r *InMemoryQuotaRepository) Create(_ context.Context, q *entity.Quota) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if um, ok := r.byUserKey[q.UserID]; ok {
		if _, exists := um[q.ModelCode]; exists {
			return ErrDuplicateQuota
		}
	}

	q.ID = r.nextID
	r.nextID++
	q.CreatedAt = time.Now()
	q.UpdatedAt = time.Now()

	r.items[q.ID] = q

	if r.byUserKey[q.UserID] == nil {
		r.byUserKey[q.UserID] = make(map[string]*entity.Quota)
	}
	r.byUserKey[q.UserID][q.ModelCode] = q
	return nil
}

func (r *InMemoryQuotaRepository) GetByID(_ context.Context, id int64) (*entity.Quota, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	q, exists := r.items[id]
	if !exists {
		return nil, ErrQuotaNotFound
	}
	return q, nil
}

func (r *InMemoryQuotaRepository) GetByUserAndModel(_ context.Context, userID int64, modelCode string) (*entity.Quota, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	um, ok := r.byUserKey[userID]
	if !ok {
		return nil, ErrQuotaNotFound
	}

	q, exists := um[modelCode]
	if !exists {
		return nil, ErrQuotaNotFound
	}
	return q, nil
}

func (r *InMemoryQuotaRepository) GetByUserID(_ context.Context, userID int64) ([]*entity.Quota, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	um, ok := r.byUserKey[userID]
	if !ok {
		return nil, nil
	}

	var result []*entity.Quota
	for _, q := range um {
		result = append(result, q)
	}
	return result, nil
}

func (r *InMemoryQuotaRepository) List(_ context.Context) ([]*entity.Quota, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.Quota
	for _, q := range r.items {
		result = append(result, q)
	}
	return result, nil
}

func (r *InMemoryQuotaRepository) Update(_ context.Context, q *entity.Quota) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.items[q.ID]
	if !exists {
		return ErrQuotaNotFound
	}

	// Check unique constraint if userID or modelCode changed
	if q.UserID != existing.UserID || q.ModelCode != existing.ModelCode {
		if um, ok := r.byUserKey[q.UserID]; ok {
			if _, conflict := um[q.ModelCode]; conflict {
				return ErrDuplicateQuota
			}
		}
	}

	q.CreatedAt = existing.CreatedAt
	q.UpdatedAt = time.Now()
	r.items[q.ID] = q

	// Update index
	if q.UserID != existing.UserID || q.ModelCode != existing.ModelCode {
		if oldUM, has := r.byUserKey[existing.UserID]; has {
			delete(oldUM, existing.ModelCode)
		}
	}
	if r.byUserKey[q.UserID] == nil {
		r.byUserKey[q.UserID] = make(map[string]*entity.Quota)
	}
	r.byUserKey[q.UserID][q.ModelCode] = q
	return nil
}

func (r *InMemoryQuotaRepository) Consume(_ context.Context, userID int64, modelCode string, tokens int, requests int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	um, ok := r.byUserKey[userID]
	if !ok {
		return ErrQuotaNotFound
	}

	q, exists := um[modelCode]
	if !exists {
		// Try global quota
		q, exists = um[""]
		if !exists {
			return ErrQuotaNotFound
		}
	}

	q.UsedTokens += int64(tokens)
	q.UsedRequests += int64(requests)
	q.UpdatedAt = time.Now()
	r.items[q.ID] = q
	r.byUserKey[userID][q.ModelCode] = q
	return nil
}
