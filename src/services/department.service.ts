import prisma from "../prisma-config";

export const createDepartment = async (data: {
  name: string;
  headId?: string;
}) => {
  return prisma.department.create({
    data: {
      name: data.name,
      headId: data.headId || null
    }
  });
};

export const listDepartments = async () => {
  return prisma.department.findMany({
    include: {
      head: { include: { user: true } },
      teachers: true,
      courses: true,
      students: true
    }
  });
};

export const getDepartmentById = async (id: string) => {
  return prisma.department.findUnique({
    where: { id },
    include: {
      head: { include: { user: true } },
      teachers: true,
      courses: true,
      students: true
    }
  });
};

export const updateDepartment = async (
  id: string,
  data: { name?: string; headId?: string }
) => {
  return prisma.department.update({
    where: { id },
    data: {
      name: data.name,
      headId: data.headId || null
    }
  });
};

export const deleteDepartment = async (id: string) => {
  return prisma.department.delete({
    where: { id }
  });
};
