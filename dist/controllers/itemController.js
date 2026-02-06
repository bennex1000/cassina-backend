import itemService from "../services/itemService.js";
export const getAllItems = async (req, res) => {
    try {
        // Build filters object conditionally to satisfy exactOptionalPropertyTypes
        const filters = {};
        if (req.query.stat_id) {
            filters.stat_id = parseInt(req.query.stat_id);
        }
        if (req.query.slot_id) {
            filters.slot_id = parseInt(req.query.slot_id);
        }
        if (req.query.rarity_id) {
            filters.rarity_id = parseInt(req.query.rarity_id);
        }
        const result = await itemService.getAllItems(filters);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const getItemById = async (req, res) => {
    try {
        const itemIdParam = req.params.itemId;
        const itemId = typeof itemIdParam === 'string' ? parseInt(itemIdParam) : NaN;
        if (isNaN(itemId)) {
            return res.status(400).json({ error: "Invalid item ID" });
        }
        const result = await itemService.getItemById(itemId);
        if (!result.ok) {
            return res.status(404).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { getAllItems, getItemById };
//# sourceMappingURL=itemController.js.map