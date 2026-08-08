package repository

import (
	"context"
	"errors"
	"sync"
	"time"

	"aigateway/backend/internal/entity"
)

type RBACRepository interface {
	GetRoleNameByID(ctx context.Context, roleID int64) (string, error)
	GetRoleIDByName(ctx context.Context, name string) (int64, error)
	ListPermissionCodesByRoleID(ctx context.Context, roleID int64) ([]string, error)
	ListRoles(ctx context.Context) ([]*entity.Role, error)
	CreateRole(ctx context.Context, name string, description string) (*entity.Role, error)
	UpdateRole(ctx context.Context, id int64, name string, description string) error
	DeleteRole(ctx context.Context, id int64) error
	ListPermissions(ctx context.Context) ([]*entity.Permission, error)
	UpdateRolePermissions(ctx context.Context, roleID int64, permissionIDs []int64) error
	GetRoleWithPermissions(ctx context.Context, roleID int64) (int64, string, *string, bool, []entity.Permission, error)
}

type InMemoryRBACRepository struct {
	mu                sync.RWMutex
	roleIDByName      map[string]int64
	roleNameByID      map[int64]string
	roleDescsByID     map[int64]string
	roleIsSystemByID  map[int64]bool
	permissionByRole  map[int64][]string
	roles             []*entity.Role
	nextRoleID        int64
	permissions       []*entity.Permission
	permissionIDByCode map[string]int64
	permissionCodeByID map[int64]string
	nextPermID        int64
	rolePerms         map[int64][]int64
}

