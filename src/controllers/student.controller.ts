import { Request, Response } from "express";
import * as studentService from "../services/student.service";
import { RequestWithUser } from "../types/global-types";

export const listStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const result = await studentService.listStudents(page, limit, search);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    let student;

    // If the student is requesting their own profile, look up by userId
    const requestUser = (req as RequestWithUser).user;
    if (requestUser?.role === "STUDENT") {
      student = await studentService.getStudentByUserId(requestUser.userId);
    } else {
      student = await studentService.getStudentById(req.params.id);
    }

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
    res.status(201).json({
      message: "Student created successfully",
      student,
    });
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
    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
