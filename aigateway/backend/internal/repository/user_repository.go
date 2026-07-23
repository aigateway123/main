package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type UserRepository interface {
	Create(ctx context.Context, user *entity.User) error
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	GetByID(ctx context.Context, id int64) (*entity.User, error)
}

type InMemoryUserRepository struct {
	mu     sync.RWMutex
	users  map[int64]*entity.User
	byMail map[string]*entity.User
	nextID int64
}

func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{
		users:  make(map[int64]*entity.User),
		byMail: make(map[string]*entity.User),
		nextID: 1,
	}
}

func (r *InMemoryUserRepository) Create(_ context.Context, user *entity.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.byMail[user.Email]; exists {
		return ErrDuplicateEmail
	}

	user.ID = r.nextID
	r.nextID++
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	r.users[user.ID] = user
	r.byMail[user.Email] = user
	return nil
}

func (r *InMemoryUserRepository) GetByEmail(_ context.Context, email string) (*entity.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, exists := r.byMail[email]
	if !exists {
		return nil, ErrUserNotFound
	}
	return user, nil
}

func (r *InMemoryUserRepository) GetByID(_ context.Context, id int64) (*entity.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, exists := r.users[id]
	if !exists {
		return nil, ErrUserNotFound
	}
	return user, nil
}
