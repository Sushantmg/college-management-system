import { Router } from "express";
import * as controller from "../controllers/stats.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getStats
);

export default router;
