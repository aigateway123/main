package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type ProviderRepository interface {
	Create(ctx context.Context, p *entity.Provider) error
	GetByID(ctx context.Context, id int64) (*entity.Provider, error)
	List(ctx context.Context) ([]*entity.Provider, error)
	Update(ctx context.Context, p *entity.Provider) error
	Delete(ctx context.Context, id int64) error
}

type InMemoryProviderRepository struct {
	mu       sync.RWMutex
	items    map[int64]*entity.Provider
	byName   map[string]*entity.Provider
	nextID   int64
}

func NewInMemoryProviderRepository() *InMemoryProviderRepository {
	r := &InMemoryProviderRepository{
		items:  make(map[int64]*entity.Provider),
		byName: make(map[string]*entity.Provider),
		nextID: 1,
	}

	// Seed default providers for development
	now := time.Now()
	seedProviders := []*entity.Provider{
		{ProviderName: "OpenAI", BaseURL: "https://api.openai.com", APIPath: "/v1/chat/completions", APIKeyRef: "OPENAI_API_KEY", Priority: 100, Weight: 100, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
		{ProviderName: "DeepSeek", BaseURL: "https://api.deepseek.com", APIPath: "/v1/chat/completions", APIKeyRef: "DEEPSEEK_API_KEY", Priority: 90, Weight: 100, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
		{ProviderName: "GLM", BaseURL: "https://open.bigmodel.cn/api/paas/v4", APIPath: "/v1/chat/completions", APIKeyRef: "GLM_API_KEY", Priority: 80, Weight: 100, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
		{ProviderName: "Qwen", BaseURL: "https://dashscope.aliyuncs.com/compatible-mode", APIPath: "/v1/chat/completions", APIKeyRef: "QWEN_API_KEY", Priority: 70, Weight: 100, IsEnabledFlag: true, CreatedAt: now, UpdatedAt: now},
	}
	for _, p := range seedProviders {
		p.ID = r.nextID
		r.nextID++
		r.items[p.ID] = p
		r.byName[p.ProviderName] = p
	}

	return r
}

func (r *InMemoryProviderRepository) Create(_ context.Context, p *entity.Provider) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.byName[p.ProviderName]; exists {
		return ErrDuplicateName
	}

	p.ID = r.nextID
	r.nextID++
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()

	r.items[p.ID] = p
	r.byName[p.ProviderName] = p
	return nil
}

func (r *InMemoryProviderRepository) GetByID(_ context.Context, id int64) (*entity.Provider, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	p, exists := r.items[id]
	if !exists {
		return nil, ErrProviderNotFound
	}
	return p, nil
}

func (r *InMemoryProviderRepository) List(_ context.Context) ([]*entity.Provider, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*entity.Provider
	for _, p := range r.items {
		if p.DeletedAt == nil {
			result = append(result, p)
		}
	}
	return result, nil
}

func (r *InMemoryProviderRepository) Update(_ context.Context, p *entity.Provider) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.items[p.ID]
	if !exists {
		return ErrProviderNotFound
	}

	if p.ProviderName != existing.ProviderName {
		if _, conflict := r.byName[p.ProviderName]; conflict {
			return ErrDuplicateName
		}
		delete(r.byName, existing.ProviderName)
		r.byName[p.ProviderName] = p
	}

	p.CreatedAt = existing.CreatedAt
	p.UpdatedAt = time.Now()
	r.items[p.ID] = p
	return nil
}

func (r *InMemoryProviderRepository) Delete(_ context.Context, id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, exists := r.items[id]
	if !exists {
		return ErrProviderNotFound
	}

	now := time.Now()
	existing.DeletedAt = &now
	delete(r.byName, existing.ProviderName)
	return nil
}
