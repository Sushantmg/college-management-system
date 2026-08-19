import prisma from "../prisma-config";

export const listStudents = async (page = 1, limit = 20, search?: string) => {
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

  const [students, total] = await Promise.all([
    prisma.student.findMany({
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
    prisma.student.count({ where }),
  ]);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getStudentById = async (id: string) => {
  return prisma.student.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      courses: {
        include: {
          course: {
            include: {
              department: true,
              teacher: { include: { user: true } },
            },
          },
        },
      },
    }
  });
};

export const getStudentByUserId = async (userId: string) => {
  return prisma.student.findUnique({
    where: { userId },
    include: {
      user: true,
      department: true,
      courses: {
        include: {
          course: {
            include: {
              department: true,
              teacher: { include: { user: true } },
            },
          },
        },
      },
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
      departmentId: data.departmentId || null,
    },
    include: {
      user: true,
      department: true,
    }
  });
};

export const updateStudent = async (
  id: string,
  data: { departmentId?: string }
) => {
  return prisma.student.update({
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

export const deleteStudent = async (id: string) => {
  await prisma.studentCourse.deleteMany({ where: { studentId: id } });
  return prisma.student.delete({ where: { id } });
};
