"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/services/auth.service.ts
const prisma_config_1 = __importDefault(require("../prisma-config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT = 10;
class AuthService {
    static async register(data) {
        const { name, email, password, role } = data;
        const existing = await prisma_config_1.default.user.findUnique({ where: { email } });
        if (existing) {
            throw new Error("USER_EXISTS");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT);
        const user = await prisma_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role ?? "STUDENT",
            },
        });
        // Create profile stubs
        if (user.role === "STUDENT") {
            await prisma_config_1.default.student.create({ data: { userId: user.id } }).catch(() => { });
        }
        if (user.role === "TEACHER") {
            await prisma_config_1.default.teacher.create({ data: { userId: user.id } }).catch(() => { });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    static async login(data) {
        const { email, password } = data;
        const user = await prisma_config_1.default.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("INVALID_CREDENTIALS");
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            throw new Error("INVALID_CREDENTIALS");
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    static async getMe(userId) {
        return prisma_config_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    static async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma_config_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error("USER_NOT_FOUND");
        const match = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!match)
            throw new Error("OLD_PASSWORD_WRONG");
        if (oldPassword === newPassword)
            throw new Error("SAME_PASSWORD");
        const hashed = await bcryptjs_1.default.hash(newPassword, SALT);
        await prisma_config_1.default.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
        return true;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map