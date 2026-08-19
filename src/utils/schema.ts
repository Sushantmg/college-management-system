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

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "STAFF", "SUPERUSER"]).optional(),
});

/* -----------------------------
   COURSE SCHEMAS
----------------------------- */
export const courseSchema = z.object({
  name: z.string().min(1, "Course name required"),
  code: z.string().min(1, "Course code required"),
  description: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  teacherId: z.string().optional()
});

export const courseUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  description: z.string().optional(),
  departmentId: z.string().min(1).optional(),
  teacherId: z.string().optional(),
});

/* -----------------------------
   DEPARTMENT SCHEMA
----------------------------- */
export const departmentSchema = z.object({
  name: z.string().min(1, "Department name required"),
  headId: z.string().nullable().optional()
});

export const departmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  headId: z.string().nullable().optional(),
});

/* -----------------------------
   STUDENT SCHEMA
----------------------------- */
export const studentCreateSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  departmentId: z.string().min(1, "Department ID required")
});

export const studentUpdateSchema = z.object({
  departmentId: z.string().min(1).optional(),
});

/* -----------------------------
   TEACHER SCHEMA
----------------------------- */
export const teacherCreateSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  departmentId: z.string().nullable().optional()
});

export const teacherUpdateSchema = z.object({
  departmentId: z.string().nullable().optional(),
});

/* -----------------------------
   ENROLLMENT SCHEMA
----------------------------- */
export const enrollSchema = z.object({
  studentId: z.string().min(1, "Student ID required"),
  courseId: z.string().min(1, "Course ID required"),
});

export const gradeSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
});

/* -----------------------------
   INFERRED TYPES
----------------------------- */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type CourseInput = z.infer<typeof courseSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;
export type StudentCreateInput = z.infer<typeof studentCreateSchema>;
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;
export type TeacherCreateInput = z.infer<typeof teacherCreateSchema>;
export type TeacherUpdateInput = z.infer<typeof teacherUpdateSchema>;

export type EnrollInput = z.infer<typeof enrollSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
