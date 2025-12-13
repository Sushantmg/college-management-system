"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const schema_1 = require("../utils/schema");
const router = (0, express_1.Router)();
router.post("/register", (0, validationMiddleware_1.validate)(schema_1.registerSchema), auth_controller_1.register);
router.post("/login", (0, validationMiddleware_1.validate)(schema_1.loginSchema), auth_controller_1.login);
router.get("/me", authMiddleware_1.validateToken, auth_controller_1.getMe);
router.post("/change-password", authMiddleware_1.validateToken, auth_controller_1.changePassword);
// Role test routes
router.get("/admin-only", authMiddleware_1.validateToken, (0, authMiddleware_1.allowRoles)("ADMIN"), (_req, res) => res.json({ message: "Admin access granted" }));
router.get("/student-only", authMiddleware_1.validateToken, (0, authMiddleware_1.allowRoles)("STUDENT"), (_req, res) => res.json({ message: "Hello Student" }));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map