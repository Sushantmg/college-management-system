import { Router } from "express";

import {
  register,
  login,
  getMe,
  changePassword,
  listUsers,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller";

import {
  authMiddleware,
  permit,
} from "../middleware/authMiddleware";

import { validate } from "../middleware/validationMiddleware";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateUserSchema,
} from "../utils/schema";

const router = Router();

// PUBLIC
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// PROTECTED
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), changePassword);

// ADMIN - User Management
router.get("/users", authMiddleware, permit("ADMIN"), listUsers);
router.put("/users/:id", authMiddleware, permit("ADMIN"), validate(updateUserSchema), updateUser);
router.delete("/users/:id", authMiddleware, permit("ADMIN"), deleteUser);

export default router;
