import { z } from "zod";

/* -----------------------------
   SHARED HELPERS
----------------------------- */
// MongoDB ObjectId is a 24-character hex string.
export const MONGO_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const objectId = z
  .string()
  .min(1, "ID is required")
  .regex(MONGO_ID_PATTERN, "Invalid ID format");

export const VALID_GRADES = [
  "A+", "A", "A-",
  "B+", "B", "B-",
  "C+", "C", "C-",
  "D+", "D",
  "F",
] as const;

/* -----------------------------
   AUTH SCHEMAS
----------------------------- */
export const passwordComplexity = /^(?=.*[A-Za-z])(?=.*\d).+$/;

// Public registration must NOT accept a role — users always start as STUDENT.
// Roles are assigned by an admin afterwards.
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email format").max(254),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordComplexity, "Password must contain at least one letter and one number"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(passwordComplexity, "New password must contain at least one letter and one number"),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(254).optional(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "STAFF", "SUPERUSER"]).optional(),
});

/* -----------------------------
   COURSE SCHEMAS
----------------------------- */
export const courseSchema = z.object({
  name: z.string().min(1, "Course name required"),
  code: z.string().min(1, "Course code required"),
  description: z.string().optional(),
  departmentId: objectId,
  teacherId: objectId.optional()
});

export const courseUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  description: z.string().optional(),
  departmentId: objectId.optional(),
  teacherId: objectId.optional(),
});

/* -----------------------------
   DEPARTMENT SCHEMA
----------------------------- */
export const departmentSchema = z.object({
  name: z.string().min(1, "Department name required"),
  headId: objectId.nullable().optional()
});

export const departmentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  headId: objectId.nullable().optional(),
});

/* -----------------------------
   STUDENT SCHEMA
----------------------------- */
export const studentCreateSchema = z.object({
  userId: objectId,
  departmentId: objectId
});

export const studentUpdateSchema = z.object({
  departmentId: objectId.optional(),
});

/* -----------------------------
   TEACHER SCHEMA
----------------------------- */
export const teacherCreateSchema = z.object({
  userId: objectId,
  departmentId: objectId.nullable().optional()
});

export const teacherUpdateSchema = z.object({
  departmentId: objectId.nullable().optional(),
});

/* -----------------------------
   ENROLLMENT SCHEMA
----------------------------- */
export const enrollSchema = z.object({
  studentId: objectId,
  courseId: objectId,
});

export const gradeSchema = z.object({
  grade: z.enum(VALID_GRADES),
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
