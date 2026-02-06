import { Request, Response } from "express";
import statsService from "../services/statsService.js";

export const getActiveStats = async (req: Request, res: Response) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = await statsService.calculateActiveStats(userId);

        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const getSetBonuses = async (req: Request, res: Response) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = await statsService.checkSetBonuses(userId);

        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const getEffectiveStats = async (req: Request, res: Response) => {
    try {
        const userIdParam = req.params.userId;
        const userId = typeof userIdParam === 'string' ? parseInt(userIdParam) : NaN;

        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const result = await statsService.getEffectiveMultipliers(userId);

        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { getActiveStats, getSetBonuses, getEffectiveStats };
