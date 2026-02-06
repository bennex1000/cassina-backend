import inventoryService from "../services/inventoryService.js";
export const getInventory = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await inventoryService.getUserInventory(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const getEquipped = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await inventoryService.getEquippedItems(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const equipItem = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const itemIdParam = req.params.itemId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        const itemId = typeof itemIdParam === 'string' ? parseInt(itemIdParam) : NaN;
        if (isNaN(userId) || isNaN(itemId)) {
            return res.status(400).json({ error: "Invalid user ID or item ID" });
        }
        const result = await inventoryService.equipItem(userId, itemId);
        if (!result.ok) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const unequipItem = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const slotIdParam = req.params.slotId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        const slotId = typeof slotIdParam === 'string' ? parseInt(slotIdParam) : NaN;
        if (isNaN(userId) || isNaN(slotId)) {
            return res.status(400).json({ error: "Invalid user ID or slot ID" });
        }
        const result = await inventoryService.unequipItem(userId, slotId);
        if (!result.ok) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ success: result.data });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { getInventory, getEquipped, equipItem, unequipItem };
//# sourceMappingURL=inventoryController.js.map