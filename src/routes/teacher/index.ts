import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../../middleware/authMiddleware";
import { validate } from "../../../middleware/validationMiddleware";
import { teacherCreateSchema } from "../../utils/schema";

const router = Router();

// ================================
// GET ALL TEACHERS
// ADMIN + TEACHER
// ================================
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  handler.listTeachers
);

// ================================
// GET SINGLE TEACHER
// ADMIN + TEACHER
// ================================
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  handler.getTeacher
);

// ================================
// CREATE TEACHER
// ONLY ADMIN
// ================================
router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(teacherCreateSchema),
  handler.createTeacher
);

// ================================
// UPDATE TEACHER
// ONLY ADMIN
// ================================
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  handler.updateTeacher
);

// ================================
// DELETE TEACHER
// ONLY ADMIN
// ================================
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  handler.deleteTeacher
);

export default router;
