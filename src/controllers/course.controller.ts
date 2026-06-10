import { Request, Response } from "express";
import * as courseService from "../services/course.service";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await courseService.listCourses();
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json(course);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await courseService.updateCourse(
      req.params.id,
      req.body
    );

    res.json({
      message: "Course updated successfully",
      course
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    await courseService.deleteCourse(req.params.id);

    res.json({
      message: "Course deleted successfully",
      ok: true
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
