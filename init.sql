-- ============================================
-- CASSINA GAME DATABASE INITIALIZATION
-- Complete schema and seed data for 250-item collection game
-- ============================================

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS user_spins CASCADE;
DROP TABLE IF EXISTS user_equipped_items CASCADE;
DROP TABLE IF EXISTS user_inventory CASCADE;
DROP TABLE IF EXISTS user_progression CASCADE;
DROP TABLE IF EXISTS wheel_drop_rates CASCADE;
DROP TABLE IF EXISTS wheel_tiers CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS dim_rarities CASCADE;
DROP TABLE IF EXISTS dim_slots CASCADE;
DROP TABLE IF EXISTS dim_stats CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;

-- ============================================
-- SCHEMA CREATION
-- ============================================

\echo 'Creating dimension tables...'
\i database/schema/dim_stats.sql
\i database/schema/dim_slots.sql
\i database/schema/dim_rarities.sql

\echo 'Creating core game tables...'
\i database/schema/items.sql
\i database/schema/users.sql
\i database/schema/user_inventory.sql
\i database/schema/user_equipped_items.sql

\echo 'Creating spin system tables...'
\i database/schema/wheel_tiers.sql
\i database/schema/wheel_drop_rates.sql
\i database/schema/user_spins.sql
\i database/schema/user_progression.sql

-- ============================================
-- DATA SEEDING
-- ============================================

\echo 'Seeding dimension data...'
\i database/seeds/seed_dimensions.sql

\echo 'Generating 250 items...'
\i database/seeds/seed_items.sql

\echo 'Seeding wheel configurations...'
\i database/seeds/seed_wheels.sql

-- ============================================
-- VERIFICATION
-- ============================================

\echo 'Database initialization complete!'
\echo 'Verifying data...'

SELECT 'Stats' as table_name, COUNT(*) as count FROM dim_stats
UNION ALL
SELECT 'Slots', COUNT(*) FROM dim_slots
UNION ALL
SELECT 'Rarities', COUNT(*) FROM dim_rarities
UNION ALL
SELECT 'Items', COUNT(*) FROM items
UNION ALL
SELECT 'Wheel Tiers', COUNT(*) FROM wheel_tiers
UNION ALL
SELECT 'Drop Rates', COUNT(*) FROM wheel_drop_rates;

\echo 'Expected: 10 Stats, 5 Slots, 5 Rarities, 250 Items, 4 Wheel Tiers, 20 Drop Rates'
