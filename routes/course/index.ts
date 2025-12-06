import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { courseSchema } from "../../utils/schema";

const router = Router();

// ----------------------------
// All Users: Admin, Teacher, Student
// ----------------------------
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  handler.listCourses
);

router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  handler.getCourse
);

// ----------------------------
// Create Course: Only Admin + Teacher
// ----------------------------
router.post(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(courseSchema), 
  handler.createCourse
);

// ----------------------------
// Update Course: Only Admin + Teacher
// ----------------------------
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(courseSchema), 
  handler.updateCourse
);

// ----------------------------
// Delete Course: Only Admin
// ----------------------------
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  handler.deleteCourse
);

export default router;
