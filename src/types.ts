// ============================================
// DIMENSION TYPES
// ============================================

export type Stat = {
  stat_id: number;
  stat_name: string;
  stat_description: string;
  effect_type: string;
  created_at: Date;
};

export type Slot = {
  slot_id: number;
  slot_name: string;
  slot_order: number;
  created_at: Date;
};

export type Rarity = {
  rarity_id: number;
  rarity_name: string;
  rarity_tier: number;
  stat_multiplier: number;
  base_drop_rate: number;
  color_hex: string | null;
  created_at: Date;
};

// ============================================
// CORE GAME TYPES
// ============================================

export type Item = {
  item_id: number;
  item_name: string;
  stat_id: number;
  slot_id: number;
  rarity_id: number;
  base_value: number;
  description: string | null;
  image_url: string | null;
  created_at: Date;
};

export type ItemWithDetails = Item & {
  stat_name: string;
  effect_type: string;
  slot_name: string;
  rarity_name: string;
  stat_multiplier: number;
  effective_value: number; // base_value * stat_multiplier
};

export type User = {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  level: number;
  experience: number;
  created_at: Date;
  last_login: Date | null;
};

export type UserProfile = Omit<User, 'password_hash'>;

export type InventoryItem = {
  inventory_id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  acquired_at: Date;
};

export type EquippedItem = {
  equipped_id: number;
  user_id: number;
  slot_id: number;
  item_id: number;
  equipped_at: Date;
};

// ============================================
// SPIN SYSTEM TYPES
// ============================================

export type WheelTier = {
  wheel_tier_id: number;
  tier_name: string;
  tier_level: number;
  unlock_requirement: string | null;
  created_at: Date;
};

export type WheelDropRate = {
  drop_rate_id: number;
  wheel_tier_id: number;
  rarity_id: number;
  drop_percentage: number;
};

export type UserSpin = {
  spin_id: number;
  user_id: number;
  wheel_tier_id: number;
  item_won_id: number;
  spin_time: Date;
};

export type UserProgression = {
  progression_id: number;
  user_id: number;
  current_wheel_tier_id: number;
  next_spin_available: Date | null;
  daily_streak: number;
  reroll_points: number;
  last_streak_date: Date | null;
  updated_at: Date;
};

// ============================================
// GAME LOGIC TYPES
// ============================================

export type SpinResult = {
  item: ItemWithDetails;
  was_duplicate: boolean;
  next_spin_time: Date;
  daily_streak: number;
};

export type ActiveStats = {
  [effect_type: string]: number;
};

export type SetBonus = {
  stat_name: string;
  effect_type: string;
  equipped_count: number;
  is_complete: boolean; // true if 5 items
  bonus_multiplier: number;
};

export type EquippedLoadout = {
  [slot_name: string]: ItemWithDetails | null;
};

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: UserProfile;
  token?: string; // For future JWT implementation
};

export type EquipItemRequest = {
  item_id: number;
};

// ============================================
// UTILITY TYPES
// ============================================

export type Result<T> =
  | {
    ok: true;
    data: T;
  }
  | { ok: false; error: unknown };
