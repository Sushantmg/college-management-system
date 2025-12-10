import { Request, Response } from "express";
import prisma from "../../prisma-config";

// ================================
// LIST ALL TEACHERS
// ================================
export const listTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: { user: true, department: true, courses: true },
    });

    res.json(teachers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// GET SINGLE TEACHER
// ================================
export const getTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true, department: true, courses: true },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ================================
// CREATE TEACHER
// ================================
export const createTeacher = async (req: Request, res: Response) => {
  const { userId, departmentId } = req.body;

  try {
    const teacher = await prisma.teacher.create({
      data: {
        userId,
        departmentId: departmentId || null,
      },
    });

    res.status(201).json(teacher);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ================================
// UPDATE TEACHER
// ================================
export const updateTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.teacher.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ================================
// DELETE TEACHER
// ================================
export const deleteTeacher = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.teacher.delete({ where: { id } });

    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
