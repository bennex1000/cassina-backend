-- Items table
-- Contains all 250 unique items (10 stats × 5 slots × 5 rarities)

CREATE TABLE IF NOT EXISTS items (
  item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  stat_id INTEGER NOT NULL REFERENCES dim_stats(stat_id),
  slot_id INTEGER NOT NULL REFERENCES dim_slots(slot_id),
  rarity_id INTEGER NOT NULL REFERENCES dim_rarities(rarity_id),
  base_value DECIMAL(6,2) NOT NULL DEFAULT 1.0,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(stat_id, slot_id, rarity_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_stat ON items(stat_id);
CREATE INDEX IF NOT EXISTS idx_items_slot ON items(slot_id);
CREATE INDEX IF NOT EXISTS idx_items_rarity ON items(rarity_id);
CREATE INDEX IF NOT EXISTS idx_items_stat_slot ON items(stat_id, slot_id);

COMMENT ON TABLE items IS 'All 250 unique items in the game';
COMMENT ON COLUMN items.base_value IS 'Base stat value before rarity multiplier is applied';
COMMENT ON COLUMN items.item_name IS 'Generated name: {Theme} {Slot} ({Rarity})';
