import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { departmentsApi, type Department } from "../api/departments";
import { coursesApi, type Course } from "../api/courses";
import {
  statsApi,
  type RecentEnrollment,
  type DepartmentCounts,
} from "../api/stats";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    departments: 0,
    teachers: 0,
    students: 0,
    courses: 0,
    enrollments: 0,
  });
  const [recentDepartments, setRecentDepartments] = useState<Department[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([]);
  const [byDepartment, setByDepartment] = useState<DepartmentCounts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, deptRes, courseRes] = await Promise.all([
        statsApi.get(),
        departmentsApi.list(1, 5),
        coursesApi.list(1, 5),
      ]);

      const { counts, recentEnrollments, byDepartment: deptBreakdown } = statsRes.data;

      setStats({
        departments: counts.departments,
        teachers: counts.teachers,
        students: counts.students,
        courses: counts.courses,
        enrollments: counts.enrollments,
      });
      setRecentDepartments(deptRes.data.departments);
      setRecentCourses(courseRes.data.courses);
      setRecentEnrollments(recentEnrollments);
      setByDepartment(deptBreakdown || []);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const maxStudents = Math.max(...byDepartment.map((d) => d.students), 1);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard title="Departments" value={stats.departments} icon={<Building2 className="w-6 h-6" />} color="bg-blue-500" />
            <StatsCard title="Teachers" value={stats.teachers} icon={<Users className="w-6 h-6" />} color="bg-green-500" />
            <StatsCard title="Students" value={stats.students} icon={<GraduationCap className="w-6 h-6" />} color="bg-purple-500" />
            <StatsCard title="Courses" value={stats.courses} icon={<BookOpen className="w-6 h-6" />} color="bg-amber-500" />
            <StatsCard title="Enrollments" value={stats.enrollments} icon={<UserCheck className="w-6 h-6" />} color="bg-teal-500" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Departments */}
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

          {/* Recent Courses */}
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

        {/* Students by Department */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Students by Department
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {byDepartment.map((dept) => (
              <div key={dept.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  <span className="text-sm text-gray-500">
                    {dept.students} students &middot; {dept.courses} courses
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.round((dept.students / maxStudents) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {byDepartment.length === 0 && (
              <div className="py-2 text-center text-gray-500">No department data yet</div>
            )}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-500" />
              Recent Enrollments
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{enrollment.student?.user?.name}</p>
                  <p className="text-sm text-gray-500">{enrollment.student?.user?.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {enrollment.course?.code} &middot; {enrollment.course?.name}
                </div>
              </div>
            ))}
            {recentEnrollments.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">No enrollments yet</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}