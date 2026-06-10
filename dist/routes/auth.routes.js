"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const schema_1 = require("../utils/schema");
const router = (0, express_1.Router)();
// PUBLIC
router.post("/register", (0, validationMiddleware_1.validate)(schema_1.registerSchema), auth_controller_1.register);
router.post("/login", (0, validationMiddleware_1.validate)(schema_1.loginSchema), auth_controller_1.login);
// PROTECTED
router.get("/me", authMiddleware_1.authMiddleware, auth_controller_1.getMe);
router.post("/change-password", authMiddleware_1.authMiddleware, auth_controller_1.changePassword);
// ROLE BASED
router.get("/admin-only", authMiddleware_1.authMiddleware, (0, authMiddleware_1.permit)("ADMIN"), (_req, res) => {
    res.json({
        message: "Admin access granted",
    });
});
router.get("/student-only", authMiddleware_1.authMiddleware, (0, authMiddleware_1.permit)("STUDENT"), (_req, res) => {
    res.json({
        message: "Hello Student",
    });
});
exports.default = router;
