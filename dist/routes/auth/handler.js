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
const SALT_ROUNDS = 10;
// ==========================================
// REGISTER USER (Student / Teacher / Admin / Staff)
// ==========================================
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: "All fields are required" });
        const existingUser = await prisma_config_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(409).json({ error: "User already exists with this email" });
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const createdUser = await prisma_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "STUDENT",
            },
        });
        // AUTO CREATE PROFILE DEPENDING ON ROLE
        if (createdUser.role === "STUDENT") {
            await prisma_config_1.default.student.create({
                data: {
                    userId: createdUser.id,
                    departmentId: null, // will be assigned later
                },
            }).catch(() => { });
        }
        if (createdUser.role === "TEACHER") {
            await prisma_config_1.default.teacher.create({
                data: { userId: createdUser.id },
            }).catch(() => { });
        }
        const token = jsonwebtoken_1.default.sign({ id: createdUser.id, role: createdUser.role }, JWT_SECRET, { expiresIn: "7d" });
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
    catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ error: error.message || "Server error" });
    }
};
exports.register = register;
// ==========================================
// LOGIN
// ==========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });
        const user = await prisma_config_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ error: "Invalid email or password" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            result: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.login = login;
// ==========================================
// GET ME (Same as HamroMart getMe)
// ==========================================
const getMe = async (req, res) => {
    try {
        const userId = req.user_id;
        const user = await prisma_config_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.json(user);
    }
    catch (error) {
        console.error("GetMe Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.getMe = getMe;
// ==========================================
// CHANGE PASSWORD (Same pattern as HamroMart)
// ==========================================
const changePassword = async (req, res) => {
    try {
        const userId = req.user_id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword)
            return res.status(400).json({ error: "Both passwords are required" });
        const user = await prisma_config_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const isOldCorrect = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isOldCorrect)
            return res.status(400).json({ error: "Old password is incorrect" });
        if (oldPassword === newPassword)
            return res.status(400).json({ error: "New password cannot be the same" });
        const hashedNew = await bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
        await prisma_config_1.default.user.update({
            where: { id: userId },
            data: { password: hashedNew },
        });
        return res.json({ result: "Password changed successfully" });
    }
    catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=handler.js.map