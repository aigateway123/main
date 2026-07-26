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
	writeError(w, http.StatusGone, "AUTH007", "Registration is no longer supported. Please contact admin.")
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
		case service.ErrInvalidCredentials:
			writeError(w, http.StatusUnauthorized, "AUTH006", "invalid email or password")
		case service.ErrUserDisabled:
			writeError(w, http.StatusUnauthorized, "AUTH003", "account is disabled")
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
		writeError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
		return
	}

	profile, err := c.svc.GetProfile(r.Context(), userID)
	if err != nil {
		switch err {
		case service.ErrUserDisabled:
			writeError(w, http.StatusUnauthorized, "AUTH003", "account is disabled")
		default:
			writeError(w, http.StatusNotFound, "AUTH002", "user not found")
		}
		return
	}

	writeJSON(w, http.StatusOK, types.APIResponse[*dto.ProfileResponse]{
		Code:    0,
		Message: "success",
		Data:    profile,
	})
}
