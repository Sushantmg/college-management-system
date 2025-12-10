import { Request, Response } from "express";
import prisma from "../../prisma-config";

/* =====================================================
    CREATE COURSE  (ADMIN & SUPERADMIN ONLY)
===================================================== */
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { name, code, description, departmentId, teacherId } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description: description ?? null,
        departmentId,
        teacherId: teacherId ?? null
      }
    });

    return res.status(201).json({
      message: "Course created successfully",
      course
    });

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =====================================================
    LIST ALL COURSES — PUBLIC
===================================================== */
export const listCourses = async (_req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    include: {
      department: true,
      teacher: true
    }
  });

  return res.json(courses);
};

/* =====================================================
    GET SINGLE COURSE — PUBLIC
===================================================== */
export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      department: true,
      teacher: true,
      students: true
    }
  });

  if (!course) return res.status(404).json({ error: "Course not found" });

  return res.json(course);
};

/* =====================================================
    UPDATE COURSE  (ADMIN & SUPERADMIN ONLY)
===================================================== */
export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.course.update({
      where: { id },
      data
    });

    return res.json({
      message: "Course updated successfully",
      course: updated
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

/* =====================================================
    DELETE COURSE  (ADMIN & SUPERADMIN ONLY)
===================================================== */
export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.course.delete({ where: { id } });

  return res.json({
    message: "Course deleted successfully",
    ok: true
  });
};
