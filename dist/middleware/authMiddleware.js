"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffOnly = exports.superUserOnly = exports.permit = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is missing in environment variables");
}
// --------------------------------------------------
// AUTHENTICATION MIDDLEWARE (Verify JWT)
// --------------------------------------------------
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Bearer token missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attaching decoded user payload to req
        req.user = decoded;
        return next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
// --------------------------------------------------
// AUTHORIZATION MIDDLEWARE (Role-based Access)
// --------------------------------------------------
const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permission" });
        }
        return next();
    };
};
exports.permit = permit;
// --------------------------------------------------
// SHORTCUTS (Optional)
// --------------------------------------------------
exports.superUserOnly = (0, exports.permit)("SUPERUSER");
exports.staffOnly = (0, exports.permit)("STAFF", "SUPERUSER");
//# sourceMappingURL=authMiddleware.js.map