import { Result } from "../types.js";
/**
 * Pity System - Bad Luck Protection
 *
 * Guarantees a rare+ drop after a certain number of consecutive common drops.
 * The Purity stat can lower the threshold for faster pity activation.
 */
/**
 * Check if pity should trigger for this user
 */
export declare const checkPityTrigger: (userId: number) => Promise<Result<boolean>>;
/**
 * Increment pity counter on common drop, reset on rare+
 */
export declare const updatePityCounter: (userId: number, rarityName: string) => Promise<Result<number>>;
/**
 * Apply Purity stat bonus to lower pity threshold
 * Formula: threshold = 5 - floor(purityValue / 20)
 * Example: Purity 40 = threshold 3, Purity 80 = threshold 1
 */
export declare const applyPurityBonus: (userId: number, purityValue: number) => Promise<Result<number>>;
/**
 * Get current pity status for a user
 */
export declare const getPityStatus: (userId: number) => Promise<Result<{
    consecutive_common_drops: number;
    pity_threshold: number;
    drops_until_pity: number;
    pity_active: boolean;
}>>;
/**
 * Reset pity counter (used for testing or admin actions)
 */
export declare const resetPityCounter: (userId: number) => Promise<Result<boolean>>;
declare const _default: {
    checkPityTrigger: (userId: number) => Promise<Result<boolean>>;
    updatePityCounter: (userId: number, rarityName: string) => Promise<Result<number>>;
    applyPurityBonus: (userId: number, purityValue: number) => Promise<Result<number>>;
    getPityStatus: (userId: number) => Promise<Result<{
        consecutive_common_drops: number;
        pity_threshold: number;
        drops_until_pity: number;
        pity_active: boolean;
    }>>;
    resetPityCounter: (userId: number) => Promise<Result<boolean>>;
};
export default _default;
//# sourceMappingURL=pitySystem.d.ts.map