package service

import (
	"context"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type AdminUserService struct {
	userRepo         repository.UserRepository
	adminUserRepo    repository.AdminUserRepository
	rbacRepo         repository.RBACRepository
	keyRepo          repository.ApiKeyRepository
	modelRepo        repository.ModelRepository
	userModelPermRepo repository.UserModelPermissionRepository
}

func NewAdminUserService(
	userRepo repository.UserRepository,
	adminUserRepo repository.AdminUserRepository,
	rbacRepo repository.RBACRepository,
	keyRepo repository.ApiKeyRepository,
	modelRepo repository.ModelRepository,
	userModelPermRepo repository.UserModelPermissionRepository,
) *AdminUserService {
	return &AdminUserService{
		userRepo:         userRepo,
		adminUserRepo:    adminUserRepo,
		rbacRepo:         rbacRepo,
		keyRepo:          keyRepo,
		modelRepo:        modelRepo,
		userModelPermRepo: userModelPermRepo,
	}
}

func (s *AdminUserService) ListStudents(ctx context.Context, page int, pageSize int, search string, status string) ([]*dto.AdminUserItem, int, error) {
	roleID, err := s.rbacRepo.GetRoleIDByName(ctx, "Student")
	if err != nil {
		return nil, 0, ErrInternal
	}

	offset := (page - 1) * pageSize
	users, total, err := s.adminUserRepo.ListByRoleID(ctx, roleID, search, status, offset, pageSize)
	if err != nil {
		return nil, 0, ErrInternal
	}

	roleName := "Student"
	result := make([]*dto.AdminUserItem, 0, len(users))
	for _, u := range users {
		result = append(result, &dto.AdminUserItem{
			ID:           u.ID,
			Email:        u.Email,
			Nickname:     u.Nickname,
			Role:         roleName,
			UserStatus:   u.UserStatus,
			QuotaBalance: u.QuotaBalance,
			Password:     strPtr(u.PlainPassword),
			CreatedAt:    u.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	return result, total, nil
}

func strPtr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func (s *AdminUserService) CreateStudent(ctx context.Context, req *dto.AdminCreateUserRequest) (*dto.AdminUserItem, error) {
	roleID, err := s.rbacRepo.GetRoleIDByName(ctx, "Student")
	if err != nil {
		return nil, ErrInternal
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, ErrInternal
	}

	rid := roleID
	user := &entity.User{
		Email:         req.Email,
		Nickname:      req.Nickname,
		PasswordHash:  string(hash),
		PlainPassword: &req.Password,
		UserStatus:    "active",
		RoleID:        &rid,
		QuotaBalance:  0,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		if errors.Is(err, repository.ErrDuplicateEmail) {
			return nil, ErrEmailExists
		}
		return nil, ErrInternal
	}

	rawKey := generateApiKey()
	prefix := rawKey
	if len(rawKey) > 12 {
		prefix = rawKey[:12]
	}
	key := &entity.ApiKey{
		UserID:          user.ID,
		KeyPrefix:       prefix,
		KeyHash:         hashApiKey(rawKey),
		PermissionScope: "default",
		KeyStatus:       "active",
	}
	_ = s.keyRepo.Create(ctx, key)

	return &dto.AdminUserItem{
		ID:           user.ID,
		Email:        user.Email,
		Nickname:     user.Nickname,
		Role:         "Student",
		UserStatus:   user.UserStatus,
		QuotaBalance: user.QuotaBalance,
		Password:     strPtr(user.PlainPassword),
		CreatedAt:    user.CreatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *AdminUserService) ResetPassword(ctx context.Context, userID int64, password string) error {
	if password == "" {
		return ErrInvalidArgument
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return ErrInternal
	}
	if err := s.adminUserRepo.UpdatePassword(ctx, userID, string(hash), password); err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return ErrUserNotFound
		}
		return ErrInternal
	}
	return nil
}

func (s *AdminUserService) UpdateStudentStatus(ctx context.Context, userID int64, status string) error {
	if status != "active" && status != "disabled" {
		return ErrInvalidArgument
	}
	if err := s.adminUserRepo.UpdateStatus(ctx, userID, status); err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return ErrUserNotFound
		}
		return ErrInternal
	}
	return nil
}

func (s *AdminUserService) SetStudentQuota(ctx context.Context, userID int64, amount float64) error {
	if amount < 0 {
		return ErrInvalidArgument
	}
	if err := s.adminUserRepo.SetQuotaBalance(ctx, userID, amount); err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			return ErrUserNotFound
		}
		return ErrInternal
	}
	return nil
}

