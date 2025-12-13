"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validationMiddleware_1 = require("../../../middleware/validationMiddleware");
const schema_1 = require("../../utils/schema");
const router = (0, express_1.Router)();
/* ========================
      AUTH ROUTES
======================== */
// Register (ADMIN can create any role, others default STUDENT)
router.post("/register", (0, validationMiddleware_1.validate)(schema_1.registerSchema), auth_controller_1.register);
// Login
router.post("/login", (0, validationMiddleware_1.validate)(schema_1.loginSchema), auth_controller_1.login);
// Get logged-in user details (same as getMe)
router.get("/me", auth_middleware_1.validateToken, auth_controller_1.getMe);
// Change password
router.post("/change-password", auth_middleware_1.validateToken, auth_controller_1.changePassword);
/* ========================
      ROLE-PROTECTED ROUTES
======================== */
// Only STAFF or ADMIN
router.get("/staff-dashboard", auth_middleware_1.validateToken, (0, auth_middleware_1.allowRoles)("STAFF", "ADMIN", "SUPERADMIN"), (req, res) => {
    res.json({ message: "Welcome Staff/Admin!" });
});
// ADMIN only route
router.get("/admin-only", auth_middleware_1.validateToken, (0, auth_middleware_1.allowRoles)("ADMIN", "SUPERADMIN"), (req, res) => {
    res.json({ message: "Admin access granted!" });
});
// STUDENT-only test route
router.get("/student-only", auth_middleware_1.validateToken, (0, auth_middleware_1.allowRoles)("STUDENT"), (req, res) => {
    res.json({ message: "Hello Student!" });
});
exports.default = router;
//# sourceMappingURL=index.js.map