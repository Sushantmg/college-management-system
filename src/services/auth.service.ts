// src/services/auth.service.ts
import prisma from "../prisma-config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput, LoginInput } from "../types/schema-types";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT = 10;

export class AuthService {
  static async register(data: RegisterInput) {
    const { name, email, password, role } = data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error("USER_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role ?? "STUDENT",
      },
    });

    // Create profile stubs
    if (user.role === "STUDENT") {
      await prisma.student.create({ data: { userId: user.id } }).catch(() => {});
    }

    if (user.role === "TEACHER") {
      await prisma.teacher.create({ data: { userId: user.id } }).catch(() => {});
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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

  static async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("INVALID_CREDENTIALS");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

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

  static async getMe(userId: string) {
    return prisma.user.findUnique({
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

  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error("OLD_PASSWORD_WRONG");

    if (oldPassword === newPassword)
      throw new Error("SAME_PASSWORD");

    const hashed = await bcrypt.hash(newPassword, SALT);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return true;
  }
}
