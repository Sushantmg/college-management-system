import prisma from "../prisma-config";

export const getOverallStats = async () => {
  const [
    departments,
    teachers,
    students,
    courses,
    enrollments,
    userCounts,
  ] = await Promise.all([
    prisma.department.count(),
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.course.count(),
    prisma.studentCourse.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
  ]);

  const assigned: Record<string, number> = {};
  userCounts.forEach((row) => {
    assigned[row.role] = row._count._all;
  });

  return {
    counts: {
      departments,
      teachers,
      students,
      courses,
      enrollments,
    },
    usersByRole: assigned,
  };
};

export const getDepartmentBreakdown = async () => {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          teachers: true,
          students: true,
          courses: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    teachers: dept._count.teachers,
    students: dept._count.students,
    courses: dept._count.courses,
  }));
};

export const getRecentEnrollments = async (limit = 10) => {
  return prisma.studentCourse.findMany({
    take: limit,
    include: {
      student: { include: { user: true } },
      course: { select: { name: true, code: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};
