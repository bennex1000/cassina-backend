import spinService from "../services/spinService.js";
import cooldownManager from "../services/cooldownManager.js";
import { db } from "../database.js";
export const spin = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await spinService.performSpin(userId);
        if (!result.ok) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export const getSpinStatus = async (req, res) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await cooldownManager.getCooldownStatus(userId);
        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }
        // Add formatted time remaining and streak info
        const status = result.data;
        const formatted = status.time_remaining_seconds
            ? cooldownManager.formatTimeRemaining(status.time_remaining_seconds)
            : "Ready to spin!";
        // Fetch daily streak
        const streakQuery = await db.query(`SELECT daily_streak FROM user_progression WHERE user_id = $1`, [userId]);
        const streak = streakQuery.rows[0]?.daily_streak || 0;
        return res.status(200).json({
            ...status,
            time_remaining_formatted: formatted,
            daily_streak: streak
        });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};
export default { spin, getSpinStatus };
//# sourceMappingURL=spinController.js.map