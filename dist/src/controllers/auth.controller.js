"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getMe = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.register(req.body);
        return res.status(201).json({
            message: "Registration successful",
            ...result,
        });
    }
    catch (err) {
        if (err.message === "USER_EXISTS") {
            return res.status(409).json({ error: "User already exists" });
        }
        return res.status(500).json({ error: "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.login(req.body);
        return res.json({
            message: "Login successful",
            ...result,
        });
    }
    catch {
        return res.status(401).json({ error: "Invalid credentials" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const user = await auth_service_1.AuthService.getMe(userId);
    return res.json(user);
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const { oldPassword, newPassword } = req.body;
    try {
        await auth_service_1.AuthService.changePassword(userId, oldPassword, newPassword);
        return res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        if (err.message === "OLD_PASSWORD_WRONG") {
            return res.status(400).json({ error: "Old password incorrect" });
        }
        if (err.message === "SAME_PASSWORD") {
            return res.status(400).json({ error: "New password must be different" });
        }
        return res.status(500).json({ error: "Server error" });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map