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
