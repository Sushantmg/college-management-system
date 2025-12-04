import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { studentCreateSchema } from "../../utils/schema";

const router = Router();

router.get("/", authMiddleware, permit("ADMIN","TEACHER"), handler.listStudents);
router.get("/:id", authMiddleware, permit("ADMIN","TEACHER","STUDENT"), handler.getStudent);

// Admins create students
router.post("/", authMiddleware, permit("ADMIN"), validate(studentCreateSchema), handler.createStudent);
router.put("/:id", authMiddleware, permit("ADMIN","TEACHER"), handler.updateStudent);
router.delete("/:id", authMiddleware, permit("ADMIN"), handler.deleteStudent);

export default router;
