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
