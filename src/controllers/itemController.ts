import { Request, Response } from "express";
import itemService from "../services/itemService.js";

export const getAllItems = async (req: Request, res: Response) => {
    try {
        // Build filters object conditionally to satisfy exactOptionalPropertyTypes
        const filters: {
            stat_id?: number;
            slot_id?: number;
            rarity_id?: number;
        } = {};

        if (req.query.stat_id) {
            filters.stat_id = parseInt(req.query.stat_id as string);
        }
        if (req.query.slot_id) {
            filters.slot_id = parseInt(req.query.slot_id as string);
        }
        if (req.query.rarity_id) {
            filters.rarity_id = parseInt(req.query.rarity_id as string);
        }

        const result = await itemService.getAllItems(filters);

        if (!result.ok) {
            return res.status(500).json({ error: result.error });
        }

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const getItemById = async (req: Request, res: Response) => {
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
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { getAllItems, getItemById };
