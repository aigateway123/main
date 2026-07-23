package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type ApiKeyRepository interface {
	Create(ctx context.Context, key *entity.ApiKey) error
	GetByUserID(ctx context.Context, userID int64) ([]*entity.ApiKey, error)
	GetByPrefix(ctx context.Context, prefix string) (*entity.ApiKey, error)
	UpdateStatus(ctx context.Context, id int64, status string) error
	GetByID(ctx context.Context, id int64) (*entity.ApiKey, error)
}

type InMemoryApiKeyRepository struct {
	mu       sync.RWMutex
	keys     map[int64]*entity.ApiKey
	byPrefix map[string]*entity.ApiKey
	nextID   int64
}

func NewInMemoryApiKeyRepository() *InMemoryApiKeyRepository {
	return &InMemoryApiKeyRepository{
		keys:     make(map[int64]*entity.ApiKey),
		byPrefix: make(map[string]*entity.ApiKey),
		nextID:   1,
	}
}

func (r *InMemoryApiKeyRepository) Create(_ context.Context, key *entity.ApiKey) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	key.ID = r.nextID
	r.nextID++
	key.CreatedAt = time.Now()
	key.UpdatedAt = time.Now()

	r.keys[key.ID] = key
	r.byPrefix[key.KeyPrefix] = key
	return nil
}

func (r *InMemoryApiKeyRepository) GetByUserID(_ context.Context, userID int64) ([]*entity.ApiKey, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.ApiKey
	for _, key := range r.keys {
		if key.UserID == userID && key.DeletedAt == nil {
			result = append(result, key)
		}
	}
	return result, nil
}

func (r *InMemoryApiKeyRepository) GetByPrefix(_ context.Context, prefix string) (*entity.ApiKey, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	key, exists := r.byPrefix[prefix]
	if !exists {
		return nil, ErrApiKeyNotFound
	}
	return key, nil
}

func (r *InMemoryApiKeyRepository) UpdateStatus(_ context.Context, id int64, status string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	key, exists := r.keys[id]
	if !exists {
		return ErrApiKeyNotFound
	}
	key.KeyStatus = status
	key.UpdatedAt = time.Now()
	return nil
}

func (r *InMemoryApiKeyRepository) GetByID(_ context.Context, id int64) (*entity.ApiKey, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	key, exists := r.keys[id]
	if !exists {
		return nil, ErrApiKeyNotFound
	}
	return key, nil
}
