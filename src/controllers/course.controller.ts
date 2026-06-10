import { Request, Response } from "express";
import * as courseService from "../services/course.service";

/* =========================
   CREATE COURSE
========================= */
export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.createCourse(req.body);

    return res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   LIST COURSES
========================= */
export const listCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await courseService.listCourses();
    return res.json(courses);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE COURSE
========================= */
export const getCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.getCourseById(req.params.id);

    if (!course)
      return res.status(404).json({ error: "Course not found" });

    return res.json(course);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE COURSE
========================= */
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.updateCourse(
      req.params.id,
      req.body
    );

    return res.json({
      message: "Course updated successfully",
      course
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =========================
   DELETE COURSE
========================= */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    await courseService.deleteCourse(req.params.id);

    return res.json({
      message: "Course deleted successfully",
      ok: true
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
