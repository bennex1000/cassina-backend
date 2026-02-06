import { Router } from "express";
import { register, login, getProfile } from "../controllers/userController.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/:userId", getProfile);
export default router;
//# sourceMappingURL=userRoutes.js.map