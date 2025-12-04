import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { departmentSchema } from "../../utils/schema";

const router = Router();

router.get("/", authMiddleware, permit("ADMIN","TEACHER","STUDENT"), handler.listDepartments);
router.get("/:id", authMiddleware, permit("ADMIN","TEACHER","STUDENT"), handler.getDepartment);

router.post("/", authMiddleware, permit("ADMIN"), validate(departmentSchema), handler.createDepartment);
router.put("/:id", authMiddleware, permit("ADMIN"), handler.updateDepartment);
router.delete("/:id", authMiddleware, permit("ADMIN"), handler.deleteDepartment);

export default router;
