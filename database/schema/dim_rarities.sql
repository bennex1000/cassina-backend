-- Dimension table for Rarities
-- Defines the 5 rarity tiers with scaling multipliers

CREATE TABLE IF NOT EXISTS dim_rarities (
  rarity_id SERIAL PRIMARY KEY,
  rarity_name VARCHAR(20) NOT NULL UNIQUE,
  rarity_tier INTEGER NOT NULL UNIQUE,
  stat_multiplier DECIMAL(4,2) NOT NULL,
  base_drop_rate DECIMAL(5,2) NOT NULL,
  color_hex VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE dim_rarities IS 'Dimension table for the 5 rarity levels';
COMMENT ON COLUMN dim_rarities.rarity_name IS 'Rarity name: Common, Uncommon, Rare, Legendary, Mythical';
COMMENT ON COLUMN dim_rarities.rarity_tier IS 'Tier level 1-5 for ordering';
COMMENT ON COLUMN dim_rarities.stat_multiplier IS 'Buff multiplier (1x to 20x)';
COMMENT ON COLUMN dim_rarities.base_drop_rate IS 'Base drop percentage in Common wheel';
