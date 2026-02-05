import { Request, Response } from "express";
import accessoryService from "../services/accessoryService.js";

export const getAllAccessories = async (_req: Request, res: Response) => {
  try {
    const rows = await accessoryService.getAllAccessories();
    return res.status(201).json(rows);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default { getAllAccessories };
