import { Router } from "express";
import * as controller from "../controllers/student.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { studentCreateSchema, studentUpdateSchema } from "../utils/schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  controller.listStudents
);

router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getStudent
);

router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(studentCreateSchema),
  controller.createStudent
);

router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER"),
  validate(studentUpdateSchema),
  controller.updateStudent
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteStudent
);

export default router;
