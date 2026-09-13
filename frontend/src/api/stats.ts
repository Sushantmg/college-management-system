import api from "./client";

export interface DepartmentCounts {
  id: string;
  name: string;
  teachers: number;
  students: number;
  courses: number;
}

export interface RecentEnrollment {
  id: string;
  createdAt: string;
  student: { id: string; user: { name: string; email: string } };
  course: { name: string; code: string };
}

export interface StatsResponse {
  counts: {
    departments: number;
    teachers: number;
    students: number;
    courses: number;
    enrollments: number;
  };
  usersByRole: Record<string, number>;
  byDepartment: DepartmentCounts[];
  recentEnrollments: RecentEnrollment[];
}

export const statsApi = {
  get: () => api.get<StatsResponse>("/stats"),
};