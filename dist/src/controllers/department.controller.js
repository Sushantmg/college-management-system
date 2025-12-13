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
exports.deleteDepartment = exports.updateDepartment = exports.getDepartment = exports.listDepartments = exports.createDepartment = void 0;
const departmentService = __importStar(require("../services/department.service"));
/* =========================
   CREATE DEPARTMENT
========================= */
const createDepartment = async (req, res) => {
    try {
        const department = await departmentService.createDepartment(req.body);
        return res.status(201).json(department);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.createDepartment = createDepartment;
/* =========================
   LIST DEPARTMENTS
========================= */
const listDepartments = async (_req, res) => {
    try {
        const departments = await departmentService.listDepartments();
        return res.json(departments);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.listDepartments = listDepartments;
/* =========================
   GET SINGLE DEPARTMENT
========================= */
const getDepartment = async (req, res) => {
    try {
        const department = await departmentService.getDepartmentById(req.params.id);
        if (!department)
            return res.status(404).json({ error: "Department not found" });
        return res.json(department);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.getDepartment = getDepartment;
/* =========================
   UPDATE DEPARTMENT
========================= */
const updateDepartment = async (req, res) => {
    try {
        const updated = await departmentService.updateDepartment(req.params.id, req.body);
        return res.json(updated);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.updateDepartment = updateDepartment;
/* =========================
   DELETE DEPARTMENT
========================= */
const deleteDepartment = async (req, res) => {
    try {
        await departmentService.deleteDepartment(req.params.id);
        return res.json({ message: "Department deleted successfully" });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=department.controller.js.map