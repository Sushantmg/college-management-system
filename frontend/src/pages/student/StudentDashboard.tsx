import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import StatsCard from "../../components/StatsCard";
import { useAuth } from "../../context/AuthContext";
import { authApi, type StudentEnrollment } from "../../api/auth";
import { BookOpen, Award, GraduationCap } from "lucide-react";

interface StudentProfile {
  id: string;
  department?: { name: string };
  courses: StudentEnrollment[];
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getMe().then(res => {
      const student = res.data.student;
      if (student) {
        setProfile({
          id: res.data.id,
          department: student.department,
          courses: student.courses,
        });
      }
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
          <StatsCard title="Enrolled Courses" value={enrolledCourses.length} icon={<BookOpen className="w-6 h-6" />} color="from-sky-500 to-blue-600" />
          <StatsCard title="Graded Courses" value={gradedCourses.length} icon={<Award className="w-6 h-6" />} color="from-emerald-500 to-teal-600" />
          <StatsCard title="GPA" value={averageGrade} icon={<GraduationCap className="w-6 h-6" />} color="from-fuchsia-500 to-purple-600" />
        </div>

        {profile?.department && (
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 rounded-2xl p-6 shadow-lg shadow-indigo-900/20">
            <p className="text-sm text-slate-400">Department</p>
            <p className="text-lg font-semibold text-white">{profile.department.name}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">My Courses</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : enrolledCourses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No courses enrolled yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Code</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrolledCourses.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{enrollment.course.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{enrollment.course.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{enrollment.course.teacher?.user?.name || "TBA"}</td>
                      <td className="px-6 py-4">
                        {enrollment.grade ? (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-full ring-1 ring-inset ring-emerald-100">
                            {enrollment.grade}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">Pending</span>
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