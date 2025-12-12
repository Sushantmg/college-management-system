"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartment = exports.listDepartments = exports.createDepartment = void 0;
const prisma_config_1 = __importDefault(require("../../prisma-config"));
// --------------------------------------
// CREATE DEPARTMENT
// --------------------------------------
const createDepartment = async (req, res) => {
    try {
        const { name, headId } = req.body;
        const department = await prisma_config_1.default.department.create({
            data: {
                name,
                headId: headId || null,
            },
        });
        return res.status(201).json(department);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.createDepartment = createDepartment;
// --------------------------------------
// LIST ALL DEPARTMENTS
// --------------------------------------
const listDepartments = async (_req, res) => {
    try {
        const departments = await prisma_config_1.default.department.findMany({
            include: {
                head: { include: { user: true } },
                teachers: true,
                courses: true,
                students: true,
            },
        });
        return res.json(departments);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.listDepartments = listDepartments;
// --------------------------------------
// GET A SINGLE DEPARTMENT
// --------------------------------------
const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await prisma_config_1.default.department.findUnique({
            where: { id },
            include: {
                head: { include: { user: true } },
                teachers: true,
                courses: true,
                students: true,
            },
        });
        if (!department) {
            return res.status(404).json({ error: "Department not found" });
        }
        return res.json(department);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getDepartment = getDepartment;
// --------------------------------------
// UPDATE DEPARTMENT
// --------------------------------------
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, headId } = req.body;
        const updated = await prisma_config_1.default.department.update({
            where: { id },
            data: {
                name,
                headId: headId || null,
            },
        });
        return res.json(updated);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.updateDepartment = updateDepartment;
// --------------------------------------
// DELETE DEPARTMENT
// --------------------------------------
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_config_1.default.department.delete({
            where: { id },
        });
        return res.json({ message: "Department deleted successfully" });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=handler.js.map