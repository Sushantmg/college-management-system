import api from "./client";

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  grade?: string;
  student?: { id: string; user: { name: string; email: string } };
  course?: { id: string; name: string; code: string; department?: { name: string } };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const enrollmentsApi = {
  list: (page = 1, limit = 20) =>
    api.get<{ enrollments: Enrollment[] } & PaginatedResponse<Enrollment>>("/enrollments", {
      params: { page, limit },
    }),

  getStudentEnrollments: (studentId: string) =>
    api.get<Enrollment[]>(`/enrollments/student/${studentId}`),

  getCourseEnrollments: (courseId: string) =>
    api.get<Enrollment[]>(`/enrollments/course/${courseId}`),

  enroll: (studentId: string, courseId: string) =>
    api.post("/enrollments", { studentId, courseId }),

  unenroll: (studentId: string, courseId: string) =>
    api.delete("/enrollments", { data: { studentId, courseId } }),

  updateGrade: (id: string, grade: string) =>
    api.patch(`/enrollments/${id}/grade`, { grade }),
};
