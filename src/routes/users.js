import { Router } from "express";
import UsersController from "../controllers/UsersController";
import UserRequestsController from "../controllers/UserRequestsController";
import Authorize from "../middleware/Authorize";

const router = Router();

router.get("/users", Authorize.check, UsersController.index);
router.get("/profile", UsersController.index);
router.get("/users/requests/:id", UserRequestsController.getById);
router.get("/users/requests", UserRequestsController.getAll);
router.post("/users/requests", UserRequestsController.create);
router.put("/users/requests/:id", UserRequestsController.update);

export default router;
