import { Router } from "express";
import * as controller from "../controllers/course.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { courseSchema } from "../utils/schema";

const router = Router();

// ----------------------------
// View Courses
// ----------------------------
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.listCourses
);

router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getCourse
);

// ----------------------------
// Create Course
// ----------------------------
router.post(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(courseSchema),
  controller.createCourse
);

// ----------------------------
// Update Course
// ----------------------------
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(courseSchema),
  controller.updateCourse
);

// ----------------------------
// Delete Course
// ----------------------------
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteCourse
);

export default router;
