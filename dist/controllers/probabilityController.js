import probabilityEngine from "../services/probabilityEngine.js";
export const getProbabilities = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const wheelTierIdParam = req.params.wheelTierId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        const wheelTierId = typeof wheelTierIdParam === 'string' ? parseInt(wheelTierIdParam) : NaN;
        if (isNaN(userId) || isNaN(wheelTierId)) {
            return res.status(400).json({ error: "Invalid user ID or wheel tier ID" });
        }
        const result = await probabilityEngine.getProbabilityDistribution(wheelTierId, userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { getProbabilities };
//# sourceMappingURL=probabilityController.js.map