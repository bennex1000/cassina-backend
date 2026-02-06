import { Result } from "../types.js";
/**
 * Stat Snapshot Structure
 */
export type StatSnapshot = {
    stats: {
        [effect_type: string]: number;
    };
    set_bonuses: Array<{
        stat_name: string;
        effect_type: string;
        equipped_count: number;
        is_complete: boolean;
    }>;
    effective_stats: {
        [effect_type: string]: number;
    };
    generated_at: Date;
};
/**
 * Generate and cache a stat snapshot for a user
 * This is called whenever equipment changes
 */
export declare const generateSnapshot: (userId: number) => Promise<Result<StatSnapshot>>;
/**
 * Get cached snapshot or generate new one if stale/missing
 */
export declare const getActiveSnapshot: (userId: number) => Promise<Result<StatSnapshot>>;
/**
 * Invalidate snapshot (mark as stale)
 * Called when equipment changes
 */
export declare const invalidateSnapshot: (userId: number) => Promise<Result<boolean>>;
/**
 * Force regenerate snapshot immediately
 * Useful after equipment changes
 */
export declare const refreshSnapshot: (userId: number) => Promise<Result<StatSnapshot>>;
/**
 * Get a specific stat value from snapshot
 */
export declare const getStatValue: (userId: number, effectType: string) => Promise<Result<number>>;
declare const _default: {
    generateSnapshot: (userId: number) => Promise<Result<StatSnapshot>>;
    getActiveSnapshot: (userId: number) => Promise<Result<StatSnapshot>>;
    invalidateSnapshot: (userId: number) => Promise<Result<boolean>>;
    refreshSnapshot: (userId: number) => Promise<Result<StatSnapshot>>;
    getStatValue: (userId: number, effectType: string) => Promise<Result<number>>;
};
export default _default;
//# sourceMappingURL=statAggregator.d.ts.map