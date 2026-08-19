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

export const listCourses = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const result = await courseService.listCourses(page, limit, search);
    res.json(result);
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
