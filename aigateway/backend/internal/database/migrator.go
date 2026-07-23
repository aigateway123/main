package database

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// RunMigrations reads all *.up.sql files from migrationsDir, sorts them by filename,
// and executes any that have not yet been recorded in the schema_migrations table.
// If migrationsDir does not exist, it returns nil (skip).
func RunMigrations(db *sql.DB, migrationsDir string) error {
	// Create schema_migrations table if not exists
	createTable := `CREATE TABLE IF NOT EXISTS schema_migrations (
		version VARCHAR(255) PRIMARY KEY,
		applied_at TIMESTAMPTZ DEFAULT NOW()
	)`
	if _, err := db.Exec(createTable); err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}

	// Read migration directory
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		if os.IsNotExist(err) {
			slog.Warn("migrations directory not found, skipping", "dir", migrationsDir)
			return nil
		}
		return fmt.Errorf("failed to read migrations directory %s: %w", migrationsDir, err)
	}

	// Filter and sort .up.sql files
	var upFiles []string
	for _, entry := range entries {
		if !entry.IsDir() && strings.HasSuffix(entry.Name(), ".up.sql") {
			upFiles = append(upFiles, entry.Name())
		}
	}
	sort.Strings(upFiles)

	for _, fileName := range upFiles {
		// version is the prefix up to the first underscore
		version := fileName
		if idx := strings.Index(fileName, "_"); idx != -1 {
			version = fileName[:idx]
		}

		// Check if already applied
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", version).Scan(&exists)
		if err != nil {
			return fmt.Errorf("failed to check migration %s: %w", version, err)
		}
		if exists {
			slog.Debug("migration already applied, skipping", "version", version)
			continue
		}

		// Read and execute migration file
		content, err := os.ReadFile(filepath.Join(migrationsDir, fileName))
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", fileName, err)
		}

		sqlStr := string(content)
		if _, err := db.Exec(sqlStr); err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", fileName, err)
		}

		// Record migration
		if _, err := db.Exec("INSERT INTO schema_migrations (version) VALUES ($1)", version); err != nil {
			return fmt.Errorf("failed to record migration %s: %w", version, err)
		}

		slog.Info("migration applied", "version", version, "file", fileName)
	}

	slog.Info("all migrations up to date")
	return nil
}
