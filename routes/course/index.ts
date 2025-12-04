import { Router } from "express";
import * as handler from "./handler";
import { authMiddleware, permit } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validationMiddleware";
import { courseSchema } from "../../utils/schema";

const router = Router();

router.get("/", authMiddleware, permit("ADMIN","TEACHER","STUDENT"), handler.listCourses);
router.get("/:id", authMiddleware, permit("ADMIN","TEACHER","STUDENT"), handler.getCourse);

router.post("/", authMiddleware, permit("ADMIN","TEACHER"), validate(courseSchema), handler.createCourse);
router.put("/:id", authMiddleware, permit("ADMIN","TEACHER"), handler.updateCourse);
router.delete("/:id", authMiddleware, permit("ADMIN"), handler.deleteCourse);

export default router;
