-- User Equipped Items table
-- Tracks currently equipped items per user (one per slot)

CREATE TABLE IF NOT EXISTS user_equipped_items (
  equipped_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  slot_id INTEGER NOT NULL REFERENCES dim_slots(slot_id),
  item_id INTEGER NOT NULL REFERENCES items(item_id),
  equipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, slot_id)
);

-- Indexes for equipped items queries
CREATE INDEX IF NOT EXISTS idx_equipped_user ON user_equipped_items(user_id);
CREATE INDEX IF NOT EXISTS idx_equipped_slot ON user_equipped_items(slot_id);

COMMENT ON TABLE user_equipped_items IS 'Currently equipped items (max 5 per user, one per slot)';
