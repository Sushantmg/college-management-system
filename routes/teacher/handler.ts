import { Request, Response } from "express";
import prisma from "../../prisma-config";

export const listTeachers = async (_req: Request, res: Response) => {
  const teachers = await prisma.teacher.findMany({ include: { user: true, department: true, courses: true } });
  res.json(teachers);
};

export const getTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;
  const t = await prisma.teacher.findUnique({ where: { id }, include: { user: true, department: true, courses: true } });
  if (!t) return res.status(404).json({ error: "Not found" });
  res.json(t);
};

export const createTeacher = async (req: Request, res: Response) => {
  const { userId, departmentId } = req.body;
  try {
    const teacher = await prisma.teacher.create({ data: { userId, departmentId: departmentId || null } });
    res.status(201).json(teacher);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const t = await prisma.teacher.update({ where: { id }, data });
    res.json(t);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.teacher.delete({ where: { id } });
  res.json({ ok: true });
};
