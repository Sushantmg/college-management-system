import { Request, Response } from "express";
import * as teacherService from "../services/teacher.service";

export const listTeachers = async (_req: Request, res: Response) => {
  try {
    const teachers = await teacherService.listTeachers();
    res.json(teachers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }

    res.json(teacher);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const updated = await teacherService.updateTeacher(
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    await teacherService.deleteTeacher(req.params.id);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
