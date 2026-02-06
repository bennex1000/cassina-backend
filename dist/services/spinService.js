import { db } from "../database.js";
import inventoryService from "./inventoryService.js";
import itemService from "./itemService.js";
import probabilityEngine from "./probabilityEngine.js";
import cooldownManager from "./cooldownManager.js";
import statAggregator from "./statAggregator.js";
import pitySystem from "./pitySystem.js";
/**
 * Check if user can spin (24h cooldown)
 */
export const canSpin = async (userId) => {
    try {
        // ADMIN BYPASS: User ID 40 (admin) has unlimited spins
        if (userId === 40) {
            return { ok: true, data: true };
        }
        const { rows } = await db.query(`
      SELECT next_spin_available
      FROM user_progression
      WHERE user_id = $1
    `, [userId]);
        if (rows.length === 0) {
            return { ok: false, error: "User progression not found" };
        }
        const progression = rows[0];
        if (!progression) {
            return { ok: false, error: "User progression not found" };
        }
        const nextSpinTime = progression.next_spin_available;
        if (!nextSpinTime) {
            return { ok: true, data: true }; // First spin
        }
        const canSpinNow = new Date() >= new Date(nextSpinTime);
        return { ok: true, data: canSpinNow };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Get next spin availability time
 */
export const getNextSpinTime = async (userId) => {
    try {
        const { rows } = await db.query(`
      SELECT next_spin_available
      FROM user_progression
      WHERE user_id = $1
    `, [userId]);
        if (rows.length === 0) {
            return { ok: false, error: "User progression not found" };
        }
        const progression = rows[0];
        if (!progression) {
            return { ok: false, error: "User progression not found" };
        }
        return { ok: true, data: progression.next_spin_available };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Select a rarity based on wheel tier drop rates
 */
const selectRarityFromWheel = async (wheelTierId) => {
    try {
        // Get drop rates for this wheel
        const { rows } = await db.query(`
      SELECT rarity_id, drop_percentage
      FROM wheel_drop_rates
      WHERE wheel_tier_id = $1
      ORDER BY drop_percentage DESC
    `, [wheelTierId]);
        if (rows.length === 0)
            return null;
        // Weighted random selection
        const random = Math.random() * 100;
        let cumulative = 0;
        for (const rate of rows) {
            cumulative += Number(rate.drop_percentage);
            if (random <= cumulative) {
                return rate.rarity_id;
            }
        }
        // Fallback to last rarity
        const lastRarity = rows[rows.length - 1];
        return lastRarity ? lastRarity.rarity_id : null;
    }
    catch (error) {
        console.error("Error selecting rarity:", error);
        return null;
    }
};
/**
 * Perform a spin
 */
export const performSpin = async (userId) => {
    try {
        // Check if user can spin
        const canSpinResult = await canSpin(userId);
        if (!canSpinResult.ok || !canSpinResult.data) {
            return { ok: false, error: "Spin not available yet (24h cooldown)" };
        }
        // Get user's current wheel tier
        const progressionQuery = await db.query(`
      SELECT current_wheel_tier_id, daily_streak, last_streak_date
      FROM user_progression
      WHERE user_id = $1
    `, [userId]);
        if (progressionQuery.rows.length === 0) {
            return { ok: false, error: "User progression not found" };
        }
        const progression = progressionQuery.rows[0];
        if (!progression) {
            return { ok: false, error: "User progression not found" };
        }
        const wheelTierId = progression.current_wheel_tier_id;
        // Get user's stat snapshot for Speed and Purity
        const snapshotResult = await statAggregator.getActiveSnapshot(userId);
        if (!snapshotResult.ok) {
            return { ok: false, error: "Failed to get user stats" };
        }
        const stats = snapshotResult.data.effective_stats;
        const speedValue = stats["Speed"] || 0;
        const purityValue = stats["Purity"] || 0;
        // Apply Purity bonus to pity threshold
        await pitySystem.applyPurityBonus(userId, purityValue);
        // Check if pity should trigger
        const pityTriggerResult = await pitySystem.checkPityTrigger(userId);
        if (!pityTriggerResult.ok) {
            return { ok: false, error: pityTriggerResult.error };
        }
        const pityMode = pityTriggerResult.data;
        // Select rarity using dynamic probability engine (with pity mode if active)
        const rarityResult = await probabilityEngine.selectRarity(wheelTierId, userId, pityMode);
        if (!rarityResult.ok) {
            return { ok: false, error: rarityResult.error };
        }
        const rarityId = rarityResult.data;
        // Get random item of selected rarity
        const itemResult = await itemService.getRandomItemByRarity(rarityId);
        if (!itemResult.ok) {
            return { ok: false, error: "Failed to select item" };
        }
        const item = itemResult.data;
        // Update pity counter based on rarity
        await pitySystem.updatePityCounter(userId, item.rarity_name);
        // Check if user already owns this item
        const inventoryCheck = await db.query(`SELECT 1 FROM user_inventory WHERE user_id = $1 AND item_id = $2`, [userId, item.item_id]);
        const wasDuplicate = inventoryCheck.rows.length > 0;
        // Add item to inventory
        await inventoryService.addItemToInventory(userId, item.item_id);
        // Log the spin
        await db.query(`
      INSERT INTO user_spins (user_id, wheel_tier_id, item_won_id)
      VALUES ($1, $2, $3)
    `, [userId, wheelTierId, item.item_id]);
        // Update daily streak
        const today = new Date().toISOString().split("T")[0];
        const lastStreakDate = progression.last_streak_date
            ? new Date(progression.last_streak_date).toISOString().split("T")[0]
            : null;
        let newStreak = progression.daily_streak || 0;
        if (lastStreakDate === today) {
            // Already spun today, keep streak
            newStreak = progression.daily_streak || 0;
        }
        else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            if (lastStreakDate === yesterdayStr) {
                // Consecutive day
                newStreak = (progression.daily_streak || 0) + 1;
            }
            else {
                // Streak broken
                newStreak = 1;
            }
        }
        // Lock cooldown with current Speed value (already retrieved earlier)
        const cooldownResult = await cooldownManager.lockCooldown(userId, speedValue);
        if (!cooldownResult.ok) {
            return { ok: false, error: "Failed to set cooldown" };
        }
        const nextSpinTime = cooldownResult.data;
        // Update daily streak
        await db.query(`
      UPDATE user_progression
      SET 
        daily_streak = $1,
        last_streak_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `, [newStreak, userId]);
        return {
            ok: true,
            data: {
                item,
                was_duplicate: wasDuplicate,
                next_spin_time: nextSpinTime,
                daily_streak: newStreak,
            },
        };
    }
    catch (error) {
        return { ok: false, error };
    }
};
export default {
    canSpin,
    getNextSpinTime,
    performSpin,
};
//# sourceMappingURL=spinService.js.map