import api from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StudentEnrollment {
  id: string;
  grade?: string | null;
  course: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    department?: { id: string; name: string };
    teacher?: { user: { id: string; name: string } };
  };
}

export interface MeResponse extends User {
  student?: {
    department?: { id: string; name: string };
    courses: StudentEnrollment[];
  };
  teacher?: {
    department?: { id: string; name: string };
    courses: { id: string; name: string; code: string }[];
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>("/auth/login", { email, password }),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<{ token: string; user: User }>("/auth/register", data),

  getMe: () => api.get<MeResponse>("/auth/me"),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { oldPassword, newPassword }),

  listUsers: (page = 1, limit = 20, search?: string) =>
    api.get<{ users: User[] } & PaginatedResponse>("/auth/users", {
      params: { page, limit, search },
    }),

  updateUser: (id: string, data: Partial<User>) =>
    api.put(`/auth/users/${id}`, data),

  deleteUser: (id: string) =>
    api.delete(`/auth/users/${id}`),
};
