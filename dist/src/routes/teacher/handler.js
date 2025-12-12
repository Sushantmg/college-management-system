"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacher = exports.listTeachers = void 0;
const prisma_config_1 = __importDefault(require("../../prisma-config"));
// ================================
// LIST ALL TEACHERS
// ================================
const listTeachers = async (_req, res) => {
    try {
        const teachers = await prisma_config_1.default.teacher.findMany({
            include: { user: true, department: true, courses: true },
        });
        res.json(teachers);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.listTeachers = listTeachers;
// ================================
// GET SINGLE TEACHER
// ================================
const getTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await prisma_config_1.default.teacher.findUnique({
            where: { id },
            include: { user: true, department: true, courses: true },
        });
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found" });
        }
        res.json(teacher);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getTeacher = getTeacher;
// ================================
// CREATE TEACHER
// ================================
const createTeacher = async (req, res) => {
    const { userId, departmentId } = req.body;
    try {
        const teacher = await prisma_config_1.default.teacher.create({
            data: {
                userId,
                departmentId: departmentId || null,
            },
        });
        res.status(201).json(teacher);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createTeacher = createTeacher;
// ================================
// UPDATE TEACHER
// ================================
const updateTeacher = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updated = await prisma_config_1.default.teacher.update({
            where: { id },
            data,
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updateTeacher = updateTeacher;
// ================================
// DELETE TEACHER
// ================================
const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_config_1.default.teacher.delete({ where: { id } });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteTeacher = deleteTeacher;
//# sourceMappingURL=handler.js.map