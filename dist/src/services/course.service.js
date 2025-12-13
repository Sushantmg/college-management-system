"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.listCourses = exports.createCourse = void 0;
const prisma_config_1 = __importDefault(require("../prisma-config"));
const createCourse = async (data) => {
    return prisma_config_1.default.course.create({
        data: {
            ...data,
            description: data.description ?? null,
            teacherId: data.teacherId ?? null
        }
    });
};
exports.createCourse = createCourse;
const listCourses = async () => {
    return prisma_config_1.default.course.findMany({
        include: {
            department: true,
            teacher: true
        }
    });
};
exports.listCourses = listCourses;
const getCourseById = async (id) => {
    return prisma_config_1.default.course.findUnique({
        where: { id },
        include: {
            department: true,
            teacher: true,
            students: true
        }
    });
};
exports.getCourseById = getCourseById;
const updateCourse = async (id, data) => {
    return prisma_config_1.default.course.update({
        where: { id },
        data
    });
};
exports.updateCourse = updateCourse;
const deleteCourse = async (id) => {
    return prisma_config_1.default.course.delete({
        where: { id }
    });
};
exports.deleteCourse = deleteCourse;
//# sourceMappingURL=course.service.js.map