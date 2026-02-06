import { Router } from "express";
import { getActiveStats, getSetBonuses, getEffectiveStats, } from "../controllers/statsController.js";
import { getSnapshot, refreshSnapshot, } from "../controllers/snapshotController.js";
const router = Router();
router.get("/:userId/active", getActiveStats);
router.get("/:userId/bonuses", getSetBonuses);
router.get("/:userId/effective", getEffectiveStats);
router.get("/:userId/snapshot", getSnapshot);
router.post("/:userId/snapshot/refresh", refreshSnapshot);
export default router;
//# sourceMappingURL=statsRoutes.js.map