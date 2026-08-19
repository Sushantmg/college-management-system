import api from "./client";

export interface Teacher {
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

export const teachersApi = {
  list: (page = 1, limit = 20, search?: string) =>
    api.get<{ teachers: Teacher[] } & PaginatedResponse<Teacher>>("/teachers", {
      params: { page, limit, search },
    }),

  get: (id: string) => api.get<Teacher>(`/teachers/${id}`),

  create: (data: { userId: string; departmentId?: string }) =>
    api.post("/teachers", data),

  update: (id: string, data: { departmentId?: string }) =>
    api.put(`/teachers/${id}`, data),

  delete: (id: string) => api.delete(`/teachers/${id}`),
};
