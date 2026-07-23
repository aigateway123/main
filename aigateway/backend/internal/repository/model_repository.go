package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type ModelRepository interface {
	Create(ctx context.Context, m *entity.Model) error
	GetByID(ctx context.Context, id int64) (*entity.Model, error)
	GetByCode(ctx context.Context, code string) (*entity.Model, error)
	List(ctx context.Context) ([]*entity.Model, error)
	Update(ctx context.Context, m *entity.Model) error
	Delete(ctx context.Context, id int64) error
}

type ModelBindingRepository interface {
	Create(ctx context.Context, b *entity.ModelProviderBinding) error
	ListByModelID(ctx context.Context, modelID int64) ([]*entity.ModelProviderBinding, error)
	DeleteByID(ctx context.Context, id int64) error
}

type InMemoryModelRepository struct {
	mu       sync.RWMutex
	items    map[int64]*entity.Model
	byCode   map[string]*entity.Model
	nextID   int64
}

func NewInMemoryModelRepository() *InMemoryModelRepository {
	return &InMemoryModelRepository{
		items:  make(map[int64]*entity.Model),
		byCode: make(map[string]*entity.Model),
		nextID: 1,
	}
}

func (r *InMemoryModelRepository) Create(_ context.Context, m *entity.Model) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.byCode[m.ModelCode]; exists {
		return ErrDuplicateModelCode
	}

	m.ID = r.nextID
	r.nextID++
	m.CreatedAt = time.Now()
	m.UpdatedAt = time.Now()

	r.items[m.ID] = m
	r.byCode[m.ModelCode] = m
	return nil
}

func (r *InMemoryModelRepository) GetByID(_ context.Context, id int64) (*entity.Model, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	m, exists := r.items[id]
	if !exists {
		return nil, ErrModelNotFound
	}
	return m, nil
}

func (r *InMemoryModelRepository) GetByCode(_ context.Context, code string) (*entity.Model, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	m, exists := r.byCode[code]
	if !exists {
		return nil, ErrModelNotFound
	}
	return m, nil
}

func (r *InMemoryModelRepository) List(_ context.Context) ([]*entity.Model, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.Model
	for _, m := range r.items {
		if m.DeletedAt == nil {
			result = append(result, m)
		}
	}
	return result, nil
}

func (r *InMemoryModelRepository) Update(_ context.Context, m *entity.Model) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.items[m.ID]
	if !exists {
		return ErrModelNotFound
	}

	if m.ModelCode != existing.ModelCode {
		if _, conflict := r.byCode[m.ModelCode]; conflict {
			return ErrDuplicateModelCode
		}
		delete(r.byCode, existing.ModelCode)
		r.byCode[m.ModelCode] = m
	}

	m.CreatedAt = existing.CreatedAt
	m.UpdatedAt = time.Now()
	r.items[m.ID] = m
	return nil
}

func (r *InMemoryModelRepository) Delete(_ context.Context, id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.items[id]
	if !exists {
		return ErrModelNotFound
	}

	now := time.Now()
	existing.DeletedAt = &now
	delete(r.byCode, existing.ModelCode)
	return nil
}

type InMemoryModelBindingRepository struct {
	mu       sync.RWMutex
	items    map[int64]*entity.ModelProviderBinding
	byModel  map[int64]map[int64]*entity.ModelProviderBinding
	nextID   int64
}

func NewInMemoryModelBindingRepository() *InMemoryModelBindingRepository {
	return &InMemoryModelBindingRepository{
		items:   make(map[int64]*entity.ModelProviderBinding),
		byModel: make(map[int64]map[int64]*entity.ModelProviderBinding),
		nextID:  1,
	}
}

func (r *InMemoryModelBindingRepository) Create(_ context.Context, b *entity.ModelProviderBinding) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	b.ID = r.nextID
	r.nextID++
	b.CreatedAt = time.Now()
	b.UpdatedAt = time.Now()

	r.items[b.ID] = b
	if r.byModel[b.ModelID] == nil {
		r.byModel[b.ModelID] = make(map[int64]*entity.ModelProviderBinding)
	}
	r.byModel[b.ModelID][b.ProviderID] = b
	return nil
}

func (r *InMemoryModelBindingRepository) ListByModelID(_ context.Context, modelID int64) ([]*entity.ModelProviderBinding, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	bindings, exists := r.byModel[modelID]
	if !exists {
		return nil, nil
	}

	var result []*entity.ModelProviderBinding
	for _, b := range bindings {
		if b.DeletedAt == nil {
			result = append(result, b)
		}
	}
	return result, nil
}

func (r *InMemoryModelBindingRepository) DeleteByID(_ context.Context, id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	b, exists := r.items[id]
	if !exists {
		return ErrBindingNotFound
	}

	now := time.Now()
	b.DeletedAt = &now

	if r.byModel[b.ModelID] != nil {
		delete(r.byModel[b.ModelID], b.ProviderID)
	}
	return nil
}
