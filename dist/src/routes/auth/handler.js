"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = exports.register = void 0;
const prisma_config_1 = __importDefault(require("../../prisma-config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT = 10;
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: "All fields are required" });
        const existing = await prisma_config_1.default.user.findUnique({ where: { email } });
        if (existing)
            return res.status(409).json({ error: "User already exists" });
        const hashed = await bcryptjs_1.default.hash(password, SALT);
        const createdUser = await prisma_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: role ?? "STUDENT", // will conform to Role enum
            },
        });
        // create profile stubs only with allowed fields
        if (createdUser.role === "STUDENT") {
            await prisma_config_1.default.student.create({
                data: {
                    userId: createdUser.id,
                    // departmentId omitted: it's optional now
                },
            }).catch(() => { });
        }
        if (createdUser.role === "TEACHER") {
            await prisma_config_1.default.teacher.create({
                data: {
                    userId: createdUser.id,
                    // departmentId optional
                },
            }).catch(() => { });
        }
        const token = jsonwebtoken_1.default.sign({ userId: createdUser.id, role: createdUser.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({
            result: "Registration Successful",
            token,
            user: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role,
            },
        });
    }
    catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing fields" });
        const user = await prisma_config_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            result: "Login Successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        // use req.user?.userId (set by auth middleware)
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await prisma_config_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
        });
        return res.json(user);
    }
    catch (err) {
        console.error("GetMe Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword)
            return res.status(400).json({ error: "Both passwords required" });
        const user = await prisma_config_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const match = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!match)
            return res.status(400).json({ error: "Old password incorrect" });
        if (oldPassword === newPassword)
            return res.status(400).json({ error: "New password must be different" });
        const hashedNew = await bcryptjs_1.default.hash(newPassword, SALT);
        await prisma_config_1.default.user.update({ where: { id: userId }, data: { password: hashedNew } });
        return res.json({ result: "Password changed successfully" });
    }
    catch (err) {
        console.error("ChangePassword Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=handler.js.map