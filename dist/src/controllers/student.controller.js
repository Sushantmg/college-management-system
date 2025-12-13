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
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudent = exports.listStudents = void 0;
const studentService = __importStar(require("../services/student.service"));
/* =========================
   LIST STUDENTS
========================= */
const listStudents = async (_req, res) => {
    try {
        const students = await studentService.listStudents();
        return res.json(students);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.listStudents = listStudents;
/* =========================
   GET SINGLE STUDENT
========================= */
const getStudent = async (req, res) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        if (!student)
            return res.status(404).json({ error: "Student not found" });
        return res.json(student);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.getStudent = getStudent;
/* =========================
   CREATE STUDENT
========================= */
const createStudent = async (req, res) => {
    try {
        const student = await studentService.createStudent(req.body);
        return res.status(201).json(student);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.createStudent = createStudent;
/* =========================
   UPDATE STUDENT
========================= */
const updateStudent = async (req, res) => {
    try {
        const student = await studentService.updateStudent(req.params.id, req.body);
        return res.json(student);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.updateStudent = updateStudent;
/* =========================
   DELETE STUDENT
========================= */
const deleteStudent = async (req, res) => {
    try {
        await studentService.deleteStudent(req.params.id);
        return res.json({ ok: true });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=student.controller.js.map