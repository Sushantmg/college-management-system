import { Router } from "express";
import {
  register,
  login,
  getMe,
  changePassword
} from "../../controllers/auth.controller";

import {
  validateToken,
  allowRoles
} from "../../middleware/auth.middleware";

import { validate } from "../../../middleware/validationMiddleware";
import { registerSchema, loginSchema } from "../../utils/schema";

const router = Router();

/* ========================
      AUTH ROUTES
======================== */

// Register (ADMIN can create any role, others default STUDENT)
router.post("/register", validate(registerSchema), register);

// Login
router.post("/login", validate(loginSchema), login);

// Get logged-in user details (same as getMe)
router.get("/me", validateToken, getMe);

// Change password
router.post("/change-password", validateToken, changePassword);


/* ========================
      ROLE-PROTECTED ROUTES
======================== */

// Only STAFF or ADMIN
router.get(
  "/staff-dashboard",
  validateToken,
  allowRoles("STAFF", "ADMIN", "SUPERADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Staff/Admin!" });
  }
);

// ADMIN only route
router.get(
  "/admin-only",
  validateToken,
  allowRoles("ADMIN", "SUPERADMIN"),
  (req, res) => {
    res.json({ message: "Admin access granted!" });
  }
);

// STUDENT-only test route
router.get(
  "/student-only",
  validateToken,
  allowRoles("STUDENT"),
  (req, res) => {
    res.json({ message: "Hello Student!" });
  }
);

export default router;
