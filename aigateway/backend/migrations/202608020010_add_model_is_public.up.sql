-- Migration 010: Add is_public flag to models table.
-- Models with is_public = TRUE are accessible by all roles;
-- otherwise only users with explicit model permission can access.

ALTER TABLE models ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;
