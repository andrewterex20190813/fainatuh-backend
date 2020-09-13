import { Router } from "express";
import AuthController from "../controllers/AuthController";
import Validate from "../middleware/Validate";
import Authorize from "../middleware/Authorize";
import authSchemas from "../schemas/auth";

const router = Router();

router.post(
  "/auth/signin",
  Validate.prepare(authSchemas.signin),
  AuthController.signin
);
router.post(
  "/auth/signup",
  Validate.prepare(authSchemas.signup),
  AuthController.signup
);
router.put(
  "/auth/set-password",
  Validate.prepare(authSchemas.setPassword),
  AuthController.setPassword
);
router.post(
  "/auth/check-password-token-validity",
  Validate.prepare(authSchemas.checkPasswordTokenValidity),
  AuthController.checkPasswordTokenValidity
);
router.put(
  "/auth/renew-password-token",
  Validate.prepare(authSchemas.renewPasswordToken),
  AuthController.renewPasswordToken
)
router.post(
  "/auth/refresh-tokens",
  Validate.prepare(authSchemas.refreshTokens),
  AuthController.refreshTokens
);
router.post("/auth/logout", Authorize.check, AuthController.logout);
router.post(
  "/auth/restore-password",
  Validate.prepare(authSchemas.restorePassword),
  AuthController.restorePassword
);
router.post(
  "/auth/confirm-restore-password",
  Validate.prepare(authSchemas.confirmRestorePassword),
  AuthController.confirmRestorePassword
);
router.post(
  "/auth/verify-restore-password-token",
  Validate.prepare(authSchemas.verifyRestorePasswordToken),
  AuthController.verifyRestorePasswordToken,
)

export default router;
