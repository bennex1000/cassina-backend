import { ItemWithDetails, Result } from "../types.js";
/**
 * Get all items with optional filters
 */
export declare const getAllItems: (filters?: {
    stat_id?: number;
    slot_id?: number;
    rarity_id?: number;
}) => Promise<Result<ItemWithDetails[]>>;
/**
 * Get a single item by ID with full details
 */
export declare const getItemById: (itemId: number) => Promise<Result<ItemWithDetails>>;
/**
 * Get random item by rarity
 */
export declare const getRandomItemByRarity: (rarityId: number) => Promise<Result<ItemWithDetails>>;
declare const _default: {
    getAllItems: (filters?: {
        stat_id?: number;
        slot_id?: number;
        rarity_id?: number;
    }) => Promise<Result<ItemWithDetails[]>>;
    getItemById: (itemId: number) => Promise<Result<ItemWithDetails>>;
    getRandomItemByRarity: (rarityId: number) => Promise<Result<ItemWithDetails>>;
};
export default _default;
//# sourceMappingURL=itemService.d.ts.map