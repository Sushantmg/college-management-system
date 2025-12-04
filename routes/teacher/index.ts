import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { teacherCreateSchema } from "../../utils/schema";

const router = Router();

router.get("/", authMiddleware, permit("ADMIN","TEACHER"), handler.listTeachers);
router.get("/:id", authMiddleware, permit("ADMIN","TEACHER"), handler.getTeacher);

router.post("/", authMiddleware, permit("ADMIN"), validate(teacherCreateSchema), handler.createTeacher);
router.put("/:id", authMiddleware, permit("ADMIN"), handler.updateTeacher);
router.delete("/:id", authMiddleware, permit("ADMIN"), handler.deleteTeacher);

export default router;
