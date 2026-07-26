package repository

import (
	"context"
	"sync"
)

type UserModelPermissionRepository interface {
	Exists(ctx context.Context, userID int64, modelID int64) (bool, error)
	ListModelIDsByUserID(ctx context.Context, userID int64) ([]int64, error)
	ReplaceByUserID(ctx context.Context, userID int64, modelIDs []int64) (int, error)
}

type InMemoryUserModelPermissionRepository struct {
	mu     sync.RWMutex
	byUser map[int64]map[int64]struct{}
}

func NewInMemoryUserModelPermissionRepository() *InMemoryUserModelPermissionRepository {
	return &InMemoryUserModelPermissionRepository{byUser: make(map[int64]map[int64]struct{})}
}

func (r *InMemoryUserModelPermissionRepository) Exists(_ context.Context, userID int64, modelID int64) (bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	m, ok := r.byUser[userID]
	if !ok {
		return false, nil
	}
	_, ok = m[modelID]
	return ok, nil
}

func (r *InMemoryUserModelPermissionRepository) ListModelIDsByUserID(_ context.Context, userID int64) ([]int64, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	m, ok := r.byUser[userID]
	if !ok {
		return nil, nil
	}
	out := make([]int64, 0, len(m))
	for id := range m {
		out = append(out, id)
	}
	return out, nil
}

func (r *InMemoryUserModelPermissionRepository) ReplaceByUserID(_ context.Context, userID int64, modelIDs []int64) (int, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	m := make(map[int64]struct{}, len(modelIDs))
	for _, id := range modelIDs {
		m[id] = struct{}{}
	}
	r.byUser[userID] = m
	return len(m), nil
}

