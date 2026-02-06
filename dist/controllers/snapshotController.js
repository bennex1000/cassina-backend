import statAggregator from "../services/statAggregator.js";
export const getSnapshot = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await statAggregator.getActiveSnapshot(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const refreshSnapshot = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await statAggregator.refreshSnapshot(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { getSnapshot, refreshSnapshot };
//# sourceMappingURL=snapshotController.js.map