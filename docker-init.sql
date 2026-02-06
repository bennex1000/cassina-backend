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
-- Dimension table for Equipment Slots
-- Defines the 5 character equipment positions

CREATE TABLE IF NOT EXISTS dim_slots (
  slot_id SERIAL PRIMARY KEY,
  slot_name VARCHAR(20) NOT NULL UNIQUE,
  slot_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE dim_slots IS 'Dimension table for the 5 equipment slots';
COMMENT ON COLUMN dim_slots.slot_name IS 'Slot name: Head, Eye, Torso, Leg, Foot';
COMMENT ON COLUMN dim_slots.slot_order IS 'Display order for UI (1-5)';
-- Dimension table for Stats/Themes
-- Each stat represents a theme with unique gameplay mechanics

CREATE TABLE IF NOT EXISTS dim_stats (
  stat_id SERIAL PRIMARY KEY,
  stat_name VARCHAR(50) NOT NULL UNIQUE,
  stat_description TEXT NOT NULL,
  effect_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE dim_stats IS 'Dimension table containing the 10 game themes/stats';
COMMENT ON COLUMN dim_stats.stat_name IS 'Theme name (e.g., Samuraj, Cyberpunk, Viking)';
COMMENT ON COLUMN dim_stats.effect_type IS 'Primary stat effect (e.g., Purity, Insight, Multiplier)';
-- Items table
-- Contains all 250 unique items (10 stats Ã— 5 slots Ã— 5 rarities)

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
-- Users table
-- Core user authentication and profile data

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Indexes for authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
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
-- Seed data for dimension tables
-- Populates stats, slots, and rarities

-- ============================================
-- STATS / THEMES (10 total)
-- ============================================

INSERT INTO dim_stats (stat_name, stat_description, effect_type) VALUES
  ('Samuraj', 'Reduces junk and duplicate items from spins', 'Purity'),
  ('Cyberpunk', 'Provides insight into future spin results', 'Insight'),
  ('Viking', 'Increases resource gains from spins', 'Multiplier'),
  ('Steampunk', 'Magnetizes wheel towards rare slots', 'Magnetism'),
  ('Astronom', 'Pure luck bonus for high rarity drops', 'Fortune'),
  ('Kunglig', 'Passive income and cheaper upgrades', 'Charisma'),
  ('Ã„ventyrare', 'Reduces the 24-hour spin cooldown', 'Speed'),
  ('Magiker', 'Grants reroll points to spin again', 'Reroll'),
  ('Undervatten', 'Increases active buff slots', 'Storage'),
  ('Retro', 'Bonus based on daily streak count', 'Combo');

-- ============================================
-- SLOTS (5 total)
-- ============================================

INSERT INTO dim_slots (slot_name, slot_order) VALUES
  ('Head', 1),
  ('Eye', 2),
  ('Torso', 3),
  ('Leg', 4),
  ('Foot', 5);

-- ============================================
-- RARITIES (5 total)
-- ============================================

INSERT INTO dim_rarities (rarity_name, rarity_tier, stat_multiplier, base_drop_rate, color_hex) VALUES
  ('Common', 1, 1.00, 60.00, '#9CA3AF'),
  ('Uncommon', 2, 2.50, 25.00, '#10B981'),
  ('Rare', 3, 5.00, 10.00, '#3B82F6'),
  ('Legendary', 4, 10.00, 4.00, '#A855F7'),
  ('Mythical', 5, 20.00, 1.00, '#F59E0B');
-- Seed all 250 items (10 stats Ã— 5 slots Ã— 5 rarities)
-- Generated programmatically with naming convention: {Theme} {Slot} ({Rarity})

-- This will be populated via a script to generate all combinations
-- For now, creating a template that can be executed

DO $$
DECLARE
  stat_rec RECORD;
  slot_rec RECORD;
  rarity_rec RECORD;
  item_name_text VARCHAR(100);
  slot_name_singular VARCHAR(20);
BEGIN
  -- Loop through all combinations
  FOR stat_rec IN SELECT stat_id, stat_name FROM dim_stats ORDER BY stat_id LOOP
    FOR slot_rec IN SELECT slot_id, slot_name FROM dim_slots ORDER BY slot_id LOOP
      FOR rarity_rec IN SELECT rarity_id, rarity_name FROM dim_rarities ORDER BY rarity_id LOOP
        
        -- Generate singular slot name for better item naming
        slot_name_singular := CASE slot_rec.slot_name
          WHEN 'Head' THEN 'Helmet'
          WHEN 'Eye' THEN 'Goggles'
          WHEN 'Torso' THEN 'Armor'
          WHEN 'Leg' THEN 'Pants'
          WHEN 'Foot' THEN 'Boots'
          ELSE slot_rec.slot_name
        END;
        
        -- Create item name
        item_name_text := stat_rec.stat_name || ' ' || slot_name_singular;
        
        -- Insert item
        INSERT INTO items (item_name, stat_id, slot_id, rarity_id, base_value, description)
        VALUES (
          item_name_text,
          stat_rec.stat_id,
          slot_rec.slot_id,
          rarity_rec.rarity_id,
          1.0,
          'A ' || LOWER(rarity_rec.rarity_name) || ' ' || LOWER(slot_name_singular) || ' from the ' || stat_rec.stat_name || ' collection, granting ' || (SELECT effect_type FROM dim_stats WHERE stat_id = stat_rec.stat_id) || ' bonus.'
        );
        
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Successfully created 250 items';
END $$;

-- Verify count
DO $$
DECLARE
  item_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO item_count FROM items;
  RAISE NOTICE 'Total items in database: %', item_count;
  
  IF item_count != 250 THEN
    RAISE EXCEPTION 'Expected 250 items but found %', item_count;
  END IF;
END $$;
-- Seed wheel tiers and drop rates
-- Defines the 4 wheel types with their rarity distributions

-- ============================================
-- WHEEL TIERS
-- ============================================

INSERT INTO wheel_tiers (tier_name, tier_level, unlock_requirement) VALUES
  ('Common', 1, 'Available from start'),
  ('Silver', 2, 'Collect 10 Rare items'),
  ('Gold', 3, 'Collect 5 Legendary items'),
  ('Celestial', 4, 'Complete a full set (5 Mythical items of same theme)');

-- ============================================
-- WHEEL DROP RATES
-- ============================================

-- Common Wheel (tier 1)
INSERT INTO wheel_drop_rates (wheel_tier_id, rarity_id, drop_percentage)
SELECT 1, rarity_id, 
  CASE rarity_name
    WHEN 'Common' THEN 60.00
    WHEN 'Uncommon' THEN 30.00
    WHEN 'Rare' THEN 8.00
    WHEN 'Legendary' THEN 1.80
    WHEN 'Mythical' THEN 0.20
  END
FROM dim_rarities;

-- Silver Wheel (tier 2)
INSERT INTO wheel_drop_rates (wheel_tier_id, rarity_id, drop_percentage)
SELECT 2, rarity_id,
  CASE rarity_name
    WHEN 'Common' THEN 30.00
    WHEN 'Uncommon' THEN 40.00
    WHEN 'Rare' THEN 20.00
    WHEN 'Legendary' THEN 8.00
    WHEN 'Mythical' THEN 2.00
  END
FROM dim_rarities;

-- Gold Wheel (tier 3)
INSERT INTO wheel_drop_rates (wheel_tier_id, rarity_id, drop_percentage)
SELECT 3, rarity_id,
  CASE rarity_name
    WHEN 'Common' THEN 10.00
    WHEN 'Uncommon' THEN 20.00
    WHEN 'Rare' THEN 35.00
    WHEN 'Legendary' THEN 25.00
    WHEN 'Mythical' THEN 10.00
  END
FROM dim_rarities;

-- Celestial Wheel (tier 4)
INSERT INTO wheel_drop_rates (wheel_tier_id, rarity_id, drop_percentage)
SELECT 4, rarity_id,
  CASE rarity_name
    WHEN 'Common' THEN 0.00
    WHEN 'Uncommon' THEN 5.00
    WHEN 'Rare' THEN 15.00
    WHEN 'Legendary' THEN 40.00
    WHEN 'Mythical' THEN 40.00
  END
FROM dim_rarities;
