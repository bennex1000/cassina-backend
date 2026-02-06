-- Migration: Add pity system columns to user_progression
-- This implements bad luck protection by tracking consecutive common drops

ALTER TABLE user_progression
ADD COLUMN consecutive_common_drops INTEGER DEFAULT 0,
ADD COLUMN pity_threshold INTEGER DEFAULT 5;

-- Add comment for documentation
COMMENT ON COLUMN user_progression.consecutive_common_drops IS 'Tracks consecutive common rarity drops for pity system';
COMMENT ON COLUMN user_progression.pity_threshold IS 'Number of consecutive commons before guaranteed rare (influenced by Purity stat)';