func NewInMemoryRBACRepository() *InMemoryRBACRepository {
	adminRoleID := int64(1)
	studentRoleID := int64(2)

	adminDesc := "系统管理员，拥有全部管理功能权限"
	studentDesc := "学生用户，仅能使用 API 和查看个人用量"

	adminPerms := []string{
		"dashboard:view",
		"api_key:manage",
		"api_key:create",
		"api_key:delete",
		"billing:view_self",
		"admin:user:list",
		"admin:user:create",
		"admin:user:manage",
		"admin:user:manage_quota",
		"admin:user:manage_models",
		"admin:user:view_password",
		"admin:role:manage",
		"admin:pricing:manage",
		"admin:billing:view",
		"admin:billing:report",
		"admin:provider:manage",
		"admin:model:manage",
	}

	studentPerms := []string{
		"dashboard:view",
		"api_key:manage",
		"api_key:create",
		"api_key:delete",
		"billing:view_self",
	}

	now := time.Now()
	systemRoles := []*entity.Role{
		{ID: adminRoleID, Name: "Admin", Description: &adminDesc, IsSystem: true, CreatedAt: now, UpdatedAt: now},
		{ID: studentRoleID, Name: "Student", Description: &studentDesc, IsSystem: true, CreatedAt: now, UpdatedAt: now},
	}

	permNameByCode := map[string]string{
		"dashboard:view":         "查看仪表盘",
		"api_key:manage":         "管理 API Key",
		"api_key:create":         "创建 API Key",
		"api_key:delete":         "删除 API Key",
		"billing:view_self":      "查看个人用量",
		"admin:user:list":        "查看学生列表",
		"admin:user:create":      "创建学生账号",
		"admin:user:manage":      "管理学生账号",
		"admin:user:manage_quota": "管理学生额度",
		"admin:user:manage_models": "管理学生模型授权",
		"admin:user:view_password": "查看账号密码",
		"admin:role:manage":      "管理角色权限",
		"admin:pricing:manage":   "管理模型定价",
		"admin:billing:view":      "查看全平台用量",
		"admin:billing:report":   "查看账单报表",
		"admin:provider:manage":  "管理 Provider",
		"admin:model:manage":     "管理 Model",
	}

	permDescByCode := map[string]string{
		"dashboard:view":          "访问仪表盘页面",
		"api_key:manage":          "查看和管理 API Key",
		"api_key:create":          "创建新的 API Key",
		"api_key:delete":          "删除 API Key",
		"billing:view_self":       "查看个人额度和用量明细",
		"admin:user:list":         "查看所有学生账号列表",
		"admin:user:create":       "创建新的学生账号",
		"admin:user:manage":       "启用/禁用学生账号",
		"admin:user:manage_quota": "查看和设置学生额度",
		"admin:user:manage_models": "指定学生可用模型列表",
		"admin:role:manage":       "创建/编辑/删除角色和权限",
		"admin:pricing:manage":    "查看和修改模型定价配置",
		"admin:billing:view":      "查看全平台用量统计和明细",
		"admin:billing:report":   "查看和导出账单报表",
		"admin:provider:manage":   "管理 AI Provider 配置",
		"admin:model:manage":      "管理模型配置",
	}

	allPermissions := []*entity.Permission{}
	permIDByCode := make(map[string]int64)
	permCodeByID := make(map[int64]string)
	nextPermID := int64(1)
	allPermCodes := append([]string{}, adminPerms...)
	seen := make(map[string]bool)
	for _, c := range allPermCodes {
		if !seen[c] {
			seen[c] = true
			permName := permNameByCode[c]
			if permName == "" {
				permName = c
			}
			permDesc := permDescByCode[c]
			permModule := c
			if idx := stringsLastIndex(c, ":"); idx >= 0 {
				permModule = c[:idx]
			}
			allPermissions = append(allPermissions, &entity.Permission{
				ID: nextPermID, Code: c, Name: permName, Module: permModule, Description: &permDesc, CreatedAt: now,
			})
			permIDByCode[c] = nextPermID
			permCodeByID[nextPermID] = c
			nextPermID++
		}
	}
	// Add student perms too
	for _, c := range studentPerms {
		if !seen[c] {
			seen[c] = true
			permName := permNameByCode[c]
			if permName == "" {
				permName = c
			}
			permDesc := permDescByCode[c]
			permModule := c
			if idx := stringsLastIndex(c, ":"); idx >= 0 {
				permModule = c[:idx]
			}
			allPermissions = append(allPermissions, &entity.Permission{
				ID: nextPermID, Code: c, Name: permName, Module: permModule, Description: &permDesc, CreatedAt: now,
			})
			permIDByCode[c] = nextPermID
			permCodeByID[nextPermID] = c
			nextPermID++
		}
	}

	r := &InMemoryRBACRepository{
		roleIDByName: map[string]int64{
			"Admin":   adminRoleID,
			"Student": studentRoleID,
		},
		roleNameByID: map[int64]string{
			adminRoleID:   "Admin",
			studentRoleID: "Student",
		},
		roleDescsByID: map[int64]string{
			adminRoleID:   adminDesc,
			studentRoleID: studentDesc,
		},
		roleIsSystemByID: map[int64]bool{
			adminRoleID:   true,
			studentRoleID: true,
		},
		permissionByRole: map[int64][]string{
			adminRoleID:   adminPerms,
			studentRoleID: studentPerms,
		},
		roles:             systemRoles,
		nextRoleID:        3,
		permissions:       allPermissions,
		permissionIDByCode: permIDByCode,
		permissionCodeByID: permCodeByID,
		nextPermID:        nextPermID,
		rolePerms:         make(map[int64][]int64),
	}
	// Initialize rolePerms
	for _, role := range systemRoles {
		var permIDs []int64
		for _, code := range r.permissionByRole[role.ID] {
			if pid, ok := r.permissionIDByCode[code]; ok {
				permIDs = append(permIDs, pid)
			}
		}
		r.rolePerms[role.ID] = permIDs
	}
	return r
}

func stringsLastIndex(s, substr string) int {
	idx := -1
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			idx = i
		}
	}
	return idx
}

func (r *InMemoryRBACRepository) GetRoleNameByID(_ context.Context, roleID int64) (string, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	name, ok := r.roleNameByID[roleID]
	if !ok {
		return "", ErrRoleNotFound
	}
	return name, nil
}

func (r *InMemoryRBACRepository) GetRoleIDByName(_ context.Context, name string) (int64, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	id, ok := r.roleIDByName[name]
	if !ok {
		return 0, ErrRoleNotFound
	}
	return id, nil
}

func (r *InMemoryRBACRepository) ListPermissionCodesByRoleID(_ context.Context, roleID int64) ([]string, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	codes, ok := r.permissionByRole[roleID]
	if !ok {
		return nil, ErrRoleNotFound
	}
	out := make([]string, 0, len(codes))
	out = append(out, codes...)
	return out, nil
}

