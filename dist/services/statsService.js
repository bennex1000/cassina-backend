import { db } from "../database.js";
/**
 * Calculate active stats from equipped items
 */
export const calculateActiveStats = async (userId) => {
    try {
        const { rows } = await db.query(`
      SELECT 
        s.effect_type,
        SUM(i.base_value * r.stat_multiplier) as total_value
      FROM user_equipped_items ue
      JOIN items i ON ue.item_id = i.item_id
      JOIN dim_stats s ON i.stat_id = s.stat_id
      JOIN dim_rarities r ON i.rarity_id = r.rarity_id
      WHERE ue.user_id = $1
      GROUP BY s.effect_type
    `, [userId]);
        const stats = {};
        rows.forEach((row) => {
            stats[row.effect_type] = Number(row.total_value);
        });
        return { ok: true, data: stats };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Check for set bonuses (5 items of same theme)
 */
export const checkSetBonuses = async (userId) => {
    try {
        const { rows } = await db.query(`
      SELECT 
        s.stat_id,
        s.stat_name,
        s.effect_type,
        COUNT(*) as equipped_count
      FROM user_equipped_items ue
      JOIN items i ON ue.item_id = i.item_id
      JOIN dim_stats s ON i.stat_id = s.stat_id
      WHERE ue.user_id = $1
      GROUP BY s.stat_id, s.stat_name, s.effect_type
    `, [userId]);
        const setBonuses = rows.map((row) => {
            const count = Number(row.equipped_count);
            const isComplete = count === 5;
            return {
                stat_name: row.stat_name,
                effect_type: row.effect_type,
                equipped_count: count,
                is_complete: isComplete,
                bonus_multiplier: isComplete ? 2.0 : 1.0, // 2x bonus for complete set
            };
        });
        return { ok: true, data: setBonuses };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Get effective multipliers (stats + set bonuses)
 */
export const getEffectiveMultipliers = async (userId) => {
    try {
        const statsResult = await calculateActiveStats(userId);
        if (!statsResult.ok) {
            return { ok: false, error: statsResult.error };
        }
        const bonusesResult = await checkSetBonuses(userId);
        if (!bonusesResult.ok) {
            return { ok: false, error: bonusesResult.error };
        }
        const stats = statsResult.data;
        const setBonuses = bonusesResult.data;
        // Apply set bonuses to stats
        const effectiveStats = { ...stats };
        setBonuses.forEach((bonus) => {
            const currentValue = effectiveStats[bonus.effect_type];
            if (bonus.is_complete && currentValue !== undefined) {
                effectiveStats[bonus.effect_type] = currentValue * bonus.bonus_multiplier;
            }
        });
        return {
            ok: true,
            data: {
                stats,
                setBonuses,
                effectiveStats,
            },
        };
    }
    catch (error) {
        return { ok: false, error };
    }
};
export default {
    calculateActiveStats,
    checkSetBonuses,
    getEffectiveMultipliers,
};
//# sourceMappingURL=statsService.js.map