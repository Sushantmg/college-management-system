import prisma from "../prisma-config";

export const listTeachers = async () => {
  return prisma.teacher.findMany({
    include: {
      user: true,
      department: true,
      courses: true
    }
  });
};

export const getTeacherById = async (id: string) => {
  return prisma.teacher.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      courses: true
    }
  });
};

export const createTeacher = async (data: {
  userId: string;
  departmentId?: string;
}) => {
  return prisma.teacher.create({
    data: {
      userId: data.userId,
      departmentId: data.departmentId || null
    }
  });
};

export const updateTeacher = async (
  id: string,
  data: Record<string, any>
) => {
  return prisma.teacher.update({
    where: { id },
    data
  });
};

export const deleteTeacher = async (id: string) => {
  return prisma.teacher.delete({
    where: { id }
  });
};
