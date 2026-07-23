package service

import "errors"

var (
	ErrInternal             = errors.New("internal error")
	ErrEmailExists          = errors.New("email already exists")
	ErrDuplicateName        = errors.New("name already exists")
	ErrDuplicateModelCode   = errors.New("model code already exists")
	ErrInvalidCredentials   = errors.New("invalid email or password")
	ErrUserNotFound         = errors.New("user not found")
	ErrUserDisabled         = errors.New("user is disabled")
	ErrApiKeyNotFound       = errors.New("api key not found")
	ErrProviderNotFound     = errors.New("provider not found")
	ErrModelNotFound        = errors.New("model not found")
	ErrModelDisabled        = errors.New("model is disabled")
	ErrPermissionDenied     = errors.New("permission denied")
	ErrInvalidToken         = errors.New("invalid or expired token")
	ErrInvalidApiKey        = errors.New("invalid api key")
	ErrApiKeyDisabled       = errors.New("api key is disabled")
	ErrNoProviderBound      = errors.New("no provider bound to this model")
	ErrNoProviderAvailable  = errors.New("no available provider")
)
