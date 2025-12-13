import prisma from "../prisma-config";

export const listStudents = async () => {
  return prisma.student.findMany({
    include: {
      user: true,
      department: true,
      courses: true
    }
  });
};

export const getStudentById = async (id: string) => {
  return prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      courses: true
    }
  });
};

export const createStudent = async (data: {
  userId: string;
  departmentId?: string;
}) => {
  return prisma.student.create({
    data: {
      userId: data.userId,
      departmentId: data.departmentId
    }
  });
};

export const updateStudent = async (
  id: string,
  data: Record<string, any>
) => {
  return prisma.student.update({
    where: { id },
    data
  });
};

export const deleteStudent = async (id: string) => {
  return prisma.student.delete({
    where: { id }
  });
};
