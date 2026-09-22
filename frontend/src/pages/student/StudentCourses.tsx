import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { authApi, type StudentEnrollment } from "../../api/auth";
import { BookOpen } from "lucide-react";

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getMe().then(res => {
      setEnrollments(res.data.student?.courses || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const gradeColors: Record<string, string> = {
    "A+": "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
    "A": "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
    "A-": "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
    "B+": "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
    "B": "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
    "B-": "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
    "C+": "bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-100",
    "C": "bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-100",
    "C-": "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-100",
    "D+": "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-100",
    "D": "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100",
    "F": "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">{enrollments.length} enrolled courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            ))
          ) : enrollments.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              No courses enrolled yet
            </div>
          ) : (
            enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in-up">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-amber-100">
                    {enrollment.course.code}
                  </span>
                  {enrollment.grade ? (
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${gradeColors[enrollment.grade] || "bg-slate-100 text-slate-700"}`}>
                      {enrollment.grade}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">No grade</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{enrollment.course.name}</h3>
                <p className="text-sm text-slate-500 mb-2">{enrollment.course.department?.name}</p>
                {enrollment.course.teacher && (
                  <p className="text-sm text-slate-600">
                    Instructor: <span className="font-medium text-indigo-600">{enrollment.course.teacher.user.name}</span>
                  </p>
                )}
                {enrollment.course.description && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{enrollment.course.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}