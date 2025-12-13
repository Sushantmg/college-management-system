import { Router } from "express";
import * as controller from "../controllers/department.controller";
import { authMiddleware, permit } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { departmentSchema } from "../utils/schema";

const router = Router();

// ---------------------------
// SHARED ROUTES
// ---------------------------
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.listDepartments
);

router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  controller.getDepartment
);

// ---------------------------
// ADMIN ONLY ROUTES
// ---------------------------
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
  controller.updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  controller.deleteDepartment
);

export default router;
