import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import StatsCard from "../../components/StatsCard";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";
import { BookOpen, Award, Calendar } from "lucide-react";

interface StudentProfile {
  id: string;
  department?: { name: string };
  courses: {
    id: string;
    grade?: string;
    course: {
      name: string;
      code: string;
      teacher?: { user: { name: string } };
    };
  }[];
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getMe().then(res => {
      setProfile(res.data as any);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const enrolledCourses = profile?.courses || [];
  const gradedCourses = enrolledCourses.filter(c => c.grade);

  const averageGrade = (() => {
    if (gradedCourses.length === 0) return "N/A";
    const gradePoints: Record<string, number> = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "F": 0.0,
    };
    const sum = gradedCourses.reduce((acc, c) => acc + (gradePoints[c.grade || "F"] || 0), 0);
    const avg = sum / gradedCourses.length;
    return avg.toFixed(2);
  })();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Enrolled Courses" value={enrolledCourses.length} icon={<BookOpen className="w-6 h-6" />} color="bg-blue-500" />
          <StatsCard title="Graded Courses" value={gradedCourses.length} icon={<Award className="w-6 h-6" />} color="bg-green-500" />
          <StatsCard title="GPA" value={averageGrade} icon={<Calendar className="w-6 h-6" />} color="bg-purple-500" />
        </div>

        {profile?.department && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-lg font-semibold text-gray-900">{profile.department.name}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : enrolledCourses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No courses enrolled yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Course</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Code</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Teacher</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrolledCourses.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{enrollment.course.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{enrollment.course.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{enrollment.course.teacher?.user?.name || "TBA"}</td>
                      <td className="px-6 py-4">
                        {enrollment.grade ? (
                          <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            {enrollment.grade}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
