import { Router } from "express";
import pityController from "../controllers/pityController.js";
const router = Router();
// Get pity status for a user
router.get("/:userId/status", pityController.getPityStatus);
// Reset pity counter (admin/testing)
router.post("/:userId/reset", pityController.resetPity);
export default router;
//# sourceMappingURL=pityRoutes.js.map