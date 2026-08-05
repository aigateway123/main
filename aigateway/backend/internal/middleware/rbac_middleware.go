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
	if !strings.HasPrefix(path, "/api/v1/") {
		return ""
	}

	// Model management: only roles with admin:model:manage can create/update/delete models or bind providers.
	// Model listing stays open so all roles can discover available models.
	if strings.HasPrefix(path, "/api/v1/models") || strings.HasPrefix(path, "/api/v1/bindings") {
		switch method {
		case http.MethodGet, http.MethodHead:
			return ""
		default:
			return "admin:model:manage"
		}
	}

	// Provider management: mutations require admin:provider:manage.
	if strings.HasPrefix(path, "/api/v1/providers") {
		switch method {
		case http.MethodGet, http.MethodHead:
			return ""
		default:
			return "admin:provider:manage"
		}
	}

	// Billing report endpoints require admin:billing:report.
	// Note: this must be checked BEFORE the /api/v1/admin/ guard below,
	// because report routes live under /api/v1/billing/report.
	if strings.HasPrefix(path, "/api/v1/billing/report") {
		return "admin:billing:report"
	}

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

	if strings.HasPrefix(path, "/api/v1/admin/roles") || strings.HasPrefix(path, "/api/v1/admin/permissions") {
		return "admin:role:manage"
	}

	if strings.HasPrefix(path, "/api/v1/admin/billing") {
		if strings.HasSuffix(path, "/summary") {
			return "admin:billing:view"
		}
		if strings.HasSuffix(path, "/usage") {
			return "admin:billing:view"
		}
		return "admin:billing:view"
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

