"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacherById = exports.listTeachers = void 0;
const prisma_config_1 = __importDefault(require("../prisma-config"));
const listTeachers = async () => {
    return prisma_config_1.default.teacher.findMany({
        include: {
            user: true,
            department: true,
            courses: true
        }
    });
};
exports.listTeachers = listTeachers;
const getTeacherById = async (id) => {
    return prisma_config_1.default.teacher.findUnique({
        where: { id },
        include: {
            user: true,
            department: true,
            courses: true
        }
    });
};
exports.getTeacherById = getTeacherById;
const createTeacher = async (data) => {
    return prisma_config_1.default.teacher.create({
        data: {
            userId: data.userId,
            departmentId: data.departmentId || null
        }
    });
};
exports.createTeacher = createTeacher;
const updateTeacher = async (id, data) => {
    return prisma_config_1.default.teacher.update({
        where: { id },
        data
    });
};
exports.updateTeacher = updateTeacher;
const deleteTeacher = async (id) => {
    return prisma_config_1.default.teacher.delete({
        where: { id }
    });
};
exports.deleteTeacher = deleteTeacher;
//# sourceMappingURL=teacher.service.js.map