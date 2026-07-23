package repository

import (
	"context"

	"aigateway/backend/internal/entity"
)

type HealthRepository interface {
	Check(context.Context) (entity.ServiceHealth, error)
}

type StaticHealthRepository struct {
	serviceName string
	appEnv      string
}

func NewStaticHealthRepository(serviceName string, appEnv string) *StaticHealthRepository {
	return &StaticHealthRepository{
		serviceName: serviceName,
		appEnv:      appEnv,
	}
}

func (r *StaticHealthRepository) Check(_ context.Context) (entity.ServiceHealth, error) {
	return entity.ServiceHealth{
		Service: r.serviceName,
		Status:  "ok",
		Env:     r.appEnv,
	}, nil
}
