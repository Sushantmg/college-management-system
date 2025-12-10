import { Request, Response } from "express";
import prisma from "../../prisma-config";

// ================================
// LIST ALL STUDENTS
// ================================
export const listStudents = async (_req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        department: true,
        courses: true,
      },
    });
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// GET SINGLE STUDENT
// ================================
export const getStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        department: true,
        courses: true,
      },
    });

    if (!student)
      return res.status(404).json({ error: "Student not found" });

    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// CREATE STUDENT
// ================================
export const createStudent = async (req: Request, res: Response) => {
  const { userId, departmentId } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        userId,
        departmentId,
      },
    });

    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ================================
// UPDATE STUDENT
// ================================
export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const student = await prisma.student.update({
      where: { id },
      data,
    });

    res.json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ================================
// DELETE STUDENT
// ================================
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.student.delete({
    where: { id },
    });

    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
