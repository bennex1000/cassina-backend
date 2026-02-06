import { Router } from "express";
import { spin, getSpinStatus } from "../controllers/spinController.js";
import { getProbabilities } from "../controllers/probabilityController.js";
const router = Router();
router.post("/:userId", spin);
router.get("/:userId/status", getSpinStatus);
router.get("/:userId/probabilities/:wheelTierId", getProbabilities);
export default router;
//# sourceMappingURL=spinRoutes.js.map