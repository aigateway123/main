package controller

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/service"
	"aigateway/backend/internal/types"
)

type AuthController struct {
	svc    *service.AuthService
	logger *slog.Logger
}

func NewAuthController(svc *service.AuthService, logger *slog.Logger) *AuthController {
	return &AuthController{svc: svc, logger: logger}
}

func (c *AuthController) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req dto.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "email and password are required")
		return
	}

	result, err := c.svc.Register(r.Context(), &req)
	if err != nil {
		c.logger.Error("register failed", "error", err)
		switch err {
		case service.ErrEmailExists:
			writeError(w, http.StatusConflict, "AUTH005", "email already exists")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "registration failed")
		}
		return
	}

	writeJSON(w, http.StatusCreated, types.APIResponse[*dto.AuthResponse]{
		Code:    0,
		Message: "success",
		Data:    result,
	})
}

func (c *AuthController) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "VALID001", "invalid request body")
		return
	}

	if req.Email == "" || req.Password == "" {
		writeError(w, http.StatusBadRequest, "VALID001", "email and password are required")
		return
	}

	result, err := c.svc.Login(r.Context(), &req)
	if err != nil {
		c.logger.Error("login failed", "error", err)
		switch err {
		case service.ErrInvalidCredentials, service.ErrUserDisabled:
			writeError(w, http.StatusUnauthorized, "AUTH001", "invalid email or password")
		default:
			writeError(w, http.StatusInternalServerError, "GATEWAY001", "login failed")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.AuthResponse]{
		Code:    0,
		Message: "success",
		Data:    result,
	})
}

func (c *AuthController) HandleProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(ctxKeyUserID).(int64)
	if !ok {
		writeError(w, http.StatusUnauthorized, "AUTH002", "unauthorized")
		return
	}

	user, err := c.svc.GetUser(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[map[string]interface{}]{
		Code:    0,
		Message: "success",
		Data: map[string]interface{}{
			"userId":   user.ID,
			"email":    user.Email,
			"nickname": user.Nickname,
		},
	})
}
