import { Router } from "express";
import { getInventory, getEquipped, equipItem, unequipItem, } from "../controllers/inventoryController.js";
const router = Router();
router.get("/:userId", getInventory);
router.get("/:userId/equipped", getEquipped);
router.put("/:userId/equip/:itemId", equipItem);
router.delete("/:userId/unequip/:slotId", unequipItem);
export default router;
//# sourceMappingURL=inventoryRoutes.js.map