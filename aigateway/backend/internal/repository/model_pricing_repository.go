package repository

import (
	"context"
	"sync"

	"aigateway/backend/internal/entity"
)

type ModelPricingRepository interface {
	List(ctx context.Context) ([]*entity.ModelPricing, error)
	GetByModelID(ctx context.Context, modelID int64) (*entity.ModelPricing, error)
	Upsert(ctx context.Context, pricing *entity.ModelPricing) (*entity.ModelPricing, error)
}

type InMemoryModelPricingRepository struct {
	mu    sync.RWMutex
	byMID map[int64]*entity.ModelPricing
}

func NewInMemoryModelPricingRepository() *InMemoryModelPricingRepository {
	return &InMemoryModelPricingRepository{byMID: make(map[int64]*entity.ModelPricing)}
}

func (r *InMemoryModelPricingRepository) List(_ context.Context) ([]*entity.ModelPricing, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var out []*entity.ModelPricing
	for _, v := range r.byMID {
		out = append(out, v)
	}
	return out, nil
}

func (r *InMemoryModelPricingRepository) GetByModelID(_ context.Context, modelID int64) (*entity.ModelPricing, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	v, ok := r.byMID[modelID]
	if !ok {
		return nil, ErrPricingNotFound
	}
	return v, nil
}

func (r *InMemoryModelPricingRepository) Upsert(_ context.Context, pricing *entity.ModelPricing) (*entity.ModelPricing, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.byMID[pricing.ModelID] = pricing
	return pricing, nil
}

