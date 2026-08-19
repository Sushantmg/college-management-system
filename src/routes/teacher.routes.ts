import { Router } from "express";
import * as controller from "../controllers/teacher.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { teacherCreateSchema, teacherUpdateSchema } from "../utils/schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.listTeachers
);

router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.getTeacher
);

router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(teacherCreateSchema),
  controller.createTeacher
);

router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(teacherUpdateSchema),
  controller.updateTeacher
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteTeacher
);

export default router;