func (s *AdminUserService) GetStudentDetail(ctx context.Context, userID int64) (*dto.AdminUserDetail, error) {
	u, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	roleName := "Student"
	if u.RoleID != nil {
		if rn, err := s.rbacRepo.GetRoleNameByID(ctx, *u.RoleID); err == nil {
			roleName = rn
		}
	}

	_, totalSpent, err := s.adminUserRepo.GetQuotaTotals(ctx, userID)
	if err != nil {
		totalSpent = 0
	}

	totalRequests := 0

	return &dto.AdminUserDetail{
		ID:            u.ID,
		Email:         u.Email,
		Nickname:      u.Nickname,
		Role:          roleName,
		RoleID:        u.RoleID,
		UserStatus:    u.UserStatus,
		QuotaBalance:  u.QuotaBalance,
		TotalSpent:    totalSpent,
		TotalRequests: totalRequests,
		Password:      strPtr(u.PlainPassword),
		CreatedAt:     u.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:     u.UpdatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

func (s *AdminUserService) GetStudentQuota(ctx context.Context, userID int64) (quotaBalance float64, totalAllocated float64, totalSpent float64, lastTx *entity.QuotaTransaction, err error) {
	u, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return 0, 0, 0, nil, ErrUserNotFound
	}
	totalAllocated, totalSpent, err = s.adminUserRepo.GetQuotaTotals(ctx, userID)
	if err != nil {
		return 0, 0, 0, nil, ErrInternal
	}
	lastTx, err = s.adminUserRepo.GetLastQuotaTransaction(ctx, userID)
	if err != nil {
		return 0, 0, 0, nil, ErrInternal
	}
	return u.QuotaBalance, totalAllocated, totalSpent, lastTx, nil
}

func (s *AdminUserService) GetStudentModels(ctx context.Context, userID int64) ([]*dto.AdminAuthorizedModelItem, []*dto.AdminModelWithAuthFlag, error) {
	authorizedIDs, err := s.userModelPermRepo.ListModelIDsByUserID(ctx, userID)
	if err != nil {
		return nil, nil, ErrInternal
	}
	authorizedSet := make(map[int64]struct{}, len(authorizedIDs))
	for _, id := range authorizedIDs {
		authorizedSet[id] = struct{}{}
	}

	models, err := s.modelRepo.List(ctx, "")
	if err != nil {
		return nil, nil, ErrInternal
	}

	allModels := make([]*dto.AdminModelWithAuthFlag, 0, len(models))
	authorizedModels := make([]*dto.AdminAuthorizedModelItem, 0, len(authorizedIDs))

	now := time.Now().Format("2006-01-02 15:04:05")
	for _, m := range models {
		// Only public models are configurable in the account model permission popup.
		if !m.IsPublic {
			continue
		}
		_, ok := authorizedSet[m.ID]
		allModels = append(allModels, &dto.AdminModelWithAuthFlag{
			ModelID:    m.ID,
			ModelName:  m.ModelName,
			ModelCode:  m.ModelCode,
			Authorized: ok,
		})
		if ok {
			authorizedModels = append(authorizedModels, &dto.AdminAuthorizedModelItem{
				ModelID:      m.ID,
				ModelName:    m.ModelName,
				ModelCode:    m.ModelCode,
				AuthorizedAt: now,
			})
		}
	}
	return authorizedModels, allModels, nil
}

func (s *AdminUserService) SetStudentModels(ctx context.Context, userID int64, modelIDs []int64) (int, error) {
	// Only public models are allowed for grant.
	models, err := s.modelRepo.List(ctx, "")
	if err != nil {
		return 0, ErrInternal
	}
	publicSet := make(map[int64]struct{}, len(models))
	for _, m := range models {
		if m.IsPublic {
			publicSet[m.ID] = struct{}{}
		}
	}
	for _, id := range modelIDs {
		if _, ok := publicSet[id]; !ok {
			return 0, ErrInvalidArgument
		}
	}

	count, err := s.userModelPermRepo.ReplaceByUserID(ctx, userID, modelIDs)
	if err != nil {
		return 0, ErrInternal
	}
	return count, nil
}

