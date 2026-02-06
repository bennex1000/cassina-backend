import { db } from "../database.js";
import { Result } from "../types.js";
import statAggregator from "./statAggregator.js";

/**
 * Cooldown configuration
 */
const BASE_COOLDOWN_HOURS = 24;
const MAX_SPEED_REDUCTION_HOURS = 6; // Max 6 hours reduction
const SPEED_REDUCTION_RATE = 0.1; // 0.1 hours per Speed point

/**
 * Calculate cooldown duration based on Speed stat
 * Formula: 24h - (Speed * 0.1h), capped at 18h minimum
 */
export const calculateCooldownDuration = (speedValue: number): number => {
    const reduction = speedValue * SPEED_REDUCTION_RATE;
    const cappedReduction = Math.min(reduction, MAX_SPEED_REDUCTION_HOURS);
    const cooldownHours = BASE_COOLDOWN_HOURS - cappedReduction;

    // Minimum 18 hours cooldown
    return Math.max(cooldownHours, 18);
};

/**
 * Lock cooldown with current Speed value
 * Called when user performs a spin
 */
export const lockCooldown = async (
    userId: number,
    speedValue: number
): Promise<Result<Date>> => {
    try {
        const cooldownHours = calculateCooldownDuration(speedValue);
        const nextSpinTime = new Date();
        nextSpinTime.setHours(nextSpinTime.getHours() + cooldownHours);

        await db.query(
            `
      UPDATE user_progression
      SET 
        next_spin_available = $1,
        cooldown_locked = TRUE,
        cooldown_speed_value = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
    `,
            [nextSpinTime, speedValue, userId]
        );

        return { ok: true, data: nextSpinTime };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Unlock cooldown (when cooldown expires)
 */
export const unlockCooldown = async (
    userId: number
): Promise<Result<boolean>> => {
    try {
        await db.query(
            `
      UPDATE user_progression
      SET 
        cooldown_locked = FALSE,
        cooldown_speed_value = 0
      WHERE user_id = $1
    `,
            [userId]
        );

        return { ok: true, data: true };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Get cooldown status with time remaining
 */
export const getCooldownStatus = async (
    userId: number
): Promise<
    Result<{
        can_spin: boolean;
        next_spin_available: Date | null;
        time_remaining_seconds: number | null;
        locked_speed_value: number;
        current_speed_value: number;
    }>
> => {
    try {
        // ADMIN BYPASS: User ID 40 (admin) has unlimited spins
        if (userId === 40) {
            return {
                ok: true,
                data: {
                    can_spin: true,
                    next_spin_available: null,
                    time_remaining_seconds: null,
                    locked_speed_value: 0,
                    current_speed_value: 0,
                },
            };
        }

        const { rows } = await db.query<{
            next_spin_available: Date | null;
            cooldown_locked: boolean;
            cooldown_speed_value: number;
        }>(
            `
      SELECT 
        next_spin_available,
        cooldown_locked,
        cooldown_speed_value
      FROM user_progression
      WHERE user_id = $1
    `,
            [userId]
        );

        if (rows.length === 0) {
            return { ok: false, error: "User progression not found" };
        }

        const row = rows[0];
        const nextSpinTime = row?.next_spin_available;

        // Get current Speed value from snapshot
        const snapshotResult = await statAggregator.getActiveSnapshot(userId);
        const currentSpeedValue = snapshotResult.ok
            ? snapshotResult.data.effective_stats["Speed"] || 0
            : 0;

        if (!nextSpinTime) {
            // First spin available
            return {
                ok: true,
                data: {
                    can_spin: true,
                    next_spin_available: null,
                    time_remaining_seconds: null,
                    locked_speed_value: row?.cooldown_speed_value || 0,
                    current_speed_value: currentSpeedValue,
                },
            };
        }

        const now = new Date();
        const canSpin = now >= new Date(nextSpinTime);
        const timeRemaining = canSpin
            ? 0
            : Math.floor((new Date(nextSpinTime).getTime() - now.getTime()) / 1000);

        // Unlock if cooldown has expired
        if (canSpin && row?.cooldown_locked) {
            await unlockCooldown(userId);
        }

        return {
            ok: true,
            data: {
                can_spin: canSpin,
                next_spin_available: new Date(nextSpinTime),
                time_remaining_seconds: timeRemaining,
                locked_speed_value: row?.cooldown_speed_value || 0,
                current_speed_value: currentSpeedValue,
            },
        };
    } catch (error) {
        return { ok: false, error };
    }
};

/**
 * Format time remaining as human-readable string
 */
export const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "Ready to spin!";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
};

export default {
    calculateCooldownDuration,
    lockCooldown,
    unlockCooldown,
    getCooldownStatus,
    formatTimeRemaining,
};
