import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT = 10;

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.studentCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", SALT);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@college.edu",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("Created admin:", admin.email);

  // Create Teachers
  const teacherPassword = await bcrypt.hash("teacher123", SALT);

  const teacher1User = await prisma.user.create({
    data: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@college.edu",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      name: "Prof. Michael Chen",
      email: "michael.chen@college.edu",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  const teacher3User = await prisma.user.create({
    data: {
      name: "Dr. Emily Williams",
      email: "emily.williams@college.edu",
      password: teacherPassword,
      role: Role.TEACHER,
    },
  });

  console.log("Created teachers");

  // Create Departments
  const csDept = await prisma.department.create({
    data: { name: "Computer Science" },
  });

  const mathDept = await prisma.department.create({
    data: { name: "Mathematics" },
  });

  const physicsDept = await prisma.department.create({
    data: { name: "Physics" },
  });

  const engDept = await prisma.department.create({
    data: { name: "English" },
  });

  console.log("Created departments");

  // Create Teachers with departments
  const teacher1 = await prisma.teacher.create({
    data: { userId: teacher1User.id, departmentId: csDept.id },
  });

  const teacher2 = await prisma.teacher.create({
    data: { userId: teacher2User.id, departmentId: mathDept.id },
  });

  const teacher3 = await prisma.teacher.create({
    data: { userId: teacher3User.id, departmentId: physicsDept.id },
  });

  // Set department heads
  await prisma.department.update({
    where: { id: csDept.id },
    data: { headId: teacher1.id },
  });

  await prisma.department.update({
    where: { id: mathDept.id },
    data: { headId: teacher2.id },
  });

  await prisma.department.update({
    where: { id: physicsDept.id },
    data: { headId: teacher3.id },
  });

  console.log("Assigned department heads");

  // Create Students
  const studentPassword = await bcrypt.hash("student123", SALT);

  const studentUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alex Thompson",
        email: "alex.thompson@student.college.edu",
        password: studentPassword,
        role: Role.STUDENT,
      },
    }),
    prisma.user.create({
      data: {
        name: "Jessica Martinez",
        email: "jessica.martinez@student.college.edu",
        password: studentPassword,
        role: Role.STUDENT,
      },
    }),
    prisma.user.create({
      data: {
        name: "David Kim",
        email: "david.kim@student.college.edu",
        password: studentPassword,
        role: Role.STUDENT,
      },
    }),
    prisma.user.create({
      name: "Rachel Green",
      email: "rachel.green@student.college.edu",
      password: studentPassword,
      role: Role.STUDENT,
    }),
    prisma.user.create({
      name: "James Wilson",
      email: "james.wilson@student.college.edu",
      password: studentPassword,
      role: Role.STUDENT,
    }),
  ]);

  const students = await Promise.all(
    studentUsers.map((user, i) =>
      prisma.student.create({
        data: {
          userId: user.id,
          departmentId: [csDept.id, csDept.id, mathDept.id, physicsDept.id, engDept.id][i],
        },
      })
    )
  );

  console.log("Created students");

  // Create Courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        name: "Introduction to Programming",
        code: "CS101",
        description: "Learn the fundamentals of programming using TypeScript and JavaScript.",
        departmentId: csDept.id,
        teacherId: teacher1.id,
      },
    }),
    prisma.course.create({
      data: {
        name: "Data Structures & Algorithms",
        code: "CS201",
        description: "Study fundamental data structures and algorithm design techniques.",
        departmentId: csDept.id,
        teacherId: teacher1.id,
      },
    }),
    prisma.course.create({
      data: {
        name: "Calculus I",
        code: "MATH101",
        description: "Introduction to differential and integral calculus.",
        departmentId: mathDept.id,
        teacherId: teacher2.id,
      },
    }),
    prisma.course.create({
      data: {
        name: "Linear Algebra",
        code: "MATH201",
        description: "Study of vector spaces, matrices, and linear transformations.",
        departmentId: mathDept.id,
        teacherId: teacher2.id,
      },
    }),
    prisma.course.create({
      data: {
        name: "Classical Mechanics",
        code: "PHY101",
        description: "Newtonian mechanics and its applications.",
        departmentId: physicsDept.id,
        teacherId: teacher3.id,
      },
    }),
    prisma.course.create({
      data: {
        name: "Database Systems",
        code: "CS301",
        description: "Relational databases, SQL, and database design principles.",
        departmentId: csDept.id,
        teacherId: teacher1.id,
      },
    }),
    prisma.course.create({
      data: {
        name: "English Composition",
        code: "ENG101",
        description: "Develop academic writing and critical thinking skills.",
        departmentId: engDept.id,
      },
    }),
  ]);

  console.log("Created courses");

  // Enroll students in courses
  const enrollments = [
    { studentId: students[0].id, courseId: courses[0].id, grade: "A" },
    { studentId: students[0].id, courseId: courses[1].id, grade: "B+" },
    { studentId: students[0].id, courseId: courses[2].id, grade: "A-" },
    { studentId: students[1].id, courseId: courses[0].id, grade: "B" },
    { studentId: students[1].id, courseId: courses[5].id, grade: "A" },
    { studentId: students[2].id, courseId: courses[2].id, grade: "B+" },
    { studentId: students[2].id, courseId: courses[3].id, grade: "A" },
    { studentId: students[3].id, courseId: courses[4].id, grade: "B-" },
    { studentId: students[3].id, courseId: courses[6].id, grade: "A+" },
    { studentId: students[4].id, courseId: courses[6].id, grade: "B" },
    { studentId: students[4].id, courseId: courses[0].id, grade: "C+" },
  ];

  await prisma.studentCourse.createMany({ data: enrollments });

  console.log("Created enrollments");
  console.log("\n--- Seed Complete ---");
  console.log("\nLogin credentials:");
  console.log("  Admin:   admin@college.edu / admin123");
  console.log("  Teacher: sarah.johnson@college.edu / teacher123");
  console.log("  Student: alex.thompson@student.college.edu / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
