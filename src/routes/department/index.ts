import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../../middleware/authMiddleware";
import { validate } from "../../../middleware/validationMiddleware";
import { departmentSchema } from "../../../utils/schema";

const router = Router();

// ---------------------------
// PUBLIC / PROTECTED ROUTES
// ---------------------------

// GET ALL DEPARTMENTS
router.get(
  "/",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  handler.listDepartments
);

// GET SINGLE DEPARTMENT
router.get(
  "/:id",
  authMiddleware,
  permit("ADMIN", "TEACHER", "STUDENT"),
  handler.getDepartment
);

// ---------------------------
// ADMIN ONLY ROUTES
// ---------------------------

// CREATE DEPARTMENT
router.post(
  "/",
  authMiddleware,
  permit("ADMIN"),
  validate(departmentSchema),
  handler.createDepartment
);

// UPDATE DEPARTMENT
router.put(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  handler.updateDepartment
);

// DELETE DEPARTMENT
router.delete(
  "/:id",
  authMiddleware,
  permit("ADMIN"),
  handler.deleteDepartment
);

export default router;
