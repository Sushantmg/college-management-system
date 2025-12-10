import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../../middleware/authMiddleware";
import { validate } from "../../../middleware/validationMiddleware";
import { studentCreateSchema } from "../../../utils/schema";

const router = Router();

// ================================
// STUDENT ROUTES
// ================================

// List all students (Admins + Teachers)
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  handler.listStudents
);

// Get a single student (Admins, Teachers, and the student themself)
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  handler.getStudent
);

// Create student (Admin only)
router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(studentCreateSchema),
  handler.createStudent
);

// Update student (Admin + Teacher)
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  handler.updateStudent
);

// Delete student (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  handler.deleteStudent
);

export default router;
