import api from "./client";

export interface Teacher {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; role: string };
  departmentId?: string;
  department?: { id: string; name: string };
  courses?: TeacherCourse[];
  _count?: { courses: number };
  createdAt: string;
  updatedAt: string;
}

export interface TeacherEnrollment {
  id: string;
  grade?: string;
  student: { id: string; user: { id: string; name: string; email: string } };
}

export interface TeacherCourse {
  id: string;
  name: string;
  code: string;
  description?: string;
  department?: { id: string; name: string };
  students?: TeacherEnrollment[];
  _count?: { students: number };
}

export interface TeacherProfile extends Teacher {
  courses: TeacherCourse[];
  stats: {
    courses: number;
    students: number;
  };
}

export interface PaginatedResponse {
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const teachersApi = {
  list: (page = 1, limit = 20, search?: string) =>
    api.get<{ teachers: Teacher[] } & PaginatedResponse>("/teachers", {
      params: { page, limit, search },
    }),

  // Profile + courses for the currently authenticated teacher.
  getMe: () => api.get<TeacherProfile>("/teachers/me"),

  get: (id: string) => api.get<Teacher>(`/teachers/${id}`),

  create: (data: { userId: string; departmentId?: string }) =>
    api.post("/teachers", data),

  update: (id: string, data: { departmentId?: string }) =>
    api.put(`/teachers/${id}`, data),

  delete: (id: string) => api.delete(`/teachers/${id}`),
};
