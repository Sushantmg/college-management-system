import { Router } from "express";
import * as controller from "../controllers/enrollment.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";

const router = Router();

// List all enrollments (Admin)
router.get(
  "/",
  authMiddleware,
  permit("ADMIN"),
  controller.listAllEnrollments
);

// Enroll student (Admin + Teacher)
router.post(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.enrollStudent
);

// Unenroll student (Admin + Teacher)
router.delete(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.unenrollStudent
);

// Get student's enrolled courses
router.get(
  "/student/:studentId",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getStudentEnrollments
);

// Get course's enrolled students
router.get(
  "/course/:courseId",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.getCourseEnrollments
);

// Update grade (Admin + Teacher)
router.patch(
  "/:id/grade",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.updateGrade
);

export default router;
