import { db } from "../database.js";
import { Item, ItemWithDetails, Result } from "../types.js";

/**
 * Get all items with optional filters
 */
export const getAllItems = async (filters?: {
    stat_id?: number;
    slot_id?: number;
    rarity_id?: number;
}): Promise<Result<ItemWithDetails[]>> => {
    try {
        let query = `
      SELECT 
        i.*,
        s.stat_name,
        s.effect_type,
        sl.slot_name,
        r.rarity_name,
        r.stat_multiplier,
        (i.base_value * r.stat_multiplier) as effective_value
      FROM items i
      JOIN dim_stats s ON i.stat_id = s.stat_id
      JOIN dim_slots sl ON i.slot_id = sl.slot_id
      JOIN dim_rarities r ON i.rarity_id = r.rarity_id
      WHERE 1=1
    `;

        const params: any[] = [];
        let paramIndex = 1;

        if (filters?.stat_id) {
            query += ` AND i.stat_id = $${paramIndex}`;
            params.push(filters.stat_id);
            paramIndex++;
        }

        if (filters?.slot_id) {
            query += ` AND i.slot_id = $${paramIndex}`;
            params.push(filters.slot_id);
            paramIndex++;
        }

        if (filters?.rarity_id) {
            query += ` AND i.rarity_id = $${paramIndex}`;
            params.push(filters.rarity_id);
            paramIndex++;
        }

        query += ` ORDER BY i.stat_id, i.slot_id, i.rarity_id`;

        const { rows } = await db.query<ItemWithDetails>(query, params);
        return { ok: true, data: rows };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Get a single item by ID with full details
 */
export const getItemById = async (
    itemId: number
): Promise<Result<ItemWithDetails>> => {
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
        (i.base_value * r.stat_multiplier) as effective_value
      FROM items i
      JOIN dim_stats s ON i.stat_id = s.stat_id
      JOIN dim_slots sl ON i.slot_id = sl.slot_id
      JOIN dim_rarities r ON i.rarity_id = r.rarity_id
      WHERE i.item_id = $1
    `,
            [itemId]
        );

        if (rows.length === 0) {
            return { ok: false, error: "Item not found" };
        }

        const item = rows[0];
        if (!item) {
            return { ok: false, error: "Item not found" };
        }

        return { ok: true, data: item };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Get random item by rarity
 */
export const getRandomItemByRarity = async (
    rarityId: number
): Promise<Result<ItemWithDetails>> => {
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
        (i.base_value * r.stat_multiplier) as effective_value
      FROM items i
      JOIN dim_stats s ON i.stat_id = s.stat_id
      JOIN dim_slots sl ON i.slot_id = sl.slot_id
      JOIN dim_rarities r ON i.rarity_id = r.rarity_id
      WHERE i.rarity_id = $1
      ORDER BY RANDOM()
      LIMIT 1
    `,
            [rarityId]
        );

        if (rows.length === 0) {
            return { ok: false, error: "No items found for this rarity" };
        }

        const item = rows[0];
        if (!item) {
            return { ok: false, error: "No items found for this rarity" };
        }

        return { ok: true, data: item };
    } catch (error) {
        return { ok: false, error };
    }
};

export default {
    getAllItems,
    getItemById,
    getRandomItemByRarity,
};
