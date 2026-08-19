import prisma from "../prisma-config";

export const createDepartment = async (data: {
  name: string;
  headId?: string;
}) => {
  const createData: { name: string; headId?: string } = { name: data.name };
  if (data.headId) {
    createData.headId = data.headId;
  }
  const dept = await prisma.department.create({ data: createData });
  return formatDepartment(dept);
};

export const listDepartments = async (page = 1, limit = 20, search?: string) => {
  const skip = (page - 1) * limit;

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [departments, total] = await Promise.all([
    prisma.department.findMany({
      where,
      skip,
      take: limit,
      include: {
        _count: { select: { teachers: true, students: true, courses: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.department.count({ where }),
  ]);

  const formatted = await Promise.all(departments.map(d => formatDepartment(d)));

  return {
    departments: formatted,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const listAllDepartments = async () => {
  const departments = await prisma.department.findMany({
    include: {
      _count: { select: { teachers: true, students: true, courses: true } },
    },
    orderBy: { name: "asc" },
  });
  return Promise.all(departments.map(d => formatDepartment(d)));
};

export const getDepartmentById = async (id: string) => {
  const dept = await prisma.department.findUnique({
    where: { id },
    include: {
      teachers: { include: { user: true } },
      courses: true,
      students: { include: { user: true } },
    }
  });
  if (!dept) return null;
  return formatDepartment(dept);
};

export const updateDepartment = async (
  id: string,
  data: { name?: string; headId?: string }
) => {
  const updateData: { name?: string; headId?: string } = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.headId !== undefined) updateData.headId = data.headId;
  const dept = await prisma.department.update({
    where: { id },
    data: updateData,
  });
  return formatDepartment(dept);
};

export const deleteDepartment = async (id: string) => {
  await prisma.course.deleteMany({ where: { departmentId: id } });
  await prisma.student.updateMany({ where: { departmentId: id }, data: { departmentId: null } });
  await prisma.teacher.updateMany({ where: { departmentId: id }, data: { departmentId: null } });
  return prisma.department.delete({ where: { id } });
};

async function formatDepartment(dept: any) {
  let head = null;
  if (dept.headId) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: dept.headId },
      include: { user: true },
    });
    head = teacher;
  }
  return { ...dept, head };
}
