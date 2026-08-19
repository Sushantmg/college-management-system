import { Router } from "express";
import * as controller from "../controllers/course.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { courseSchema, courseUpdateSchema } from "../utils/schema";

const router = Router();

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

router.post(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(courseSchema),
  controller.createCourse
);

router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(courseUpdateSchema),
  controller.updateCourse
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteCourse
);

export default router;
