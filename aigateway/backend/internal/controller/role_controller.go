package controller

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

type RoleController struct {
	svc    *service.RBACService
	logger *slog.Logger
}

func NewRoleController(svc *service.RBACService, logger *slog.Logger) *RoleController {
	return &RoleController{svc: svc, logger: logger}
}

// HandleListRoles handles GET /api/v1/admin/roles
func (c *RoleController) HandleListRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := c.svc.ListRoles(r.Context())
	if err != nil {
		c.logger.Error("list roles failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list roles failed")
		return
	}

	items := make([]map[string]interface{}, 0, len(roles))
	for _, role := range roles {
		permCount, _ := countPermsForRole(r.Context(), c.svc, role.ID)
		items = append(items, map[string]interface{}{
			"id":              role.ID,
			"name":            role.Name,
			"description":     role.Description,
			"isSystem":        role.IsSystem,
			"permissionCount": permCount,
			"createdAt":       role.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data:    items,
	})
}

// HandleCreateRole handles POST /api/v1/admin/roles
func (c *RoleController) HandleCreateRole(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	role, err := c.svc.CreateRole(r.Context(), req.Name, req.Description)
	if err != nil {
		switch err {
		case service.ErrDuplicateName:
			writeError(w, http.StatusConflict, "CONFLICT", "role name already exists")
		case service.ErrInvalidArgument:
			writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		default:
			c.logger.Error("create role failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "create role failed")
		}
		return
	}

	writeJSON(w, http.StatusCreated, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"id":          role.ID,
			"name":        role.Name,
			"description": role.Description,
			"isSystem":    role.IsSystem,
			"createdAt":   role.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		},
	})
}

// HandleGetRole handles GET /api/v1/admin/roles/{id}
func (c *RoleController) HandleGetRole(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid role id")
		return
	}

	rid, name, description, isSystem, perms, err := c.svc.GetRoleByID(r.Context(), id)
	if err != nil {
		c.logger.Error("get role failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get role failed")
		return
	}

	rolePerms, _ := c.svc.ListUserPermissionsForRole(r.Context(), rid)

	permSet := make(map[string]bool)
	for _, c := range rolePerms {
		permSet[c] = true
	}

	permItems := make([]map[string]interface{}, 0, len(perms))
	for _, p := range perms {
		permItems = append(permItems, map[string]interface{}{
			"id":        p.ID,
			"code":      p.Code,
			"name":      p.Name,
			"module":    p.Module,
			"assigned":  permSet[p.Code],
		})
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"id":          rid,
			"name":        name,
			"description": description,
			"isSystem":    isSystem,
			"permissions": permItems,
		},
	})
}

// HandleUpdateRole handles PUT /api/v1/admin/roles/{id}
func (c *RoleController) HandleUpdateRole(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid role id")
		return
	}

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if err := c.svc.UpdateRole(r.Context(), id, req.Name, req.Description); err != nil {
		switch err {
		case service.ErrInvalidArgument:
			writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		default:
			c.logger.Error("update role failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "update role failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data:    map[string]interface{}{"id": id},
	})
}

// HandleDeleteRole handles DELETE /api/v1/admin/roles/{id}
func (c *RoleController) HandleDeleteRole(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid role id")
		return
	}

	if err := c.svc.DeleteRole(r.Context(), id); err != nil {
		c.logger.Error("delete role failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "delete role failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data:    map[string]interface{}{"id": id},
	})
}

// HandleUpdateRolePermissions handles PUT /api/v1/admin/roles/{id}/permissions
func (c *RoleController) HandleUpdateRolePermissions(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid role id")
		return
	}

	var req struct {
		PermissionIDs []int64 `json:"permissionIds"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if err := c.svc.UpdateRolePermissions(r.Context(), id, req.PermissionIDs); err != nil {
		c.logger.Error("update role permissions failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "update role permissions failed")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"roleId":          id,
			"permissionCount": len(req.PermissionIDs),
		},
	})
}

// HandleListPermissions handles GET /api/v1/admin/permissions
func (c *RoleController) HandleListPermissions(w http.ResponseWriter, r *http.Request) {
	perms, err := c.svc.ListPermissions(r.Context())
	if err != nil {
		c.logger.Error("list permissions failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list permissions failed")
		return
	}

	items := make([]map[string]interface{}, 0, len(perms))
	for _, p := range perms {
		desc := ""
		if p.Description != nil {
			desc = *p.Description
		}
		items = append(items, map[string]interface{}{
			"id":          p.ID,
			"code":        p.Code,
			"name":        p.Name,
			"description": desc,
			"module":      p.Module,
		})
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data:    items,
	})
}

func countPermsForRole(ctx context.Context, svc *service.RBACService, roleID int64) (int, error) {
	codes, err := svc.ListUserPermissionsForRole(ctx, roleID)
	if err != nil {
		return 0, err
	}
	return len(codes), nil
}
