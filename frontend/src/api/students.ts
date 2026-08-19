import api from "./client";

export interface Student {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string; role: string };
  departmentId?: string;
  department?: { id: string; name: string };
  courses?: any[];
  _count?: { courses: number };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const studentsApi = {
  list: (page = 1, limit = 20, search?: string) =>
    api.get<{ students: Student[] } & PaginatedResponse<Student>>("/students", {
      params: { page, limit, search },
    }),

  get: (id: string) => api.get<Student>(`/students/${id}`),

  create: (data: { userId: string; departmentId: string }) =>
    api.post("/students", data),

  update: (id: string, data: { departmentId?: string }) =>
    api.put(`/students/${id}`, data),

  delete: (id: string) => api.delete(`/students/${id}`),
};
