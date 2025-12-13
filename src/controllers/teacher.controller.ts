import { Request, Response } from "express";
import * as teacherService from "../services/teacher.service";

/* =========================
   LIST TEACHERS
========================= */
export const listTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await teacherService.listTeachers();
    return res.json(teachers);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE TEACHER
========================= */
export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);

    if (!teacher)
      return res.status(404).json({ error: "Teacher not found" });

    return res.json(teacher);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   CREATE TEACHER
========================= */
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    return res.status(201).json(teacher);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   UPDATE TEACHER
========================= */
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const updated = await teacherService.updateTeacher(
      req.params.id,
      req.body
    );
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   DELETE TEACHER
========================= */
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    await teacherService.deleteTeacher(req.params.id);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
