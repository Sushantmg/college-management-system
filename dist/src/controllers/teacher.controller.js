"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacher = exports.listTeachers = void 0;
const teacherService = __importStar(require("../services/teacher.service"));
/* =========================
   LIST TEACHERS
========================= */
const listTeachers = async (_req, res) => {
    try {
        const teachers = await teacherService.listTeachers();
        return res.json(teachers);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.listTeachers = listTeachers;
/* =========================
   GET SINGLE TEACHER
========================= */
const getTeacher = async (req, res) => {
    try {
        const teacher = await teacherService.getTeacherById(req.params.id);
        if (!teacher)
            return res.status(404).json({ error: "Teacher not found" });
        return res.json(teacher);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.getTeacher = getTeacher;
/* =========================
   CREATE TEACHER
========================= */
const createTeacher = async (req, res) => {
    try {
        const teacher = await teacherService.createTeacher(req.body);
        return res.status(201).json(teacher);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.createTeacher = createTeacher;
/* =========================
   UPDATE TEACHER
========================= */
const updateTeacher = async (req, res) => {
    try {
        const updated = await teacherService.updateTeacher(req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.updateTeacher = updateTeacher;
/* =========================
   DELETE TEACHER
========================= */
const deleteTeacher = async (req, res) => {
    try {
        await teacherService.deleteTeacher(req.params.id);
        return res.json({ ok: true });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.deleteTeacher = deleteTeacher;
//# sourceMappingURL=teacher.controller.js.map