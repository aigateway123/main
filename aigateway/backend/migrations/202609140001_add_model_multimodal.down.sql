-- Rollback: Remove supports_multimodal from models

ALTER TABLE models DROP COLUMN IF EXISTS supports_multimodal;
