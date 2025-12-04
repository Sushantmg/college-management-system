import { Router } from "express";
import { register, login } from "./handler";
import { validate } from "../../middleware/validationMiddleware";
import { registerSchema, loginSchema } from "../../utils/schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
