import { Router } from "express";
import * as controller from "../controllers/teacher.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { teacherCreateSchema } from "../utils/schema";

const router = Router();

/* =========================
   TEACHER ROUTES
========================= */

// List teachers (ADMIN + TEACHER)
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.listTeachers
);

// Get single teacher
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.getTeacher
);

// Create teacher (ADMIN only)
router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(teacherCreateSchema),
  controller.createTeacher
);

// Update teacher (ADMIN only)
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.updateTeacher
);

// Delete teacher (ADMIN only)
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteTeacher
);

export default router;
