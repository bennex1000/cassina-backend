-- User Inventory table
-- Junction table tracking which items each user owns

CREATE TABLE IF NOT EXISTS user_inventory (
  inventory_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(item_id),
  quantity INTEGER NOT NULL DEFAULT 1,
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Indexes for inventory queries
CREATE INDEX IF NOT EXISTS idx_inventory_user ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_item ON user_inventory(item_id);

COMMENT ON TABLE user_inventory IS 'Items owned by each user';
COMMENT ON COLUMN user_inventory.quantity IS 'Number of duplicates (for future stacking mechanic)';
