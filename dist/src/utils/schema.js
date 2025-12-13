"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherCreateSchema = exports.studentCreateSchema = exports.departmentSchema = exports.courseSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/* -----------------------------
   AUTH SCHEMAS
----------------------------- */
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional()
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters")
});
/* -----------------------------
   COURSE SCHEMA
----------------------------- */
exports.courseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Course name required"),
    code: zod_1.z.string().min(1, "Course code required"),
    description: zod_1.z.string().optional(),
    departmentId: zod_1.z.string().min(1, "Department is required"),
    teacherId: zod_1.z.string().optional() // teacher assigning is optional
});
/* -----------------------------
   DEPARTMENT SCHEMA
----------------------------- */
exports.departmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Department name required"),
    headId: zod_1.z.string().nullable().optional() // head may be NULL in Prisma
});
/* -----------------------------
   STUDENT SCHEMA
----------------------------- */
exports.studentCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID required"),
    departmentId: zod_1.z.string().min(1, "Department ID required")
});
/* -----------------------------
   TEACHER SCHEMA
----------------------------- */
exports.teacherCreateSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID required"),
    departmentId: zod_1.z.string().nullable().optional() // Teacher may have no department
});
//# sourceMappingURL=schema.js.map