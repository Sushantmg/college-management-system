import { Request, Response } from "express";
import * as departmentService from "../services/department.service";

/* =========================
   CREATE DEPARTMENT
========================= */
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    return res.status(201).json(department);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   LIST DEPARTMENTS
========================= */
export const listDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await departmentService.listDepartments();
    return res.json(departments);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE DEPARTMENT
========================= */
export const getDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    if (!department)
      return res.status(404).json({ error: "Department not found" });

    return res.json(department);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE DEPARTMENT
========================= */
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const updated = await departmentService.updateDepartment(
      req.params.id,
      req.body
    );
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   DELETE DEPARTMENT
========================= */
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    return res.json({ message: "Department deleted successfully" });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
