import { Result } from "../types.js";
/**
 * Rarity weight for probability calculations
 */
type RarityWeight = {
    rarity_id: number;
    rarity_name: string;
    weight: number;
};
/**
 * Calculate final weights with all stat bonuses applied
 */
export declare const calculateWeights: (wheelTierId: number, userId: number) => Promise<Result<RarityWeight[]>>;
/**
 * Select a rarity from weighted pool using cumulative distribution
 */
export declare const selectFromWeightedPool: (weights: RarityWeight[]) => number | null;
/**
 * Main function: Select a rarity for a spin
 * @param pityMode - If true, excludes Common and Uncommon from selection
 */
export declare const selectRarity: (wheelTierId: number, userId: number, pityMode?: boolean) => Promise<Result<number>>;
/**
 * Get probability distribution for debugging/display
 */
export declare const getProbabilityDistribution: (wheelTierId: number, userId: number) => Promise<Result<{
    rarity_name: string;
    probability: number;
    weight: number;
}[]>>;
declare const _default: {
    calculateWeights: (wheelTierId: number, userId: number) => Promise<Result<RarityWeight[]>>;
    selectFromWeightedPool: (weights: RarityWeight[]) => number | null;
    selectRarity: (wheelTierId: number, userId: number, pityMode?: boolean) => Promise<Result<number>>;
    getProbabilityDistribution: (wheelTierId: number, userId: number) => Promise<Result<{
        rarity_name: string;
        probability: number;
        weight: number;
    }[]>>;
};
export default _default;
//# sourceMappingURL=probabilityEngine.d.ts.map