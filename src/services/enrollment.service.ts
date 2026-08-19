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

export const updateGrade = async (id: string, grade: string) => {
  return prisma.studentCourse.update({
    where: { id },
    data: { grade },
    include: {
      student: { include: { user: true } },
      course: true,
    },
  });
};

export const listAllEnrollments = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [enrollments, total] = await Promise.all([
    prisma.studentCourse.findMany({
      skip,
      take: limit,
      include: {
        student: { include: { user: true } },
        course: {
          include: { department: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentCourse.count(),
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
