import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import { studentsApi, type Student } from "../../api/students";
import { enrollmentsApi, type Enrollment } from "../../api/enrollments";
import { GraduationCap, Award } from "lucide-react";

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeModal, setGradeModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>("");
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => {
    studentsApi.list(1, 100).then(res => setStudents(res.data.students)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const openGrade = (enrollmentId: string) => {
    setSelectedEnrollment(enrollmentId);
    setGradeValue("");
    setGradeModal(true);
  };

  const handleGrade = async () => {
    if (!selectedEnrollment || !gradeValue) return;
    try {
      await enrollmentsApi.updateGrade(selectedEnrollment, gradeValue);
      setGradeModal(false);
      studentsApi.list(1, 100).then(res => setStudents(res.data.students));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update grade");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">{students.length} total students</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <GraduationCap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              No students found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Department</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.user?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.user?.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.department?.name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student._count?.courses || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={gradeModal} onClose={() => setGradeModal(false)} title="Update Grade">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade</label>
            <select value={gradeValue} onChange={(e) => setGradeValue(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Select grade</option>
              {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setGradeModal(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleGrade} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Update</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
