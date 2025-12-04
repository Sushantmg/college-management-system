import { Request, Response } from "express";
import prisma from "../../prisma-config";

export const listStudents = async (_req: Request, res: Response) => {
  const students = await prisma.student.findMany({ include: { user: true, department: true, courses: true } });
  res.json(students);
};

export const getStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const s = await prisma.student.findUnique({ where: { id }, include: { user: true, department: true, courses: true } });
  if (!s) return res.status(404).json({ error: "Not found" });
  res.json(s);
};

export const createStudent = async (req: Request, res: Response) => {
  const { userId, departmentId } = req.body;
  try {
    const student = await prisma.student.create({ data: { userId, departmentId } });
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const s = await prisma.student.update({ where: { id }, data });
    res.json(s);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.student.delete({ where: { id } });
  res.json({ ok: true });
};
