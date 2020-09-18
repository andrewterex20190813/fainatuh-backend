import { Router } from "express";
import UsersController from "../controllers/UsersController";
import Authorize from "../middleware/Authorize";

const router = Router();

router.get("/users", Authorize.check, UsersController.index);
router.get("/profile", Authorize.check, UsersController.index);

export default router;
