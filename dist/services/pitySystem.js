import { db } from "../database.js";
/**
 * Pity System - Bad Luck Protection
 *
 * Guarantees a rare+ drop after a certain number of consecutive common drops.
 * The Purity stat can lower the threshold for faster pity activation.
 */
/**
 * Check if pity should trigger for this user
 */
export const checkPityTrigger = async (userId) => {
    try {
        const { rows } = await db.query(`
      SELECT consecutive_common_drops, pity_threshold
      FROM user_progression
      WHERE user_id = $1
    `, [userId]);
        if (rows.length === 0) {
            return { ok: false, error: "User progression not found" };
        }
        const row = rows[0];
        if (!row) {
            return { ok: false, error: "User progression not found" };
        }
        const shouldTrigger = row.consecutive_common_drops >= row.pity_threshold;
        return { ok: true, data: shouldTrigger };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Increment pity counter on common drop, reset on rare+
 */
export const updatePityCounter = async (userId, rarityName) => {
    try {
        let query;
        let newCount;
        if (rarityName === "Common") {
            // Increment counter
            const { rows } = await db.query(`
        UPDATE user_progression
        SET consecutive_common_drops = consecutive_common_drops + 1
        WHERE user_id = $1
        RETURNING consecutive_common_drops
      `, [userId]);
            if (rows.length === 0) {
                return { ok: false, error: "Failed to update pity counter" };
            }
            const row = rows[0];
            if (!row) {
                return { ok: false, error: "Failed to update pity counter" };
            }
            newCount = row.consecutive_common_drops;
        }
        else {
            // Reset counter on rare+ drop
            await db.query(`
        UPDATE user_progression
        SET consecutive_common_drops = 0
        WHERE user_id = $1
      `, [userId]);
            newCount = 0;
        }
        return { ok: true, data: newCount };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Apply Purity stat bonus to lower pity threshold
 * Formula: threshold = 5 - floor(purityValue / 20)
 * Example: Purity 40 = threshold 3, Purity 80 = threshold 1
 */
export const applyPurityBonus = async (userId, purityValue) => {
    try {
        const baseThreshold = 5;
        const reduction = Math.floor(purityValue / 20);
        const newThreshold = Math.max(1, baseThreshold - reduction); // Min threshold of 1
        await db.query(`
      UPDATE user_progression
      SET pity_threshold = $1
      WHERE user_id = $2
    `, [newThreshold, userId]);
        return { ok: true, data: newThreshold };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Get current pity status for a user
 */
export const getPityStatus = async (userId) => {
    try {
        const { rows } = await db.query(`
      SELECT consecutive_common_drops, pity_threshold
      FROM user_progression
      WHERE user_id = $1
    `, [userId]);
        if (rows.length === 0) {
            return { ok: false, error: "User progression not found" };
        }
        const row = rows[0];
        if (!row) {
            return { ok: false, error: "User progression not found" };
        }
        const dropsUntilPity = Math.max(0, row.pity_threshold - row.consecutive_common_drops);
        const pityActive = row.consecutive_common_drops >= row.pity_threshold;
        return {
            ok: true,
            data: {
                consecutive_common_drops: row.consecutive_common_drops,
                pity_threshold: row.pity_threshold,
                drops_until_pity: dropsUntilPity,
                pity_active: pityActive,
            },
        };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Reset pity counter (used for testing or admin actions)
 */
export const resetPityCounter = async (userId) => {
    try {
        await db.query(`
      UPDATE user_progression
      SET consecutive_common_drops = 0
      WHERE user_id = $1
    `, [userId]);
        return { ok: true, data: true };
    }
    catch (error) {
        return { ok: false, error };
    }
};
export default {
    checkPityTrigger,
    updatePityCounter,
    applyPurityBonus,
    getPityStatus,
    resetPityCounter,
};
//# sourceMappingURL=pitySystem.js.map