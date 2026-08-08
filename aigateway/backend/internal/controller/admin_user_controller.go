package controller

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

type AdminUserController struct {
	svc    *service.AdminUserService
	rbacSvc *service.RBACService
	logger *slog.Logger
}

func NewAdminUserController(svc *service.AdminUserService, rbacSvc *service.RBACService, logger *slog.Logger) *AdminUserController {
	return &AdminUserController{svc: svc, rbacSvc: rbacSvc, logger: logger}
}

func (c *AdminUserController) HandleListUsers(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	search := r.URL.Query().Get("search")
	if search == "" {
		search = r.URL.Query().Get("keyword")
	}
	status := r.URL.Query().Get("status")

	items, total, err := c.svc.ListStudents(r.Context(), page, pageSize, search, status)
	if err != nil {
		c.logger.Error("list students failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "list students failed")
		return
	}

	canViewPassword := c.canViewPassword(r)

	totalPages := total / pageSize
	if total%pageSize > 0 {
		totalPages++
	}

	if !canViewPassword {
		for _, item := range items {
			item.Password = ""
		}
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"items": items,
			"total": total,
			"pagination": map[string]int{
				"page":       page,
				"pageSize":   pageSize,
				"total":      total,
				"totalPages": totalPages,
			},
		},
	})
}

func (c *AdminUserController) HandleCreateUser(w http.ResponseWriter, r *http.Request) {
	var req dto.AdminCreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}
	if req.Email == "" || req.Password == "" || req.Nickname == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	result, err := c.svc.CreateStudent(r.Context(), &req)
	if err != nil {
		switch err {
		case service.ErrEmailExists:
			writeError(w, http.StatusConflict, "AUTH005", "email already exists")
		default:
			c.logger.Error("create student failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "create student failed")
		}
		return
	}

	writeJSON(w, http.StatusCreated, types.APIResponse[*dto.AdminUserItem]{
		Code:    0,
		Message: "success",
		Data:    result,
	})
}

func (c *AdminUserController) HandleGetUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	detail, err := c.svc.GetStudentDetail(r.Context(), id)
	if err != nil {
		switch err {
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		default:
			c.logger.Error("get student detail failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "get student detail failed")
		}
		return
	}

	if !c.canViewPassword(r) {
		detail.Password = ""
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.AdminUserDetail]{
		Code:    0,
		Message: "success",
		Data:    detail,
	})
}

func (c *AdminUserController) HandleResetPassword(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	var req dto.AdminResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}
	if req.Password == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if err := c.svc.ResetPassword(r.Context(), id, req.Password); err != nil {
		switch err {
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		case service.ErrInvalidArgument:
			writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		default:
			c.logger.Error("reset password failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "reset password failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"userId":   id,
			"password": req.Password,
		},
	})
}

func (c *AdminUserController) canViewPassword(r *http.Request) bool {
	if c.rbacSvc == nil {
		return false
	}
	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		return false
	}
	has, err := c.rbacSvc.HasPermission(r.Context(), userID, "admin:user:view_password")
	if err != nil {
		return false
	}
	return has
}

func (c *AdminUserController) HandleUpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	var req dto.AdminUpdateUserStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}
	if req.Status == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if err := c.svc.UpdateStudentStatus(r.Context(), id, req.Status); err != nil {
		switch err {
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		case service.ErrInvalidArgument:
			writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		default:
			c.logger.Error("update student status failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "update student status failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"userId":     id,
			"userStatus": req.Status,
		},
	})
}

func (c *AdminUserController) HandleGetQuota(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	quotaBalance, totalAllocated, totalSpent, lastTx, err := c.svc.GetStudentQuota(r.Context(), id)
	if err != nil {
		switch err {
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		default:
			c.logger.Error("get student quota failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "get student quota failed")
		}
		return
	}

	var last map[string]interface{}
	if lastTx != nil {
		last = map[string]interface{}{
			"id":        lastTx.ID,
			"amount":    lastTx.Amount,
			"type":      lastTx.Type,
			"createdAt": lastTx.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"userId":        id,
			"quotaBalance":  quotaBalance,
			"totalAllocated": totalAllocated,
			"totalSpent":    totalSpent,
			"lastTransaction": last,
		},
	})
}

func (c *AdminUserController) HandleSetQuota(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	var req dto.AdminSetQuotaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if err := c.svc.SetStudentQuota(r.Context(), id, req.Amount); err != nil {
		switch err {
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		case service.ErrInvalidArgument:
			writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		default:
			c.logger.Error("set student quota failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "set student quota failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"userId":       id,
			"quotaBalance": req.Amount,
		},
	})
}

func (c *AdminUserController) HandleGetModels(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	authorizedModels, allModels, err := c.svc.GetStudentModels(r.Context(), id)
	if err != nil {
		c.logger.Error("get student models failed", "error", err)
		writeError(w, http.StatusInternalServerError, "GATEWAY001", "get student models failed")
		return
	}

	authorizedSet := make(map[int64]struct{}, len(authorizedModels))
	for _, m := range authorizedModels {
		authorizedSet[m.ModelID] = struct{}{}
	}

	items := make([]map[string]interface{}, 0, len(allModels))
	for _, m := range allModels {
		_, authorized := authorizedSet[m.ModelID]
		items = append(items, map[string]interface{}{
			"modelId":   m.ModelID,
			"modelCode": m.ModelCode,
			"modelName": m.ModelName,
			"enabled":   authorized,
		})
	}

	writeJSON(w, http.StatusOK, types.APIResponse[[]map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data:    items,
	})
}

func (c *AdminUserController) HandleSetModels(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid user id")
		return
	}

	var req dto.AdminSetModelsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	count, err := c.svc.SetStudentModels(r.Context(), id, req.ModelIDs)
	if err != nil {
		switch err {
		case service.ErrInvalidArgument:
			writeError(w, http.StatusBadRequest, "VALID001", "only public models can be granted")
		case service.ErrUserNotFound:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		default:
			c.logger.Error("set student models failed", "error", err)
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "set student models failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"userId":              id,
			"authorizedModelCount": count,
		},
	})
}

