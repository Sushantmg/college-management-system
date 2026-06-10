import { Request, Response } from "express";
import * as departmentService from "../services/department.service";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await departmentService.listDepartments();
    res.json(departments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    if (!department) {
      res.status(404).json({ error: "Department not found" });
      return;
    }

    res.json(department);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const updated = await departmentService.updateDepartment(
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.json({ message: "Department deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
