import { ActiveStats, SetBonus, Result } from "../types.js";
/**
 * Calculate active stats from equipped items
 */
export declare const calculateActiveStats: (userId: number) => Promise<Result<ActiveStats>>;
/**
 * Check for set bonuses (5 items of same theme)
 */
export declare const checkSetBonuses: (userId: number) => Promise<Result<SetBonus[]>>;
/**
 * Get effective multipliers (stats + set bonuses)
 */
export declare const getEffectiveMultipliers: (userId: number) => Promise<Result<{
    stats: ActiveStats;
    setBonuses: SetBonus[];
    effectiveStats: ActiveStats;
}>>;
declare const _default: {
    calculateActiveStats: (userId: number) => Promise<Result<ActiveStats>>;
    checkSetBonuses: (userId: number) => Promise<Result<SetBonus[]>>;
    getEffectiveMultipliers: (userId: number) => Promise<Result<{
        stats: ActiveStats;
        setBonuses: SetBonus[];
        effectiveStats: ActiveStats;
    }>>;
};
export default _default;
//# sourceMappingURL=statsService.d.ts.map