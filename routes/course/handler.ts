import { Request, Response } from "express";
import prisma from "../../prisma-config";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, description, departmentId, teacherId } = req.body;
    const course = await prisma.course.create({
      data: { name, code, description: description || null, departmentId, teacherId: teacherId || null }
    });
    res.status(201).json(course);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listCourses = async (_req: Request, res: Response) => {
  const courses = await prisma.course.findMany({ include: { department: true, teacher: true } });
  res.json(courses);
};

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const c = await prisma.course.findUnique({ where: { id }, include: { department: true, teacher: true, students: true } });
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const c = await prisma.course.update({ where: { id }, data });
    res.json(c);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.course.delete({ where: { id } });
  res.json({ ok: true });
};
