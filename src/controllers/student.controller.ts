import { Request, Response } from "express";
import * as studentService from "../services/student.service";

export const listStudents = async (_req: Request, res: Response) => {
  try {
    const students = await studentService.listStudents();
    res.json(students);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentById(req.params.id);

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.updateStudent(
      req.params.id,
      req.body
    );
    res.json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
