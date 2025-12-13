import prisma from "../prisma-config";

export const createCourse = async (data: {
  name: string;
  code: string;
  description?: string;
  departmentId: string;
  teacherId?: string;
}) => {
  return prisma.course.create({
    data: {
      ...data,
      description: data.description ?? null,
      teacherId: data.teacherId ?? null
    }
  });
};

export const listCourses = async () => {
  return prisma.course.findMany({
    include: {
      department: true,
      teacher: true
    }
  });
};

export const getCourseById = async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    include: {
      department: true,
      teacher: true,
      students: true
    }
  });
};

export const updateCourse = async (id: string, data: any) => {
  return prisma.course.update({
    where: { id },
    data
  });
};

export const deleteCourse = async (id: string) => {
  return prisma.course.delete({
    where: { id }
  });
};
