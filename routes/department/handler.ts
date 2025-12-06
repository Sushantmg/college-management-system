import { Request, Response } from "express";
import prisma from "../../prisma-config";

// --------------------------------------
// CREATE DEPARTMENT
// --------------------------------------
export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, headId } = req.body;

    const department = await prisma.department.create({
      data: {
        name,
        headId: headId || null,
      },
    });

    return res.status(201).json(department);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// --------------------------------------
// LIST ALL DEPARTMENTS
// --------------------------------------
export const listDepartments = async (_req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        head: { include: { user: true } },
        teachers: true,
        courses: true,
        students: true,
      },
    });

    return res.json(departments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// --------------------------------------
// GET A SINGLE DEPARTMENT
// --------------------------------------
export const getDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        head: { include: { user: true } },
        teachers: true,
        courses: true,
        students: true,
      },
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    return res.json(department);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// --------------------------------------
// UPDATE DEPARTMENT
// --------------------------------------
export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, headId } = req.body;

    const updated = await prisma.department.update({
      where: { id },
      data: {
        name,
        headId: headId || null,
      },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// --------------------------------------
// DELETE DEPARTMENT
// --------------------------------------
export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id },
    });

    return res.json({ message: "Department deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
