import { Request, Response } from "express";
import * as departmentService from "../services/department.service";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listDepartments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const result = await departmentService.listDepartments(page, limit, search);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listAllDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await departmentService.listAllDepartments();
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
    res.json({
      message: "Department updated successfully",
      department: updated,
    });
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
