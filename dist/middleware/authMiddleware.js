"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffOnly = exports.superUserOnly = exports.permit = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET missing");
}
// ------------------------------------
// AUTH MIDDLEWARE
// ------------------------------------
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Token expired",
            });
        }
        return res.status(401).json({
            error: "Invalid token",
        });
    }
};
exports.authMiddleware = authMiddleware;
// ------------------------------------
// ROLE AUTHORIZATION
// ------------------------------------
const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Forbidden",
            });
        }
        next();
    };
};
exports.permit = permit;
// ------------------------------------
// SHORTCUTS
// ------------------------------------
exports.superUserOnly = (0, exports.permit)("SUPERUSER");
exports.staffOnly = (0, exports.permit)("STAFF", "SUPERUSER");
