import { Router } from "express";
import * as controller from "../controllers/student.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { studentCreateSchema } from "../utils/schema";

const router = Router();

/* =========================
   STUDENT ROUTES
========================= */

// List all students (Admin + Teacher)
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.listStudents
);

// Get single student
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getStudent
);

// Create student (Admin only)
router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(studentCreateSchema),
  controller.createStudent
);

// Update student (Admin + Teacher)
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.updateStudent
);

// Delete student (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteStudent
);

export default router;
