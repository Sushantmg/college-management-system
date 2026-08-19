import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { authApi } from "../../api/auth";
import { BookOpen, Award } from "lucide-react";

interface Enrollment {
  id: string;
  grade?: string;
  course: {
    name: string;
    code: string;
    description?: string;
    department?: { name: string };
    teacher?: { user: { name: string } };
  };
}

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getMe().then(res => {
      const profile = res.data as any;
      setEnrollments(profile?.student?.courses || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const gradeColors: Record<string, string> = {
    "A+": "bg-green-100 text-green-700",
    "A": "bg-green-100 text-green-700",
    "A-": "bg-green-100 text-green-700",
    "B+": "bg-blue-100 text-blue-700",
    "B": "bg-blue-100 text-blue-700",
    "B-": "bg-blue-100 text-blue-700",
    "C+": "bg-yellow-100 text-yellow-700",
    "C": "bg-yellow-100 text-yellow-700",
    "C-": "bg-orange-100 text-orange-700",
    "D+": "bg-orange-100 text-orange-700",
    "D": "bg-red-100 text-red-700",
    "F": "bg-red-100 text-red-700",
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">{enrollments.length} enrolled courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))
          ) : enrollments.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              No courses enrolled yet
            </div>
          ) : (
            enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {enrollment.course.code}
                  </span>
                  {enrollment.grade ? (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gradeColors[enrollment.grade] || "bg-gray-100 text-gray-700"}`}>
                      {enrollment.grade}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">No grade</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{enrollment.course.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{enrollment.course.department?.name}</p>
                {enrollment.course.teacher && (
                  <p className="text-sm text-gray-600">
                    Instructor: {enrollment.course.teacher.user.name}
                  </p>
                )}
                {enrollment.course.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{enrollment.course.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
