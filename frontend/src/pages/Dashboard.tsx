import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import { Building2, Users, GraduationCap, BookOpen, TrendingUp, Award } from "lucide-react";
import { departmentsApi, type Department } from "../api/departments";
import { coursesApi, type Course } from "../api/courses";
import { studentsApi } from "../api/students";
import { teachersApi } from "../api/teachers";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ departments: 0, teachers: 0, students: 0, courses: 0 });
  const [recentDepartments, setRecentDepartments] = useState<Department[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [deptRes, teacherRes, studentRes, courseRes] = await Promise.all([
        departmentsApi.list(1, 5),
        teachersApi.list(1, 1),
        studentsApi.list(1, 1),
        coursesApi.list(1, 5),
      ]);
      setStats({
        departments: deptRes.data.pagination.total,
        teachers: teacherRes.data.pagination.total,
        students: studentRes.data.pagination.total,
        courses: courseRes.data.pagination.total,
      });
      setRecentDepartments(deptRes.data.departments);
      setRecentCourses(courseRes.data.courses);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of the college system</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-6 bg-gray-200 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Departments" value={stats.departments} icon={<Building2 className="w-6 h-6" />} color="bg-blue-500" />
            <StatsCard title="Teachers" value={stats.teachers} icon={<Users className="w-6 h-6" />} color="bg-green-500" />
            <StatsCard title="Students" value={stats.students} icon={<GraduationCap className="w-6 h-6" />} color="bg-purple-500" />
            <StatsCard title="Courses" value={stats.courses} icon={<BookOpen className="w-6 h-6" />} color="bg-amber-500" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Departments
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentDepartments.map((dept) => (
                <div key={dept.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-500">
                      {dept._count?.teachers || 0} teachers &middot; {dept._count?.students || 0} students
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {dept._count?.courses || 0} courses
                  </div>
                </div>
              ))}
              {recentDepartments.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">No departments yet</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Recent Courses
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentCourses.map((course) => (
                <div key={course.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.code} &middot; {course.department?.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.teacher?.user?.name || "Unassigned"}
                  </div>
                </div>
              ))}
              {recentCourses.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">No courses yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
