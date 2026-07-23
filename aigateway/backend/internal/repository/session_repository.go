package repository

import (
	"context"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type SessionRepository interface {
	Create(ctx context.Context, session *entity.UserSession) error
	GetByUserID(ctx context.Context, userID int64) (*entity.UserSession, error)
	DeleteByUserID(ctx context.Context, userID int64) error
}

type InMemorySessionRepository struct {
	mu       sync.RWMutex
	sessions map[int64]*entity.UserSession
	nextID   int64
}

func NewInMemorySessionRepository() *InMemorySessionRepository {
	return &InMemorySessionRepository{
		sessions: make(map[int64]*entity.UserSession),
		nextID:   1,
	}
}

func (r *InMemorySessionRepository) Create(_ context.Context, session *entity.UserSession) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	session.ID = r.nextID
	r.nextID++
	session.CreatedAt = time.Now()

	r.sessions[session.UserID] = session
	return nil
}

func (r *InMemorySessionRepository) GetByUserID(_ context.Context, userID int64) (*entity.UserSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	session, exists := r.sessions[userID]
	if !exists {
		return nil, ErrSessionNotFound
	}
	return session, nil
}

func (r *InMemorySessionRepository) DeleteByUserID(_ context.Context, userID int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.sessions, userID)
	return nil
}
