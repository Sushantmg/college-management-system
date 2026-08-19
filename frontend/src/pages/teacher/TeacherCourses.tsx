import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { coursesApi, type Course } from "../../api/courses";
import { BookOpen } from "lucide-react";

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi.list(1, 100).then(res => setCourses(res.data.courses)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">{courses.length} courses assigned</p>
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
          ) : courses.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              No courses assigned
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{course.code}</span>
                  <span className="text-xs text-gray-500">{course._count?.students || 0} students</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.department?.name}</p>
                {course.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
