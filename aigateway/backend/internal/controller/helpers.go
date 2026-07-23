package controller

import (
	"context"
	"encoding/json"
	"net/http"
)

type contextKey string

const ctxKeyUserID contextKey = "userID"
const ctxKeyEmail contextKey = "email"

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, code string, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"code":    code,
		"message": message,
	})
}

func UserIDFromContext(ctx context.Context) (int64, bool) {
	id, ok := ctx.Value(ctxKeyUserID).(int64)
	return id, ok
}

func UserIDFromContextKey() contextKey {
	return ctxKeyUserID
}

func EmailFromContextKey() contextKey {
	return ctxKeyEmail
}
