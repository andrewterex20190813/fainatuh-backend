import { Router } from "express";
import ProfileController from "../controllers/ProfileController";
import Authorize from "../middleware/Authorize";
import fileUpload from 'express-fileupload';




const router = Router();

router.post("/upload", Authorize.check, fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
}), ProfileController.saveProfile);
router.get("/history", Authorize.check, ProfileController.findHistory);



export default router;