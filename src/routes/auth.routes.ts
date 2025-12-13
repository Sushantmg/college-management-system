// src/routes/auth.routes.ts
import { Router } from "express";
import {
  register,
  login,
  getMe,
  changePassword,
} from "../controllers/auth.controller";

import { validateToken, allowRoles } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { registerSchema, loginSchema } from "../utils/schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", validateToken, getMe);
router.post("/change-password", validateToken, changePassword);

// Role test routes
router.get(
  "/admin-only",
  validateToken,
  allowRoles("ADMIN"),
  (_req, res) => res.json({ message: "Admin access granted" })
);

router.get(
  "/student-only",
  validateToken,
  allowRoles("STUDENT"),
  (_req, res) => res.json({ message: "Hello Student" })
);

export default router;
