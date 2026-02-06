-- User Spins table
-- Logs all spin history for cooldown validation and analytics

CREATE TABLE IF NOT EXISTS user_spins (
  spin_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  wheel_tier_id INTEGER NOT NULL REFERENCES wheel_tiers(wheel_tier_id),
  item_won_id INTEGER NOT NULL REFERENCES items(item_id),
  spin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for spin queries
CREATE INDEX IF NOT EXISTS idx_spins_user ON user_spins(user_id);
CREATE INDEX IF NOT EXISTS idx_spins_time ON user_spins(spin_time);
CREATE INDEX IF NOT EXISTS idx_spins_user_time ON user_spins(user_id, spin_time DESC);

COMMENT ON TABLE user_spins IS 'Complete history of all spins performed';
