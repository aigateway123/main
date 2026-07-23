package middleware

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"strings"

	"aigateway/backend/internal/controller"
	"aigateway/backend/internal/service"
)

func AuthMiddleware(authSvc *service.AuthService, logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				writeAuthError(w, "AUTH001", "missing authorization header")
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
				writeAuthError(w, "AUTH002", "invalid authorization format")
				return
			}

			token := parts[1]

			// Try JWT validation first (for admin routes)
			userID, email, err := authSvc.ValidateAccessToken(token)
			if err != nil {
				writeAuthError(w, "AUTH002", "invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), controller.UserIDFromContextKey(), userID)
			ctx = context.WithValue(ctx, controller.EmailFromContextKey(), email)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func ApiKeyMiddleware(authSvc *service.AuthService, logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				writeAuthError(w, "AUTH001", "missing authorization header")
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
				writeAuthError(w, "AUTH002", "invalid authorization format")
				return
			}

			token := parts[1]

			// Try JWT validation
			userID, email, err := authSvc.ValidateAccessToken(token)
			if err != nil {
				writeAuthError(w, "AUTH002", "invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), controller.UserIDFromContextKey(), userID)
			ctx = context.WithValue(ctx, controller.EmailFromContextKey(), email)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func writeAuthError(w http.ResponseWriter, code string, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(map[string]string{
		"code":    code,
		"message": message,
	})
}
