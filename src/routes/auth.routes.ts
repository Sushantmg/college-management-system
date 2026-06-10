import { Router } from "express";

import {
  register,
  login,
  getMe,
  changePassword,
} from "../controllers/auth.controller";

import {
  authMiddleware,
  permit,
} from "../middleware/authMiddleware";

import { validate } from "../middleware/validationMiddleware";

import {
  registerSchema,
  loginSchema,
} from "../utils/schema";

const router = Router();

// PUBLIC
router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

// PROTECTED
router.get(
  "/me",
  authMiddleware,
  getMe
);

router.post(
  "/change-password",
  authMiddleware,
  changePassword
);

// ROLE BASED
router.get(
  "/admin-only",
  authMiddleware,
  permit("ADMIN"),
  (_req, res) => {
    res.json({
      message: "Admin access granted",
    });
  }
);

router.get(
  "/student-only",
  authMiddleware,
  permit("STUDENT"),
  (_req, res) => {
    res.json({
      message: "Hello Student",
    });
  }
);

export default router;