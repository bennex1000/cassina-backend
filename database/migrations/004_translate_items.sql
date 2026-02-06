-- Translate Theme Names from Swedish to English

-- 1. Samurai (Samuraj) - Purity
UPDATE dim_stats SET stat_name = 'Samurai' WHERE stat_name = 'Samuraj';
UPDATE items SET item_name = REPLACE(item_name, 'Samuraj', 'Samurai') WHERE item_name LIKE 'Samuraj%';
UPDATE items SET description = REPLACE(description, 'Samuraj', 'Samurai') WHERE description LIKE '%Samuraj%';

-- 2. Celestial (Astronom) - Fortune
UPDATE dim_stats SET stat_name = 'Celestial' WHERE stat_name = 'Astronom';
UPDATE items SET item_name = REPLACE(item_name, 'Astronom', 'Celestial') WHERE item_name LIKE 'Astronom%';
UPDATE items SET description = REPLACE(description, 'Astronom', 'Celestial') WHERE description LIKE '%Astronom%';

-- 3. Royal (Kunglig) - Charisma
UPDATE dim_stats SET stat_name = 'Royal' WHERE stat_name = 'Kunglig';
UPDATE items SET item_name = REPLACE(item_name, 'Kunglig', 'Royal') WHERE item_name LIKE 'Kunglig%';
UPDATE items SET description = REPLACE(description, 'Kunglig', 'Royal') WHERE description LIKE '%Kunglig%';

-- 4. Adventurer (Äventyrare) - Speed
UPDATE dim_stats SET stat_name = 'Adventurer' WHERE stat_name = 'Äventyrare';
UPDATE items SET item_name = REPLACE(item_name, 'Äventyrare', 'Adventurer') WHERE item_name LIKE 'Äventyrare%';
UPDATE items SET description = REPLACE(description, 'Äventyrare', 'Adventurer') WHERE description LIKE '%Äventyrare%';

-- 5. Mage (Magiker) - Reroll
UPDATE dim_stats SET stat_name = 'Mage' WHERE stat_name = 'Magiker';
UPDATE items SET item_name = REPLACE(item_name, 'Magiker', 'Mage') WHERE item_name LIKE 'Magiker%';
UPDATE items SET description = REPLACE(description, 'Magiker', 'Mage') WHERE description LIKE '%Magiker%';

-- 6. Aquatic (Undervatten) - Storage
UPDATE dim_stats SET stat_name = 'Aquatic' WHERE stat_name = 'Undervatten';
UPDATE items SET item_name = REPLACE(item_name, 'Undervatten', 'Aquatic') WHERE item_name LIKE 'Undervatten%';
UPDATE items SET description = REPLACE(description, 'Undervatten', 'Aquatic') WHERE description LIKE '%Undervatten%';
