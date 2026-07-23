package config

import (
	"fmt"
	"os"
)

type AppConfig struct {
	ServiceName string
	Port        string
	AppEnv      string
	LogLevel    string
	JWTSecret   string

	// Storage
	StorageDriver string // "memory" or "postgres"

	// PostgreSQL
	DatabaseURL string

	// Redis
	RedisURL      string
	RedisPassword string
}

func Load(serviceName string, defaultPort string) AppConfig {
	return AppConfig{
		ServiceName: serviceName,
		Port:        firstNonEmpty(os.Getenv(servicePortEnv(serviceName)), defaultPort),
		AppEnv:      firstNonEmpty(os.Getenv("APP_ENV"), "development"),
		LogLevel:    firstNonEmpty(os.Getenv("LOG_LEVEL"), "info"),
		JWTSecret:   firstNonEmpty(os.Getenv("JWT_SECRET"), "dev-jwt-secret-change-in-production"),

		StorageDriver: firstNonEmpty(os.Getenv("STORAGE_DRIVER"), "memory"),
		DatabaseURL:   buildDatabaseURL(),
		RedisURL:      firstNonEmpty(os.Getenv("REDIS_URL"), "localhost:6379"),
		RedisPassword: os.Getenv("REDIS_PASSWORD"),
	}
}

func buildDatabaseURL() string {
	if url := os.Getenv("DATABASE_URL"); url != "" {
		return url
	}

	host := firstNonEmpty(os.Getenv("DB_HOST"), "localhost")
	port := firstNonEmpty(os.Getenv("DB_PORT"), "5432")
	user := firstNonEmpty(os.Getenv("DB_USER"), "postgres")
	password := firstNonEmpty(os.Getenv("DB_PASSWORD"), "postgres")
	dbname := firstNonEmpty(os.Getenv("DB_NAME"), "nova_ai_gateway")
	sslmode := firstNonEmpty(os.Getenv("DB_SSLMODE"), "disable")

	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s", user, password, host, port, dbname, sslmode)
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}

	return ""
}

func servicePortEnv(serviceName string) string {
	switch serviceName {
	case "gateway":
		return "GATEWAY_PORT"
	case "policy-engine":
		return "POLICY_ENGINE_PORT"
	case "router-engine":
		return "ROUTER_ENGINE_PORT"
	case "auth-service":
		return "AUTH_SERVICE_PORT"
	case "billing-service":
		return "BILLING_SERVICE_PORT"
	default:
		return fmt.Sprintf("%s_PORT", serviceName)
	}
}
