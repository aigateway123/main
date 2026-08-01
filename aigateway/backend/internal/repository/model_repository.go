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
	List(ctx context.Context, modelType string) ([]*entity.Model, error)
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
	r := &InMemoryModelRepository{
		items:  make(map[int64]*entity.Model),
		byCode: make(map[string]*entity.Model),
		nextID: 1,
	}

	// Seed default models for development
	now := time.Now()
	seedModels := []*entity.Model{
		{ModelName: "GPT-4o Mini", ModelCode: "gpt-4o-mini", ModelType: "chat", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
		{ModelName: "DeepSeek Chat", ModelCode: "deepseek-chat", ModelType: "chat", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
		{ModelName: "GLM-4", ModelCode: "glm-4", ModelType: "chat", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
		{ModelName: "Qwen Max", ModelCode: "qwen-max", ModelType: "chat", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
		{ModelName: "GLM-Image", ModelCode: "glm-image", ModelType: "image", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
		{ModelName: "Wan2.7-Image-Pro", ModelCode: "wan2.7-image-pro", ModelType: "image", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
		{ModelName: "Qwen-Image-2.0", ModelCode: "qwen-image-2.0", ModelType: "image", ModelStatus: "active", CreatedAt: now, UpdatedAt: now},
	}
	for _, m := range seedModels {
		m.ID = r.nextID
		r.nextID++
		r.items[m.ID] = m
		r.byCode[m.ModelCode] = m
	}

	return r
}

func (r *InMemoryModelRepository) Create(_ context.Context, m *entity.Model) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.byCode[m.ModelCode]; exists {
		return ErrDuplicateModelCode
	}

	if m.ModelType == "" {
		m.ModelType = "chat"
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

func (r *InMemoryModelRepository) List(_ context.Context, modelType string) ([]*entity.Model, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.Model
	for _, m := range r.items {
		if m.DeletedAt == nil {
			if modelType == "" || m.ModelType == modelType {
				result = append(result, m)
			}
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

	if m.ModelType == "" {
		m.ModelType = "chat"
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
