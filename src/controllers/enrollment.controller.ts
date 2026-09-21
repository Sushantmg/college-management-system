import { Request, Response } from "express";
import * as enrollmentService from "../services/enrollment.service";
import { getErrorMessage } from "../utils/errors";

export const enrollStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId } = req.body;
    const enrollment = await enrollmentService.enrollStudent(studentId, courseId);
    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (err) {
    if (getErrorMessage(err) === "ALREADY_ENROLLED") {
      res.status(409).json({ error: "Student is already enrolled in this course" });
      return;
    }
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const unenrollStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId } = req.body;
    await enrollmentService.unenrollStudent(studentId, courseId);
    res.json({ message: "Student unenrolled successfully" });
  } catch (err) {
    if (getErrorMessage(err) === "NOT_ENROLLED") {
      res.status(404).json({ error: "Enrollment not found" });
      return;
    }
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const getStudentEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await enrollmentService.getStudentEnrollments(req.params.studentId);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const getCourseEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await enrollmentService.getCourseEnrollments(req.params.courseId);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};

export const updateGrade = async (req: Request, res: Response) => {
  try {
    const { grade } = req.body;
    const enrollment = await enrollmentService.updateGrade(req.params.id, grade);
    res.json({
      message: "Grade updated successfully",
      enrollment,
    });
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
};

export const listAllEnrollments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await enrollmentService.listAllEnrollments(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
};