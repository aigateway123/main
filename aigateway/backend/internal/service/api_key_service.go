package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log/slog"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type ApiKeyService struct {
	keyRepo  repository.ApiKeyRepository
	userRepo repository.UserRepository
	logger   *slog.Logger
}

func NewApiKeyService(keyRepo repository.ApiKeyRepository, userRepo repository.UserRepository, logger *slog.Logger) *ApiKeyService {
	return &ApiKeyService{
		keyRepo:  keyRepo,
		userRepo: userRepo,
		logger:   logger,
	}
}

func (s *ApiKeyService) Create(ctx context.Context, userID int64, req *dto.CreateApiKeyRequest) (*dto.ApiKeyResponse, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, ErrUserNotFound
	}
	if user.UserStatus != "active" {
		return nil, ErrUserDisabled
	}

	rawKey := generateApiKey()
	prefix := rawKey[:12]
	hash := hashApiKey(rawKey)

	key := &entity.ApiKey{
		UserID:          user.ID,
		KeyPrefix:       prefix,
		KeyHash:         hash,
		PermissionScope: req.PermissionScope,
		KeyStatus:       "active",
	}

	if err := s.keyRepo.Create(ctx, key); err != nil {
		return nil, ErrInternal
	}

	return &dto.ApiKeyResponse{
		ID:              key.ID,
		UserID:          key.UserID,
		KeyPrefix:       key.KeyPrefix,
		FullKey:         rawKey,
		PermissionScope: key.PermissionScope,
		KeyStatus:       key.KeyStatus,
		CreatedAt:       key.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}, nil
}

func (s *ApiKeyService) ListByUser(ctx context.Context, userID int64) ([]*dto.ApiKeyResponse, error) {
	keys, err := s.keyRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, ErrInternal
	}

	var result []*dto.ApiKeyResponse
	for _, key := range keys {
		result = append(result, &dto.ApiKeyResponse{
			ID:              key.ID,
			UserID:          key.UserID,
			KeyPrefix:       key.KeyPrefix,
			PermissionScope: key.PermissionScope,
			KeyStatus:       key.KeyStatus,
			CreatedAt:       key.CreatedAt.Format("2006-01-02T15:04:05Z"),
		})
	}
	return result, nil
}

func (s *ApiKeyService) Revoke(ctx context.Context, id int64, userID int64) error {
	key, err := s.keyRepo.GetByID(ctx, id)
	if err != nil {
		return ErrApiKeyNotFound
	}
	if key.UserID != userID {
		return ErrPermissionDenied
	}
	return s.keyRepo.UpdateStatus(ctx, id, "revoked")
}

func generateApiKey() string {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}
	return fmt.Sprintf("sk-campus-%s", hex.EncodeToString(bytes))
}

func hashApiKey(key string) string {
	h := sha256.Sum256([]byte(key))
	return hex.EncodeToString(h[:])
}
