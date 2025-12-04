import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const courseSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  departmentId: z.string().min(1),
  teacherId: z.string().optional()
});

export const departmentSchema = z.object({
  name: z.string().min(1),
  headId: z.string().optional()
});

export const studentCreateSchema = z.object({
  userId: z.string().min(1),
  departmentId: z.string().min(1)
});

export const teacherCreateSchema = z.object({
  userId: z.string().min(1),
  departmentId: z.string().optional()
});
