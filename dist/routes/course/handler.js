"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.listCourses = exports.createCourse = void 0;
const prisma_config_1 = __importDefault(require("../../prisma-config"));
/* =====================================================
    CREATE COURSE  (ADMIN & SUPERADMIN ONLY)
===================================================== */
const createCourse = async (req, res) => {
    try {
        const { name, code, description, departmentId, teacherId } = req.body;
        const course = await prisma_config_1.default.course.create({
            data: {
                name,
                code,
                description: description ?? null,
                departmentId,
                teacherId: teacherId ?? null
            }
        });
        return res.status(201).json({
            message: "Course created successfully",
            course
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.createCourse = createCourse;
/* =====================================================
    LIST ALL COURSES — PUBLIC
===================================================== */
const listCourses = async (_req, res) => {
    const courses = await prisma_config_1.default.course.findMany({
        include: {
            department: true,
            teacher: true
        }
    });
    return res.json(courses);
};
exports.listCourses = listCourses;
/* =====================================================
    GET SINGLE COURSE — PUBLIC
===================================================== */
const getCourse = async (req, res) => {
    const { id } = req.params;
    const course = await prisma_config_1.default.course.findUnique({
        where: { id },
        include: {
            department: true,
            teacher: true,
            students: true
        }
    });
    if (!course)
        return res.status(404).json({ error: "Course not found" });
    return res.json(course);
};
exports.getCourse = getCourse;
/* =====================================================
    UPDATE COURSE  (ADMIN & SUPERADMIN ONLY)
===================================================== */
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updated = await prisma_config_1.default.course.update({
            where: { id },
            data
        });
        return res.json({
            message: "Course updated successfully",
            course: updated
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.updateCourse = updateCourse;
/* =====================================================
    DELETE COURSE  (ADMIN & SUPERADMIN ONLY)
===================================================== */
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    await prisma_config_1.default.course.delete({ where: { id } });
    return res.json({
        message: "Course deleted successfully",
        ok: true
    });
};
exports.deleteCourse = deleteCourse;
//# sourceMappingURL=handler.js.map