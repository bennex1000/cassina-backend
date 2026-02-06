import { Result } from "../types.js";
/**
 * Calculate cooldown duration based on Speed stat
 * Formula: 24h - (Speed * 0.1h), capped at 18h minimum
 */
export declare const calculateCooldownDuration: (speedValue: number) => number;
/**
 * Lock cooldown with current Speed value
 * Called when user performs a spin
 */
export declare const lockCooldown: (userId: number, speedValue: number) => Promise<Result<Date>>;
/**
 * Unlock cooldown (when cooldown expires)
 */
export declare const unlockCooldown: (userId: number) => Promise<Result<boolean>>;
/**
 * Get cooldown status with time remaining
 */
export declare const getCooldownStatus: (userId: number) => Promise<Result<{
    can_spin: boolean;
    next_spin_available: Date | null;
    time_remaining_seconds: number | null;
    locked_speed_value: number;
    current_speed_value: number;
}>>;
/**
 * Format time remaining as human-readable string
 */
export declare const formatTimeRemaining: (seconds: number) => string;
declare const _default: {
    calculateCooldownDuration: (speedValue: number) => number;
    lockCooldown: (userId: number, speedValue: number) => Promise<Result<Date>>;
    unlockCooldown: (userId: number) => Promise<Result<boolean>>;
    getCooldownStatus: (userId: number) => Promise<Result<{
        can_spin: boolean;
        next_spin_available: Date | null;
        time_remaining_seconds: number | null;
        locked_speed_value: number;
        current_speed_value: number;
    }>>;
    formatTimeRemaining: (seconds: number) => string;
};
export default _default;
//# sourceMappingURL=cooldownManager.d.ts.map