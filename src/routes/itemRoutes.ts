import { Router } from "express";
import { getAllItems, getItemById } from "../controllers/itemController.js";

const router = Router();

router.get("/", getAllItems);
router.get("/:itemId", getItemById);

export default router;
