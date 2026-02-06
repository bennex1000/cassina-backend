import pitySystem from "../services/pitySystem.js";
export const getPityStatus = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await pitySystem.getPityStatus(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const resetPity = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await pitySystem.resetPityCounter(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json({ success: result.data });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { getPityStatus, resetPity };
//# sourceMappingURL=pityController.js.map