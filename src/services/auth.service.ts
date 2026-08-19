import { Role } from "@prisma/client";
import prisma from "../prisma-config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RegisterInput, LoginInput } from "../utils/schema";

const SALT = 10;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

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

    if (user.role === "STUDENT") {
      await prisma.student.create({ data: { userId: user.id } }).catch(() => {});
    }

    if (user.role === "TEACHER") {
      await prisma.teacher.create({ data: { userId: user.id } }).catch(() => {});
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      getJwtSecret(),
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
      getJwtSecret(),
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        student: {
          include: {
            department: true,
            courses: { include: { course: true } },
          },
        },
        teacher: {
          include: {
            department: true,
            courses: true,
          },
        },
      },
    });

    return user;
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

  static async listUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUser(userId: string, data: { name?: string; email?: string; role?: string }) {
    const updateData: { name?: string; email?: string; role?: Role } = {
      name: data.name,
      email: data.email,
    };
    if (data.role) {
      updateData.role = data.role as Role;
    }
    return prisma.user.update({
      where: { id: userId },
      data: updateData,
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

  static async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("USER_NOT_FOUND");

    if (user.role === "STUDENT") {
      await prisma.studentCourse.deleteMany({ where: { student: { userId } } });
      await prisma.student.delete({ where: { userId } }).catch(() => {});
    }

    if (user.role === "TEACHER") {
      await prisma.course.updateMany({ where: { teacherId: user.id }, data: { teacherId: null } });
      await prisma.teacher.delete({ where: { userId } }).catch(() => {});
    }

    await prisma.user.delete({ where: { id: userId } });
    return true;
  }
}
