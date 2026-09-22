import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { teachersApi, type TeacherCourse } from "../../api/teachers";
import { BookOpen } from "lucide-react";

export default function TeacherCourses() {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teachersApi.getMe()
      .then(res => setCourses(res.data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">{courses.length} courses assigned</p>
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
          ) : courses.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              No courses assigned
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col animate-fade-in-up">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full ring-1 ring-inset ring-amber-100">{course.code}</span>
                  <span className="text-xs text-slate-500">{course._count?.students || 0} students</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{course.name}</h3>
                <p className="text-sm text-slate-500">{course.department?.name}</p>
                {course.description && (
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{course.description}</p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Enrolled students ({course.students?.length || 0})
                  </p>
                  {course.students && course.students.length > 0 ? (
                    <ul className="space-y-1.5">
                      {course.students.map((enrollment) => (
                        <li key={enrollment.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{enrollment.student?.user?.name}</span>
                          {enrollment.grade ? (
                            <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100 rounded-full">
                              {enrollment.grade}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">No grade</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">No students enrolled yet</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}