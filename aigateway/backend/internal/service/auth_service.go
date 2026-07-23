package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"golang.org/x/crypto/bcrypt"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type AuthService struct {
	userRepo    repository.UserRepository
	sessionRepo repository.SessionRepository
	logger      *slog.Logger
	jwtSecret   string
}

func NewAuthService(
	userRepo repository.UserRepository,
	sessionRepo repository.SessionRepository,
	logger *slog.Logger,
	jwtSecret string,
) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		logger:      logger,
		jwtSecret:   jwtSecret,
	}
}

func (s *AuthService) Register(ctx context.Context, req *dto.RegisterRequest) (*dto.AuthResponse, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, ErrInternal
	}

	user := &entity.User{
		Email:        req.Email,
		Nickname:     req.Nickname,
		PasswordHash: string(hash),
		UserStatus:   "active",
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		if errors.Is(err, repository.ErrDuplicateEmail) {
			return nil, ErrEmailExists
		}
		return nil, ErrInternal
	}

	accessToken, err := s.generateAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, ErrInternal
	}

	refreshToken, err := s.createSession(ctx, user.ID)
	if err != nil {
		return nil, ErrInternal
	}

	return &dto.AuthResponse{
		UserID:       user.ID,
		Email:        user.Email,
		Nickname:     user.Nickname,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	if user.UserStatus != "active" {
		return nil, ErrUserDisabled
	}

	accessToken, err := s.generateAccessToken(user.ID, user.Email)
	if err != nil {
		return nil, ErrInternal
	}

	refreshToken, err := s.createSession(ctx, user.ID)
	if err != nil {
		return nil, ErrInternal
	}

	return &dto.AuthResponse{
		UserID:       user.ID,
		Email:        user.Email,
		Nickname:     user.Nickname,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *AuthService) ValidateAccessToken(token string) (int64, string, error) {
	return validateJWT(token, s.jwtSecret)
}

func (s *AuthService) GetUser(ctx context.Context, userID int64) (*entity.User, error) {
	return s.userRepo.GetByID(ctx, userID)
}

func (s *AuthService) generateAccessToken(userID int64, email string) (string, error) {
	return generateJWT(userID, email, s.jwtSecret, 24*time.Hour)
}

func (s *AuthService) createSession(ctx context.Context, userID int64) (string, error) {
	refreshBytes := make([]byte, 32)
	if _, err := rand.Read(refreshBytes); err != nil {
		return "", fmt.Errorf("failed to generate refresh token: %w", err)
	}
	refreshToken := hex.EncodeToString(refreshBytes)
	refreshHash := sha256.Sum256([]byte(refreshToken))

	session := &entity.UserSession{
		UserID:           userID,
		RefreshTokenHash: hex.EncodeToString(refreshHash[:]),
		ExpiresAt:        time.Now().Add(7 * 24 * time.Hour),
	}

	if err := s.sessionRepo.Create(ctx, session); err != nil {
		return "", err
	}

	return refreshToken, nil
}
