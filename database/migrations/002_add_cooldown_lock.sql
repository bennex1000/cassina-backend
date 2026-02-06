-- Add cooldown lock mechanism to prevent retroactive changes
-- Speed stat is locked at spin time to prevent exploits

ALTER TABLE user_progression
ADD COLUMN cooldown_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN cooldown_speed_value DECIMAL DEFAULT 0;

COMMENT ON COLUMN user_progression.cooldown_locked IS 'Prevents cooldown changes from equipment swaps after spin';
COMMENT ON COLUMN user_progression.cooldown_speed_value IS 'Speed value at time of spin (locked)';
