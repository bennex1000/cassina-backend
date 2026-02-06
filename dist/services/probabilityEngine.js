import { db } from "../database.js";
import statAggregator from "./statAggregator.js";
/**
 * Get base drop rates for a wheel tier
 */
const getBaseDropRates = async (wheelTierId) => {
    try {
        const { rows } = await db.query(`
      SELECT 
        wdr.rarity_id,
        r.rarity_name,
        wdr.drop_percentage
      FROM wheel_drop_rates wdr
      JOIN dim_rarities r ON wdr.rarity_id = r.rarity_id
      WHERE wdr.wheel_tier_id = $1
      ORDER BY r.rarity_tier ASC
    `, [wheelTierId]);
        if (rows.length === 0) {
            return { ok: false, error: "No drop rates found for this wheel tier" };
        }
        // Convert percentages to weights (ensure numeric conversion)
        const weights = rows.map((row) => ({
            rarity_id: row.rarity_id,
            rarity_name: row.rarity_name,
            weight: Number(row.drop_percentage), // Convert string to number!
        }));
        return { ok: true, data: weights };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Apply Fortune stat bonus
 * Fortune increases weights for rare items
 */
const applyFortuneBonus = (weights, fortuneValue) => {
    if (fortuneValue <= 0)
        return weights;
    // Fortune bonus: +1% per Fortune point for Rare and above
    const fortuneMultiplier = 1 + fortuneValue * 0.01;
    return weights.map((w) => {
        // Apply bonus to Rare (3), Legendary (4), Mythical (5)
        if (w.rarity_id >= 3) {
            return {
                ...w,
                weight: w.weight * fortuneMultiplier,
            };
        }
        return w;
    });
};
/**
 * Apply Magnetism stat bonus
 * Magnetism shifts weight distribution toward higher rarities
 */
const applyMagnetismBonus = (weights, magnetismValue) => {
    if (magnetismValue <= 0)
        return weights;
    // Magnetism: shifts 0.5% weight per point from lower to higher rarities
    const shiftPercentage = magnetismValue * 0.005;
    const modifiedWeights = [...weights];
    // Shift weight from Common/Uncommon to Rare/Legendary/Mythical
    for (let i = 0; i < modifiedWeights.length - 1; i++) {
        const currentRarity = modifiedWeights[i];
        const nextRarity = modifiedWeights[i + 1];
        if (currentRarity && nextRarity) {
            const shiftAmount = currentRarity.weight * shiftPercentage;
            currentRarity.weight -= shiftAmount;
            nextRarity.weight += shiftAmount;
        }
    }
    return modifiedWeights;
};
/**
 * Apply Purity stat bonus
 * Purity reduces duplicate drops (handled elsewhere, but affects weights slightly)
 */
const applyPurityBonus = (weights, purityValue) => {
    if (purityValue <= 0)
        return weights;
    // Purity: slight boost to all non-Common rarities
    const purityBoost = 1 + purityValue * 0.002;
    return weights.map((w) => {
        if (w.rarity_id > 1) {
            // Not Common
            return {
                ...w,
                weight: w.weight * purityBoost,
            };
        }
        return w;
    });
};
/**
 * Calculate final weights with all stat bonuses applied
 */
export const calculateWeights = async (wheelTierId, userId) => {
    try {
        // Get base drop rates
        const baseRatesResult = await getBaseDropRates(wheelTierId);
        if (!baseRatesResult.ok) {
            return { ok: false, error: baseRatesResult.error };
        }
        let weights = baseRatesResult.data;
        // Get user's stat snapshot
        const snapshotResult = await statAggregator.getActiveSnapshot(userId);
        if (!snapshotResult.ok) {
            // If no snapshot, use base weights
            return { ok: true, data: weights };
        }
        const stats = snapshotResult.data.effective_stats;
        // Apply stat bonuses in order
        weights = applyFortuneBonus(weights, stats["Fortune"] || 0);
        weights = applyMagnetismBonus(weights, stats["Magnetism"] || 0);
        weights = applyPurityBonus(weights, stats["Purity"] || 0);
        return { ok: true, data: weights };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Select a rarity from weighted pool using cumulative distribution
 */
export const selectFromWeightedPool = (weights) => {
    if (weights.length === 0)
        return null;
    // Calculate total weight
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    // Generate random number between 0 and totalWeight
    const random = Math.random() * totalWeight;
    // Find which rarity this random number falls into
    let cumulativeWeight = 0;
    for (const rarityWeight of weights) {
        cumulativeWeight += rarityWeight.weight;
        if (random <= cumulativeWeight) {
            return rarityWeight.rarity_id;
        }
    }
    // Fallback to last rarity (should never happen)
    return weights[weights.length - 1]?.rarity_id || null;
};
/**
 * Main function: Select a rarity for a spin
 * @param pityMode - If true, excludes Common and Uncommon from selection
 */
export const selectRarity = async (wheelTierId, userId, pityMode = false) => {
    try {
        const weightsResult = await calculateWeights(wheelTierId, userId);
        if (!weightsResult.ok) {
            return { ok: false, error: weightsResult.error };
        }
        let weights = weightsResult.data;
        // If pity mode is active, exclude Common (1) and Uncommon (2)
        if (pityMode) {
            weights = weights.filter((w) => w.rarity_id >= 3); // Only Rare, Legendary, Mythical
        }
        const selectedRarity = selectFromWeightedPool(weights);
        if (selectedRarity === null) {
            return { ok: false, error: "Failed to select rarity" };
        }
        return { ok: true, data: selectedRarity };
    }
    catch (error) {
        return { ok: false, error };
    }
};
/**
 * Get probability distribution for debugging/display
 */
export const getProbabilityDistribution = async (wheelTierId, userId) => {
    try {
        const weightsResult = await calculateWeights(wheelTierId, userId);
        if (!weightsResult.ok) {
            return { ok: false, error: weightsResult.error };
        }
        const weights = weightsResult.data;
        const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
        const distribution = weights.map((w) => ({
            rarity_name: w.rarity_name,
            weight: w.weight,
            probability: (w.weight / totalWeight) * 100,
        }));
        return { ok: true, data: distribution };
    }
    catch (error) {
        return { ok: false, error };
    }
};
export default {
    calculateWeights,
    selectFromWeightedPool,
    selectRarity,
    getProbabilityDistribution,
};
//# sourceMappingURL=probabilityEngine.js.map