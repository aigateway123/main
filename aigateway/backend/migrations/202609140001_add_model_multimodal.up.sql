-- Migration: Add supports_multimodal to models
-- Marks whether a model accepts multimodal (image etc.) input.
-- Non-goal for now: gateway-side enforcement. This field is a capability flag only.

ALTER TABLE models ADD COLUMN supports_multimodal BOOLEAN NOT NULL DEFAULT FALSE;
