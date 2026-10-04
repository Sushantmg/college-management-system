import prisma from "../prisma-config";

export const enrollStudent = async (studentId: string, courseId: string) => {
  const existing = await prisma.studentCourse.findFirst({
    where: { studentId, courseId },
  });

  if (existing) {
    throw new Error("ALREADY_ENROLLED");
  }

  return prisma.studentCourse.create({
    data: { studentId, courseId },
    include: {
      student: { include: { user: true } },
      course: true,
    },
  });
};

export const unenrollStudent = async (studentId: string, courseId: string) => {
  const enrollment = await prisma.studentCourse.findFirst({
    where: { studentId, courseId },
  });

  if (!enrollment) {
    throw new Error("NOT_ENROLLED");
  }

  return prisma.studentCourse.delete({
    where: { id: enrollment.id },
  });
};

export const getStudentEnrollments = async (studentId: string) => {
  return prisma.studentCourse.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          department: true,
          teacher: { include: { user: true } },
        },
      },
    },
  });
};

export const getCourseEnrollments = async (courseId: string) => {
  return prisma.studentCourse.findMany({
    where: { courseId },
    include: {
      student: { include: { user: true } },
    },
  });
};

export const updateGrade = async (id: string, grade?: string | null) => {
  return prisma.studentCourse.update({
    where: { id },
    data: { grade: grade || null },
    include: {
      student: { include: { user: true } },
      course: true,
    },
  });
};

export const listAllEnrollments = async (page = 1, limit = 20, search?: string) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { student: { user: { name: { contains: search, mode: "insensitive" as const } } } },
          { student: { user: { email: { contains: search, mode: "insensitive" as const } } } },
          { course: { name: { contains: search, mode: "insensitive" as const } } },
          { course: { code: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [enrollments, total] = await Promise.all([
    prisma.studentCourse.findMany({
      where,
      skip,
      take: limit,
      include: {
        student: { include: { user: true } },
        course: {
          include: {
            department: true,
            teacher: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentCourse.count({ where }),
  ]);

  return {
    enrollments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
