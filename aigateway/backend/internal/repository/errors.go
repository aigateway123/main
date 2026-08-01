package repository

import "errors"

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrDuplicateEmail     = errors.New("email already exists")
	ErrDuplicateName      = errors.New("name already exists")
	ErrDuplicateModelCode = errors.New("model code already exists")
	ErrApiKeyNotFound     = errors.New("api key not found")
	ErrSessionNotFound    = errors.New("session not found")
	ErrProviderNotFound   = errors.New("provider not found")
	ErrModelNotFound      = errors.New("model not found")
	ErrBindingNotFound    = errors.New("binding not found")
	ErrRoleNotFound       = errors.New("role not found")
	ErrPricingNotFound    = errors.New("pricing not found")
	ErrDuplicatePricing   = errors.New("duplicate pricing configuration")
	ErrQuotaNotFound      = errors.New("quota not found")
	ErrDuplicateQuota     = errors.New("duplicate quota configuration")
)
