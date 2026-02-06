-- Wheel Drop Rates table
-- Defines rarity distribution for each wheel tier

CREATE TABLE IF NOT EXISTS wheel_drop_rates (
  drop_rate_id SERIAL PRIMARY KEY,
  wheel_tier_id INTEGER NOT NULL REFERENCES wheel_tiers(wheel_tier_id),
  rarity_id INTEGER NOT NULL REFERENCES dim_rarities(rarity_id),
  drop_percentage DECIMAL(5,2) NOT NULL,
  UNIQUE(wheel_tier_id, rarity_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_drop_rates_wheel ON wheel_drop_rates(wheel_tier_id);

COMMENT ON TABLE wheel_drop_rates IS 'Rarity drop percentages per wheel tier';
COMMENT ON COLUMN wheel_drop_rates.drop_percentage IS 'Percentage chance (0-100)';
