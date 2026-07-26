package service

import (
	"context"
	"errors"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type RBACService struct {
	userRepo repository.UserRepository
	rbacRepo repository.RBACRepository
}

func NewRBACService(userRepo repository.UserRepository, rbacRepo repository.RBACRepository) *RBACService {
	return &RBACService{
		userRepo: userRepo,
		rbacRepo: rbacRepo,
	}
}

func (s *RBACService) GetUserRole(ctx context.Context, userID int64) (roleID int64, roleName string, err error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return 0, "", ErrUserNotFound
	}
	if user.RoleID == nil {
		return 0, "", ErrInternal
	}
	roleName, err = s.rbacRepo.GetRoleNameByID(ctx, *user.RoleID)
	if err != nil {
		if errors.Is(err, repository.ErrRoleNotFound) {
			return 0, "", ErrInternal
		}
		return 0, "", ErrInternal
	}
	return *user.RoleID, roleName, nil
}

func (s *RBACService) ListUserPermissions(ctx context.Context, userID int64) ([]string, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, ErrUserNotFound
	}
	if user.RoleID == nil {
		return nil, ErrInternal
	}
	codes, err := s.rbacRepo.ListPermissionCodesByRoleID(ctx, *user.RoleID)
	if err != nil {
		return nil, ErrInternal
	}
	return codes, nil
}

func (s *RBACService) HasPermission(ctx context.Context, userID int64, permissionCode string) (bool, error) {
	codes, err := s.ListUserPermissions(ctx, userID)
	if err != nil {
		return false, err
	}
	for _, c := range codes {
		if c == permissionCode {
			return true, nil
		}
	}
	return false, nil
}

func (s *RBACService) ListRoles(ctx context.Context) ([]*entity.Role, error) {
	return s.rbacRepo.ListRoles(ctx)
}

func (s *RBACService) CreateRole(ctx context.Context, name string, description string) (*entity.Role, error) {
	if name == "" {
		return nil, ErrInvalidArgument
	}
	role, err := s.rbacRepo.CreateRole(ctx, name, description)
	if err != nil {
		if errors.Is(err, repository.ErrDuplicateName) {
			return nil, ErrDuplicateName
		}
		return nil, ErrInternal
	}
	return role, nil
}

func (s *RBACService) GetRoleByID(ctx context.Context, id int64) (roleID int64, name string, description *string, isSystem bool, permissions []entity.Permission, err error) {
	rid, n, desc, sys, perms, repoErr := s.rbacRepo.GetRoleWithPermissions(ctx, id)
	if repoErr != nil {
		if errors.Is(repoErr, repository.ErrRoleNotFound) {
			return 0, "", nil, false, nil, ErrInternal
		}
		return 0, "", nil, false, nil, ErrInternal
	}
	return rid, n, desc, sys, perms, nil
}

func (s *RBACService) UpdateRole(ctx context.Context, id int64, name string, description string) error {
	if name == "" {
		return ErrInvalidArgument
	}
	err := s.rbacRepo.UpdateRole(ctx, id, name, description)
	if err != nil {
		if errors.Is(err, repository.ErrRoleNotFound) {
			return ErrInternal
		}
		return ErrInternal
	}
	return nil
}

func (s *RBACService) DeleteRole(ctx context.Context, id int64) error {
	err := s.rbacRepo.DeleteRole(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrRoleNotFound) {
			return ErrInternal
		}
		return ErrInternal
	}
	return nil
}

func (s *RBACService) UpdateRolePermissions(ctx context.Context, roleID int64, permissionIDs []int64) error {
	err := s.rbacRepo.UpdateRolePermissions(ctx, roleID, permissionIDs)
	if err != nil {
		if errors.Is(err, repository.ErrRoleNotFound) {
			return ErrInternal
		}
		return ErrInternal
	}
	return nil
}

func (s *RBACService) ListPermissions(ctx context.Context) ([]*entity.Permission, error) {
	return s.rbacRepo.ListPermissions(ctx)
}

func (s *RBACService) ListUserPermissionsForRole(ctx context.Context, roleID int64) ([]string, error) {
	codes, err := s.rbacRepo.ListPermissionCodesByRoleID(ctx, roleID)
	if err != nil {
		if err == repository.ErrRoleNotFound {
			return nil, ErrInternal
		}
		return nil, ErrInternal
	}
	return codes, nil
}

