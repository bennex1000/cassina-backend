import { db } from "../database.js";
import statsService from "./statsService.js";
/**
 * Generate and cache a stat snapshot for a user
 * This is called whenever equipment changes
 */
export const generateSnapshot = async (userId) => {
    try {
        // ADMIN BYPASS: User ID 40 gets empty stats snapshot
        if (userId === 40) {
            const adminSnapshot = {
                stats: {},
                set_bonuses: [],
                effective_stats: {
                    "Purity": 0,
                    "Insight": 0,
                    "Multiplier": 0,
                    "Magnetism": 0,
                    "Fortune": 0,
                    "Charisma": 0,
                    "Speed": 0,
                    "Reroll": 0,
                    "Storage": 0,
                    "Combo": 0
                },
                generated_at: new Date(),
            };
            await db.query(`
          UPDATE user_progression
          SET 
            active_stats_snapshot = $1,
            snapshot_generated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2
        `, [JSON.stringify(adminSnapshot), userId]);
            return { ok: true, data: adminSnapshot };
        }
        // Calculate all stats using existing statsService
        const result = await statsService.getEffectiveMultipliers(userId);
        if (!result.ok) {
            return { ok: false, error: result.error };
        }
        const snapshot = {
            stats: result.data.stats,
            set_bonuses: result.data.setBonuses,
            effective_stats: result.data.effectiveStats,
            generated_at: new Date(),
        };
        // Store snapshot in database
        await db.query(`
      UPDATE user_progression
      SET 
        active_stats_snapshot = $1,
        snapshot_generated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `, [JSON.stringify(snapshot), userId]);
        return { ok: true, data: snapshot };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Get cached snapshot or generate new one if stale/missing
 */
export const getActiveSnapshot = async (userId) => {
    try {
        // ADMIN BYPASS: User ID 40 always gets fresh empty stats
        if (userId === 40) {
            return {
                ok: true,
                data: {
                    stats: {},
                    set_bonuses: [],
                    effective_stats: {
                        "Purity": 0,
                        "Insight": 0,
                        "Multiplier": 0,
                        "Magnetism": 0,
                        "Fortune": 0,
                        "Charisma": 0,
                        "Speed": 0,
                        "Reroll": 0,
                        "Storage": 0,
                        "Combo": 0
                    },
                    generated_at: new Date(),
                }
            };
        }
        const { rows } = await db.query(`
      SELECT active_stats_snapshot, snapshot_generated_at
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
        // If no snapshot exists, generate one
        if (!row.active_stats_snapshot) {
            return await generateSnapshot(userId);
        }
        // Parse existing snapshot
        const snapshot = JSON.parse(row.active_stats_snapshot);
        // Check if snapshot is stale (older than 1 hour as safety)
        const snapshotAge = row.snapshot_generated_at
            ? Date.now() - new Date(row.snapshot_generated_at).getTime()
            : Infinity;
        const ONE_HOUR = 60 * 60 * 1000;
        if (snapshotAge > ONE_HOUR) {
            // Regenerate stale snapshot
            return await generateSnapshot(userId);
        }
        return { ok: true, data: snapshot };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Invalidate snapshot (mark as stale)
 * Called when equipment changes
 */
export const invalidateSnapshot = async (userId) => {
    try {
        await db.query(`
      UPDATE user_progression
      SET 
        active_stats_snapshot = NULL,
        snapshot_generated_at = NULL
      WHERE user_id = $1
    `, [userId]);
        return { ok: true, data: true };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Force regenerate snapshot immediately
 * Useful after equipment changes
 */
export const refreshSnapshot = async (userId) => {
    try {
        await invalidateSnapshot(userId);
        return await generateSnapshot(userId);
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Get a specific stat value from snapshot
 */
export const getStatValue = async (userId, effectType) => {
    try {
        const snapshotResult = await getActiveSnapshot(userId);
        if (!snapshotResult.ok) {
            return { ok: false, error: snapshotResult.error };
        }
        const value = snapshotResult.data.effective_stats[effectType] || 0;
        return { ok: true, data: value };
    }
    catch (error) {
        return { ok: false, error };
    }
};
export default {
    generateSnapshot,
    getActiveSnapshot,
    invalidateSnapshot,
    refreshSnapshot,
    getStatValue,
};
//# sourceMappingURL=statAggregator.js.map