"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.listStudents = void 0;
const prisma_config_1 = __importDefault(require("../prisma-config"));
const listStudents = async () => {
    return prisma_config_1.default.student.findMany({
        include: {
            user: true,
            department: true,
            courses: true
        }
    });
};
exports.listStudents = listStudents;
const getStudentById = async (id) => {
    return prisma_config_1.default.student.findUnique({
        where: { id },
        include: {
            user: true,
            department: true,
            courses: true
        }
    });
};
exports.getStudentById = getStudentById;
const createStudent = async (data) => {
    return prisma_config_1.default.student.create({
        data: {
            userId: data.userId,
            departmentId: data.departmentId
        }
    });
};
exports.createStudent = createStudent;
const updateStudent = async (id, data) => {
    return prisma_config_1.default.student.update({
        where: { id },
        data
    });
};
exports.updateStudent = updateStudent;
const deleteStudent = async (id) => {
    return prisma_config_1.default.student.delete({
        where: { id }
    });
};
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=student.service.js.map