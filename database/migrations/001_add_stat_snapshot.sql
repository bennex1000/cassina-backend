-- Add stat snapshot caching to user_progression
-- This stores pre-calculated stats for performance

ALTER TABLE user_progression
ADD COLUMN active_stats_snapshot JSONB,
ADD COLUMN snapshot_generated_at TIMESTAMP;

COMMENT ON COLUMN user_progression.active_stats_snapshot IS 'Cached JSON of all active stats and bonuses';
COMMENT ON COLUMN user_progression.snapshot_generated_at IS 'When the snapshot was last calculated';
