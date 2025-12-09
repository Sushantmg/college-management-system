// routes/auth/handler.ts
import { Request, Response } from "express";
import prisma from "../../prisma-config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../../types/schema-types"; // if you use types

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT = 10;

export const register = async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, SALT);

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role ?? "STUDENT", // will conform to Role enum
      },
    });

    // create profile stubs only with allowed fields
    if (createdUser.role === "STUDENT") {
      await prisma.student.create({
        data: {
          userId: createdUser.id,
          // departmentId omitted: it's optional now
        },
      }).catch(() => {});
    }

    if (createdUser.role === "TEACHER") {
      await prisma.teacher.create({
        data: {
          userId: createdUser.id,
          // departmentId optional
        },
      }).catch(() => {});
    }

    const token = jwt.sign({ userId: createdUser.id, role: createdUser.role }, JWT_SECRET, { expiresIn: "7d" });

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
  } catch (err: any) {
    console.error("Registration Error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const login = async (req: Request<{}, {}, LoginInput>, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      result: "Login Successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // use req.user?.userId (set by auth middleware)
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    return res.json(user);
  } catch (err: any) {
    console.error("GetMe Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: "Both passwords required" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: "Old password incorrect" });

    if (oldPassword === newPassword) return res.status(400).json({ error: "New password must be different" });

    const hashedNew = await bcrypt.hash(newPassword, SALT);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedNew } });

    return res.json({ result: "Password changed successfully" });
  } catch (err: any) {
    console.error("ChangePassword Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
