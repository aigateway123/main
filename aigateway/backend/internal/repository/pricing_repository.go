package repository

import (
	"context"
	"strings"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type PricingRepository interface {
	Create(ctx context.Context, p *entity.Pricing) error
	GetByID(ctx context.Context, id int64) (*entity.Pricing, error)
	GetByModelAndProvider(ctx context.Context, modelCode string, providerID int64) (*entity.Pricing, error)
	List(ctx context.Context) ([]*entity.Pricing, error)
	Update(ctx context.Context, p *entity.Pricing) error
}

type InMemoryPricingRepository struct {
	mu      sync.RWMutex
	items   map[int64]*entity.Pricing
	byModel map[string]map[int64]*entity.Pricing // modelCode(->lowercase) -> providerID -> pricing
	nextID  int64
}

func NewInMemoryPricingRepository() *InMemoryPricingRepository {
	return &InMemoryPricingRepository{
		items:   make(map[int64]*entity.Pricing),
		byModel: make(map[string]map[int64]*entity.Pricing),
		nextID:  1,
	}
}

func (r *InMemoryPricingRepository) Create(_ context.Context, p *entity.Pricing) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	key := strings.ToLower(p.ModelCode)
	if pm, ok := r.byModel[key]; ok {
		if existing, ok := pm[p.ProviderID]; ok {
			if existing.DeletedAt == nil && existing.EffectiveFrom.Equal(p.EffectiveFrom) {
				return ErrDuplicatePricing
			}
		}
	}

	p.ID = r.nextID
	r.nextID++
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()

	r.items[p.ID] = p

	if r.byModel[key] == nil {
		r.byModel[key] = make(map[int64]*entity.Pricing)
	}
	r.byModel[key][p.ProviderID] = p
	return nil
}

func (r *InMemoryPricingRepository) GetByID(_ context.Context, id int64) (*entity.Pricing, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	p, exists := r.items[id]
	if !exists || p.DeletedAt != nil {
		return nil, ErrPricingNotFound
	}
	return p, nil
}

func (r *InMemoryPricingRepository) GetByModelAndProvider(_ context.Context, modelCode string, providerID int64) (*entity.Pricing, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	key := strings.ToLower(modelCode)
	pm, ok := r.byModel[key]
	if !ok {
		return nil, ErrPricingNotFound
	}

	p, ok := pm[providerID]
	if !ok || p.DeletedAt != nil {
		return nil, ErrPricingNotFound
	}

	now := time.Now()
	if now.Before(p.EffectiveFrom) {
		return nil, ErrPricingNotFound
	}
	if p.EffectiveTo != nil && now.After(*p.EffectiveTo) {
		return nil, ErrPricingNotFound
	}

	return p, nil
}

func (r *InMemoryPricingRepository) List(_ context.Context) ([]*entity.Pricing, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.Pricing
	for _, p := range r.items {
		if p.DeletedAt == nil {
			result = append(result, p)
		}
	}
	return result, nil
}

func (r *InMemoryPricingRepository) Update(_ context.Context, p *entity.Pricing) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.items[p.ID]
	if !exists || existing.DeletedAt != nil {
		return ErrPricingNotFound
	}

	key := strings.ToLower(p.ModelCode)
	pm, ok := r.byModel[key]
	if !ok {
		return ErrPricingNotFound
	}

	if pm[p.ProviderID] == nil || pm[p.ProviderID].ID != p.ID {
		return ErrPricingNotFound
	}

	p.CreatedAt = existing.CreatedAt
	p.UpdatedAt = time.Now()
	r.items[p.ID] = p

	// Update byModel index
	oldKey := strings.ToLower(existing.ModelCode)
	if oldKey != key || existing.ProviderID != p.ProviderID {
		if oldPM, has := r.byModel[oldKey]; has {
			delete(oldPM, existing.ProviderID)
		}
	}
	r.byModel[key][p.ProviderID] = p
	return nil
}
