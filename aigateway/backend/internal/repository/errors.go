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
)
