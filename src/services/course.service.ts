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
    },
    include: {
      department: true,
      teacher: { include: { user: true } },
    }
  });
};

export const listCourses = async (page = 1, limit = 20, search?: string) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { code: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      include: {
        department: true,
        teacher: { include: { user: true } },
        _count: { select: { students: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getCourseById = async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    include: {
      department: true,
      teacher: { include: { user: true } },
      students: {
        include: {
          student: { include: { user: true } },
        },
      },
    }
  });
};

export const updateCourse = async (
  id: string,
  data: { name?: string; code?: string; description?: string; departmentId?: string; teacherId?: string }
) => {
  return prisma.course.update({
    where: { id },
    data: {
      ...data,
      description: data.description ?? undefined,
      teacherId: data.teacherId ?? undefined,
    },
    include: {
      department: true,
      teacher: { include: { user: true } },
    }
  });
};

export const deleteCourse = async (id: string) => {
  await prisma.studentCourse.deleteMany({ where: { courseId: id } });
  return prisma.course.delete({ where: { id } });
};
