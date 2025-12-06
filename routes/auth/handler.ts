import { Request, Response } from "express";
import prisma from "../../prisma-config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT_ROUNDS = 10;

// ==========================================
// REGISTER USER (Student / Teacher / Admin / Staff)
// ==========================================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ error: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    // AUTO CREATE PROFILE DEPENDING ON ROLE
    if (createdUser.role === "STUDENT") {
      await prisma.student.create({
        data: {
          userId: createdUser.id,
          departmentId: null, // will be assigned later
        },
      }).catch(() => {});
    }

    if (createdUser.role === "TEACHER") {
      await prisma.teacher.create({
        data: { userId: createdUser.id },
      }).catch(() => {});
    }

    const token = jwt.sign(
      { id: createdUser.id, role: createdUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

// ==========================================
// LOGIN
// ==========================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ==========================================
// GET ME (Same as HamroMart getMe)
// ==========================================
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user_id;

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ==========================================
// CHANGE PASSWORD (Same pattern as HamroMart)
// ==========================================
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user_id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "Both passwords are required" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const isOldCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldCorrect)
      return res.status(400).json({ error: "Old password is incorrect" });

    if (oldPassword === newPassword)
      return res.status(400).json({ error: "New password cannot be the same" });

    const hashedNew = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    return res.json({ result: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
