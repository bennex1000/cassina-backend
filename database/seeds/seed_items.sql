-- Seed all 250 items (10 stats × 5 slots × 5 rarities)
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
