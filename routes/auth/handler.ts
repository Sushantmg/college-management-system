import { Request, Response } from "express";
import prisma from "../../prisma-config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role ?? "STUDENT" }
    });

    // If user is student or teacher, create profile entries (optional)
    if (user.role === "STUDENT") {
      // create student stub (department assigned later)
      await prisma.student.create({
        data: { userId: user.id, departmentId: "" } // user will set department later or admin will assign
      }).catch(() => {});
    } else if (user.role === "TEACHER") {
      await prisma.teacher.create({
        data: { userId: user.id }
      }).catch(() => {});
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
