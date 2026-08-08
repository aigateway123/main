package service

import "errors"

var (
	ErrInternal             = errors.New("internal error")
	ErrInvalidArgument      = errors.New("invalid argument")
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
	ErrQuotaExceeded        = errors.New("quota balance is insufficient")
	ErrModelForbidden       = errors.New("model is not authorized for this user")
	ErrQuotaNotFound        = errors.New("quota not found")
	ErrPricingNotFound      = errors.New("pricing not found")
)

// ValidationError 表示请求参数校验失败（映射为 HTTP 400）。
// 可通过 errors.Is(err, ErrInvalidArgument) 匹配，Message 为用户可读的具体原因。
type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string { return e.Message }

func (e *ValidationError) Is(target error) bool { return target == ErrInvalidArgument }
