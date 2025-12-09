"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudent = exports.listStudents = void 0;
const prisma_config_1 = __importDefault(require("../../prisma-config"));
// ================================
// LIST ALL STUDENTS
// ================================
const listStudents = async (_req, res) => {
    try {
        const students = await prisma_config_1.default.student.findMany({
            include: {
                user: true,
                department: true,
                courses: true,
            },
        });
        res.json(students);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.listStudents = listStudents;
// ================================
// GET SINGLE STUDENT
// ================================
const getStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await prisma_config_1.default.student.findUnique({
            where: { id },
            include: {
                user: true,
                department: true,
                courses: true,
            },
        });
        if (!student)
            return res.status(404).json({ error: "Student not found" });
        res.json(student);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getStudent = getStudent;
// ================================
// CREATE STUDENT
// ================================
const createStudent = async (req, res) => {
    const { userId, departmentId } = req.body;
    try {
        const student = await prisma_config_1.default.student.create({
            data: {
                userId,
                departmentId,
            },
        });
        res.status(201).json(student);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createStudent = createStudent;
// ================================
// UPDATE STUDENT
// ================================
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const student = await prisma_config_1.default.student.update({
            where: { id },
            data,
        });
        res.json(student);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updateStudent = updateStudent;
// ================================
// DELETE STUDENT
// ================================
const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_config_1.default.student.delete({
            where: { id },
        });
        res.json({ ok: true });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=handler.js.map