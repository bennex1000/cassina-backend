-- Seed data for dimension tables
-- Populates stats, slots, and rarities

-- ============================================
-- STATS / THEMES (10 total)
-- ============================================

INSERT INTO dim_stats (stat_name, stat_description, effect_type) VALUES
  ('Samurai', 'Reduces junk and duplicate items from spins', 'Purity'),
  ('Cyberpunk', 'Provides insight into future spin results', 'Insight'),
  ('Viking', 'Increases resource gains from spins', 'Multiplier'),
  ('Steampunk', 'Magnetizes wheel towards rare slots', 'Magnetism'),
  ('Celestial', 'Pure luck bonus for high rarity drops', 'Fortune'),
  ('Royal', 'Passive income and cheaper upgrades', 'Charisma'),
  ('Adventurer', 'Reduces the 24-hour spin cooldown', 'Speed'),
  ('Mage', 'Grants reroll points to spin again', 'Reroll'),
  ('Aquatic', 'Increases active buff slots', 'Storage'),
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
