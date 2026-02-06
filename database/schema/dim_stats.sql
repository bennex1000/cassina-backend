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
