package logger

import (
	"log/slog"
	"os"
	"strings"
)

func New(level string, serviceName string) *slog.Logger {
	slogLevel := slog.LevelInfo

	switch strings.ToLower(level) {
	case "debug":
		slogLevel = slog.LevelDebug
	case "warn":
		slogLevel = slog.LevelWarn
	case "error":
		slogLevel = slog.LevelError
	}

	handler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		Level: slogLevel,
	})

	return slog.New(handler).With("service", serviceName)
}
