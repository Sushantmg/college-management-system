import { Router } from "express";
import * as controller from "../controllers/department.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { departmentSchema, departmentUpdateSchema } from "../utils/schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.listDepartments
);

router.get(
  "/all",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.listAllDepartments
);

router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getDepartment
);

router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(departmentSchema),
  controller.createDepartment
);

router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  validate(departmentUpdateSchema),
  controller.updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteDepartment
);

export default router;
