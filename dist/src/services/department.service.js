"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.getDepartmentById = exports.listDepartments = exports.createDepartment = void 0;
const prisma_config_1 = __importDefault(require("../prisma-config"));
const createDepartment = async (data) => {
    return prisma_config_1.default.department.create({
        data: {
            name: data.name,
            headId: data.headId || null
        }
    });
};
exports.createDepartment = createDepartment;
const listDepartments = async () => {
    return prisma_config_1.default.department.findMany({
        include: {
            head: { include: { user: true } },
            teachers: true,
            courses: true,
            students: true
        }
    });
};
exports.listDepartments = listDepartments;
const getDepartmentById = async (id) => {
    return prisma_config_1.default.department.findUnique({
        where: { id },
        include: {
            head: { include: { user: true } },
            teachers: true,
            courses: true,
            students: true
        }
    });
};
exports.getDepartmentById = getDepartmentById;
const updateDepartment = async (id, data) => {
    return prisma_config_1.default.department.update({
        where: { id },
        data: {
            name: data.name,
            headId: data.headId || null
        }
    });
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (id) => {
    return prisma_config_1.default.department.delete({
        where: { id }
    });
};
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=department.service.js.map