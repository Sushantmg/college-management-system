import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { studentsApi, type Student } from "../../api/students";
import { GraduationCap } from "lucide-react";

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsApi.list(1, 100).then(res => setStudents(res.data.students)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-slate-500 mt-1">{students.length} total students</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              No students found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                            {student.user?.name?.charAt(0)}
                          </div>
                          {student.user?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.user?.email}</td>
                      <td className="px-6 py-4 text-sm">
                        {student.department ? (
                          <span className="inline-block px-2.5 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">{student.department.name}</span>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student._count?.courses || 0}</td>
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