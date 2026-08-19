import api from "./client";

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  departmentId: string;
  department?: { id: string; name: string };
  teacherId?: string;
  teacher?: { id: string; user: { name: string; email: string } };
  students?: any[];
  _count?: { students: number };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const coursesApi = {
  list: (page = 1, limit = 20, search?: string) =>
    api.get<{ courses: Course[] } & PaginatedResponse<Course>>("/courses", {
      params: { page, limit, search },
    }),

  get: (id: string) => api.get<Course>(`/courses/${id}`),

  create: (data: { name: string; code: string; description?: string; departmentId: string; teacherId?: string }) =>
    api.post("/courses", data),

  update: (id: string, data: Partial<{ name: string; code: string; description: string; departmentId: string; teacherId: string }>) =>
    api.put(`/courses/${id}`, data),

  delete: (id: string) => api.delete(`/courses/${id}`),
};
