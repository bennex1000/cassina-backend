import { SpinResult, Result } from "../types.js";
/**
 * Check if user can spin (24h cooldown)
 */
export declare const canSpin: (userId: number) => Promise<Result<boolean>>;
/**
 * Get next spin availability time
 */
export declare const getNextSpinTime: (userId: number) => Promise<Result<Date | null>>;
/**
 * Perform a spin
 */
export declare const performSpin: (userId: number) => Promise<Result<SpinResult>>;
declare const _default: {
    canSpin: (userId: number) => Promise<Result<boolean>>;
    getNextSpinTime: (userId: number) => Promise<Result<Date | null>>;
    performSpin: (userId: number) => Promise<Result<SpinResult>>;
};
export default _default;
//# sourceMappingURL=spinService.d.ts.map