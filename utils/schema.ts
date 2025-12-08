import { z } from "zod";

/* -----------------------------
   AUTH SCHEMAS
----------------------------- */
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

/* -----------------------------
   COURSE SCHEMA
----------------------------- */
export const courseSchema = z.object({
  name: z.string().min(1, "Course name required"),
  code: z.string().min(1, "Course code required"),
  description: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  teacherId: z.string().optional() // teacher assigning is optional
});

/* -----------------------------
   DEPARTMENT SCHEMA
----------------------------- */
export const departmentSchema = z.object({
  name: z.string().min(1, "Department name required"),
  headId: z.string().nullable().optional() // head may be NULL in Prisma
});

/* -----------------------------
   STUDENT SCHEMA
----------------------------- */
export const studentCreateSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  departmentId: z.string().min(1, "Department ID required")
});

/* -----------------------------
   TEACHER SCHEMA
----------------------------- */
export const teacherCreateSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  departmentId: z.string().nullable().optional() // Teacher may have no department
});
