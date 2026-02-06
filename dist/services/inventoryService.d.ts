import { InventoryItem, EquippedItem, ItemWithDetails, EquippedLoadout, Result } from "../types.js";
/**
 * Get user's complete inventory
 */
export declare const getUserInventory: (userId: number) => Promise<Result<ItemWithDetails[]>>;
/**
 * Add item to user's inventory
 */
export declare const addItemToInventory: (userId: number, itemId: number) => Promise<Result<InventoryItem>>;
/**
 * Get user's equipped items
 */
export declare const getEquippedItems: (userId: number) => Promise<Result<EquippedLoadout>>;
/**
 * Equip an item to a slot
 */
export declare const equipItem: (userId: number, itemId: number) => Promise<Result<EquippedItem>>;
/**
 * Unequip an item from a slot
 */
export declare const unequipItem: (userId: number, slotId: number) => Promise<Result<boolean>>;
declare const _default: {
    getUserInventory: (userId: number) => Promise<Result<ItemWithDetails[]>>;
    addItemToInventory: (userId: number, itemId: number) => Promise<Result<InventoryItem>>;
    getEquippedItems: (userId: number) => Promise<Result<EquippedLoadout>>;
    equipItem: (userId: number, itemId: number) => Promise<Result<EquippedItem>>;
    unequipItem: (userId: number, slotId: number) => Promise<Result<boolean>>;
};
export default _default;
//# sourceMappingURL=inventoryService.d.ts.map