func (r *InMemoryRBACRepository) ListRoles(_ context.Context) ([]*entity.Role, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	out := make([]*entity.Role, len(r.roles))
	for i, role := range r.roles {
		cp := *role
		out[i] = &cp
	}
	return out, nil
}

func (r *InMemoryRBACRepository) CreateRole(_ context.Context, name string, description string) (*entity.Role, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.roleIDByName[name]; ok {
		return nil, ErrDuplicateName
	}

	now := time.Now()
	desc := description
	role := &entity.Role{
		ID:          r.nextRoleID,
		Name:        name,
		Description: &desc,
		IsSystem:    false,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	r.nextRoleID++
	r.roles = append(r.roles, role)
	r.roleIDByName[name] = role.ID
	r.roleNameByID[role.ID] = name
	r.roleDescsByID[role.ID] = description
	r.roleIsSystemByID[role.ID] = false
	r.permissionByRole[role.ID] = []string{}
	r.rolePerms[role.ID] = []int64{}
	return role, nil
}

func (r *InMemoryRBACRepository) UpdateRole(_ context.Context, id int64, name string, description string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.roleNameByID[id]; !ok {
		return ErrRoleNotFound
	}

	// Check system role name change restriction
	if r.roleIsSystemByID[id] {
		oldName := r.roleNameByID[id]
		if name != oldName {
			return errors.New("cannot rename system role")
		}
	}

	// Update name map if changed
	oldName := r.roleNameByID[id]
	if oldName != name {
		delete(r.roleIDByName, oldName)
		r.roleIDByName[name] = id
	}
	r.roleNameByID[id] = name
	r.roleDescsByID[id] = description

	// Update the role in the slice
	for _, role := range r.roles {
		if role.ID == id {
			role.Name = name
			role.Description = &description
			role.UpdatedAt = time.Now()
			break
		}
	}
	return nil
}

func (r *InMemoryRBACRepository) DeleteRole(_ context.Context, id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.roleNameByID[id]; !ok {
		return ErrRoleNotFound
	}
	if r.roleIsSystemByID[id] {
		return errors.New("cannot delete system role")
	}

	name := r.roleNameByID[id]
	delete(r.roleIDByName, name)
	delete(r.roleNameByID, id)
	delete(r.roleDescsByID, id)
	delete(r.roleIsSystemByID, id)
	delete(r.permissionByRole, id)
	delete(r.rolePerms, id)

	var filtered []*entity.Role
	for _, role := range r.roles {
		if role.ID != id {
			filtered = append(filtered, role)
		}
	}
	r.roles = filtered
	return nil
}

func (r *InMemoryRBACRepository) ListPermissions(_ context.Context) ([]*entity.Permission, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	out := make([]*entity.Permission, len(r.permissions))
	for i, p := range r.permissions {
		cp := *p
		out[i] = &cp
	}
	return out, nil
}

func (r *InMemoryRBACRepository) UpdateRolePermissions(_ context.Context, roleID int64, permissionIDs []int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.roleNameByID[roleID]; !ok {
		return ErrRoleNotFound
	}

	r.rolePerms[roleID] = permissionIDs
	var codes []string
	for _, pid := range permissionIDs {
		if code, ok := r.permissionCodeByID[pid]; ok {
			codes = append(codes, code)
		}
	}
	r.permissionByRole[roleID] = codes
	return nil
}

func (r *InMemoryRBACRepository) GetRoleWithPermissions(_ context.Context, roleID int64) (int64, string, *string, bool, []entity.Permission, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	name, ok := r.roleNameByID[roleID]
	if !ok {
		return 0, "", nil, false, nil, ErrRoleNotFound
	}
	desc := r.roleDescsByID[roleID]
	isSystem := r.roleIsSystemByID[roleID]
	codes := r.permissionByRole[roleID]

	assignedSet := make(map[string]bool)
	for _, c := range codes {
		assignedSet[c] = true
	}

	perms := make([]entity.Permission, 0, len(r.permissions))
	for _, p := range r.permissions {
		cp := *p
		perms = append(perms, cp)
	}
	return roleID, name, &desc, isSystem, perms, nil
}

