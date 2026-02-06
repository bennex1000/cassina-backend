import { db } from "../database.js";
import {
    InventoryItem,
    EquippedItem,
    ItemWithDetails,
    EquippedLoadout,
    Result,
} from "../types.js";
import statAggregator from "./statAggregator.js";

/**
 * Get user's complete inventory
 */
export const getUserInventory = async (
    userId: number
): Promise<Result<ItemWithDetails[]>> => {
    try {
        const { rows } = await db.query<ItemWithDetails>(
            `
      SELECT 
        i.*,
        s.stat_name,
        s.effect_type,
        sl.slot_name,
        r.rarity_name,
        r.stat_multiplier,
        (i.base_value * r.stat_multiplier) as effective_value,
        inv.quantity,
        inv.acquired_at
      FROM user_inventory inv
      JOIN items i ON inv.item_id = i.item_id
      JOIN dim_stats s ON i.stat_id = s.stat_id
      JOIN dim_slots sl ON i.slot_id = sl.slot_id
      JOIN dim_rarities r ON i.rarity_id = r.rarity_id
      WHERE inv.user_id = $1
      ORDER BY inv.acquired_at DESC
    `,
            [userId]
        );

        return { ok: true, data: rows };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Add item to user's inventory
 */
export const addItemToInventory = async (
    userId: number,
    itemId: number
): Promise<Result<InventoryItem>> => {
    try {
        const { rows } = await db.query<InventoryItem>(
            `
      INSERT INTO user_inventory (user_id, item_id, quantity)
      VALUES ($1, $2, 1)
      ON CONFLICT (user_id, item_id) 
      DO UPDATE SET quantity = user_inventory.quantity + 1
      RETURNING *
    `,
            [userId, itemId]
        );

        const result = rows[0];
        if (!result) {
            return { ok: false, error: "Failed to add item to inventory" };
        }

        return { ok: true, data: result };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Get user's equipped items
 */
export const getEquippedItems = async (
    userId: number
): Promise<Result<EquippedLoadout>> => {
    try {
        const { rows } = await db.query<ItemWithDetails & { slot_name: string }>(
            `
      SELECT 
        i.*,
        s.stat_name,
        s.effect_type,
        sl.slot_name,
        r.rarity_name,
        r.stat_multiplier,
        (i.base_value * r.stat_multiplier) as effective_value
      FROM user_equipped_items ue
      JOIN items i ON ue.item_id = i.item_id
      JOIN dim_stats s ON i.stat_id = s.stat_id
      JOIN dim_slots sl ON ue.slot_id = sl.slot_id
      JOIN dim_rarities r ON i.rarity_id = r.rarity_id
      WHERE ue.user_id = $1
    `,
            [userId]
        );

        // Convert to loadout object
        const loadout: EquippedLoadout = {
            Head: null,
            Eye: null,
            Torso: null,
            Leg: null,
            Foot: null,
        };

        rows.forEach((item) => {
            loadout[item.slot_name] = item;
        });

        return { ok: true, data: loadout };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Equip an item to a slot
 */
export const equipItem = async (
    userId: number,
    itemId: number
): Promise<Result<EquippedItem>> => {
    try {
        // First, verify user owns the item
        const ownershipCheck = await db.query(
            `SELECT 1 FROM user_inventory WHERE user_id = $1 AND item_id = $2`,
            [userId, itemId]
        );

        if (ownershipCheck.rows.length === 0) {
            return { ok: false, error: "User does not own this item" };
        }

        // Get the item's slot
        const itemQuery = await db.query<{ slot_id: number }>(
            `SELECT slot_id FROM items WHERE item_id = $1`,
            [itemId]
        );

        if (itemQuery.rows.length === 0) {
            return { ok: false, error: "Item not found" };
        }

        const slotId = itemQuery.rows[0]?.slot_id;
        if (!slotId) {
            return { ok: false, error: "Invalid item slot" };
        }

        // Equip the item (upsert - replace if slot already occupied)
        const { rows } = await db.query<EquippedItem>(
            `
      INSERT INTO user_equipped_items (user_id, slot_id, item_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, slot_id)
      DO UPDATE SET item_id = $3, equipped_at = CURRENT_TIMESTAMP
      RETURNING *
    `,
            [userId, slotId, itemId]
        );

        const result = rows[0];
        if (!result) {
            return { ok: false, error: "Failed to equip item" };
        }

        // Refresh stat snapshot after equipment change
        await statAggregator.refreshSnapshot(userId);

        return { ok: true, data: result };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Unequip an item from a slot
 */
export const unequipItem = async (
    userId: number,
    slotId: number
): Promise<Result<boolean>> => {
    try {
        const result = await db.query(
            `
      DELETE FROM user_equipped_items
      WHERE user_id = $1 AND slot_id = $2
    `,
            [userId, slotId]
        );

        const success = (result.rowCount ?? 0) > 0;

        // Refresh stat snapshot after unequipping
        if (success) {
            await statAggregator.refreshSnapshot(userId);
        }

        return { ok: true, data: success };
    } catch (error) {
        return { ok: false, error };
    }
};

export default {
    getUserInventory,
    addItemToInventory,
    getEquippedItems,
    equipItem,
    unequipItem,
};
