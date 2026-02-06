-- User Progression table
-- Tracks user's current progression state and daily mechanics

CREATE TABLE IF NOT EXISTS user_progression (
  progression_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  current_wheel_tier_id INTEGER NOT NULL DEFAULT 1 REFERENCES wheel_tiers(wheel_tier_id),
  next_spin_available TIMESTAMP,
  daily_streak INTEGER NOT NULL DEFAULT 0,
  reroll_points INTEGER NOT NULL DEFAULT 0,
  last_streak_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_progression_user ON user_progression(user_id);
CREATE INDEX IF NOT EXISTS idx_progression_next_spin ON user_progression(next_spin_available);

COMMENT ON TABLE user_progression IS 'User progression state and daily mechanics';
COMMENT ON COLUMN user_progression.next_spin_available IS 'Timestamp when next spin is allowed (24h cooldown)';
COMMENT ON COLUMN user_progression.daily_streak IS 'Consecutive days of spinning (for Retro theme bonus)';
COMMENT ON COLUMN user_progression.reroll_points IS 'Points for re-spinning the wheel (Magiker theme)';
