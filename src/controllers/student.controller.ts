import { Request, Response } from "express";
import * as studentService from "../services/student.service";

/* =========================
   LIST STUDENTS
========================= */
export const listStudents = async (_req: Request, res: Response) => {
  try {
    const students = await studentService.listStudents();
    return res.json(students);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE STUDENT
========================= */
export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.getStudentById(req.params.id);

    if (!student)
      return res.status(404).json({ error: "Student not found" });

    return res.json(student);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   CREATE STUDENT
========================= */
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.createStudent(req.body);
    return res.status(201).json(student);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   UPDATE STUDENT
========================= */
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.updateStudent(
      req.params.id,
      req.body
    );
    return res.json(student);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   DELETE STUDENT
========================= */
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await studentService.deleteStudent(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
