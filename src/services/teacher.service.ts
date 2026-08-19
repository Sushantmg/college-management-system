import prisma from "../prisma-config";

export const listTeachers = async (page = 1, limit = 20, search?: string) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        user: {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        },
      }
    : {};

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: true,
        department: true,
        _count: { select: { courses: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.teacher.count({ where }),
  ]);

  return {
    teachers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTeacherById = async (id: string) => {
  return prisma.teacher.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      courses: {
        include: {
          department: true,
          _count: { select: { students: true } },
        },
      },
    }
  });
};

export const createTeacher = async (data: {
  userId: string;
  departmentId?: string;
}) => {
  const createData: { userId: string; departmentId?: string } = { userId: data.userId };
  if (data.departmentId) {
    createData.departmentId = data.departmentId;
  }
  return prisma.teacher.create({
    data: createData,
    include: {
      user: true,
      department: true,
    }
  });
};

export const updateTeacher = async (
  id: string,
  data: { departmentId?: string }
) => {
  return prisma.teacher.update({
    where: { id },
    data: {
      departmentId: data.departmentId ?? undefined,
    },
    include: {
      user: true,
      department: true,
    }
  });
};

export const deleteTeacher = async (id: string) => {
  await prisma.course.updateMany({ where: { teacherId: id }, data: { teacherId: null } });
  return prisma.teacher.delete({ where: { id } });
};
