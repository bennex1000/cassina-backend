import { Router } from "express";
import { getAllAccessories } from "../controllers/accessoryController.js";

const router = Router();

router.get("/accesories", getAllAccessories);

export default router;
