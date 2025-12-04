import { Request, Response } from "express";
import prisma from "../../prisma-config";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, headId } = req.body;
    const dept = await prisma.department.create({
      data: { name, headId: headId || null }
    });
    res.status(201).json(dept);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listDepartments = async (_req: Request, res: Response) => {
  const depts = await prisma.department.findMany({
    include: { head: { include: { user: true } }, teachers: true, courses: true, students: true }
  });
  res.json(depts);
};

export const getDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const dept = await prisma.department.findUnique({
    where: { id },
    include: { head: { include: { user: true } }, teachers: true, courses: true, students: true }
  });
  if (!dept) return res.status(404).json({ error: "Not found" });
  res.json(dept);
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, headId } = req.body;
  try {
    const dept = await prisma.department.update({
      where: { id },
      data: { name, headId: headId || null }
    });
    res.json(dept);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.department.delete({ where: { id } });
  res.json({ ok: true });
};
