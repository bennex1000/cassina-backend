-- Wheel Tiers table
-- Defines the 4 wheel types with unlock requirements

CREATE TABLE IF NOT EXISTS wheel_tiers (
  wheel_tier_id SERIAL PRIMARY KEY,
  tier_name VARCHAR(30) NOT NULL UNIQUE,
  tier_level INTEGER NOT NULL UNIQUE,
  unlock_requirement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE wheel_tiers IS 'The 4 wheel types: Common, Silver, Gold, Celestial';
COMMENT ON COLUMN wheel_tiers.unlock_requirement IS 'Description of how to unlock this wheel';
