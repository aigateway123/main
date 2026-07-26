package middleware

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strings"

	"aigateway/backend/internal/controller"
	"aigateway/backend/internal/service"
)

func RBACMiddleware(rbacSvc *service.RBACService, logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			required := requiredPermissionForAdminRoute(r.Method, r.URL.Path)
			if required == "" {
				next.ServeHTTP(w, r)
				return
			}

			userID, ok := controller.UserIDFromContext(r.Context())
			if !ok {
				writeRBACError(w, http.StatusUnauthorized, "AUTH001", "missing authentication")
				return
			}

			has, err := rbacSvc.HasPermission(r.Context(), userID, required)
			if err != nil {
				logger.Error("rbac check failed", "error", err)
				writeRBACError(w, http.StatusInternalServerError, "GATEWAY001", "rbac check failed")
				return
			}
			if !has {
				writeRBACError(w, http.StatusForbidden, "AUTH004", "forbidden")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func requiredPermissionForAdminRoute(method string, path string) string {
	if !strings.HasPrefix(path, "/api/v1/admin/") {
		return ""
	}

	if strings.HasPrefix(path, "/api/v1/admin/users") {
		if path == "/api/v1/admin/users" {
			switch method {
			case http.MethodGet:
				return "admin:user:list"
			case http.MethodPost:
				return "admin:user:create"
			}
			return ""
		}

		if strings.HasSuffix(path, "/quota") {
			if method == http.MethodGet || method == http.MethodPut {
				return "admin:user:manage_quota"
			}
			return ""
		}

		if strings.HasSuffix(path, "/models") {
			if method == http.MethodGet || method == http.MethodPut {
				return "admin:user:manage_models"
			}
			return ""
		}

		if strings.HasSuffix(path, "/status") {
			if method == http.MethodPut {
				return "admin:user:manage"
			}
			return ""
		}

		if method == http.MethodGet {
			return "admin:user:list"
		}
		return "admin:user:manage"
	}

	if strings.HasPrefix(path, "/api/v1/admin/pricing") {
		return "admin:pricing:manage"
	}

	return ""
}

func writeRBACError(w http.ResponseWriter, status int, code string, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"code":    code,
		"message": message,
	})
}

