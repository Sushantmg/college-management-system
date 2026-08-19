import api from "./client";

export interface Department {
  id: string;
  name: string;
  headId?: string;
  head?: { id: string; user: { name: string; email: string } };
  teachers?: any[];
  courses?: any[];
  students?: any[];
  _count?: { teachers: number; students: number; courses: number };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const departmentsApi = {
  list: (page = 1, limit = 20, search?: string) =>
    api.get<{ departments: Department[] } & PaginatedResponse<Department>>("/departments", {
      params: { page, limit, search },
    }),

  listAll: () => api.get<Department[]>("/departments/all"),

  get: (id: string) => api.get<Department>(`/departments/${id}`),

  create: (data: { name: string; headId?: string }) =>
    api.post("/departments", data),

  update: (id: string, data: { name?: string; headId?: string }) =>
    api.put(`/departments/${id}`, data),

  delete: (id: string) => api.delete(`/departments/${id}`),
};
