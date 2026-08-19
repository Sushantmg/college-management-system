import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import StatsCard from "../../components/StatsCard";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";
import { coursesApi, type Course } from "../../api/courses";
import { enrollmentsApi, type Enrollment } from "../../api/enrollments";
import { studentsApi, type Student } from "../../api/students";
import { BookOpen, Users, Award, Plus, X } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollModal, setEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [gradeModal, setGradeModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string>("");
  const [gradeValue, setGradeValue] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [courseRes, studentRes] = await Promise.all([
        coursesApi.list(1, 100),
        studentsApi.list(1, 100),
      ]);
      setCourses(courseRes.data.courses);
      setStudents(studentRes.data.students);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEnroll = async () => {
    if (!selectedCourse || !selectedStudent) return;
    try {
      await enrollmentsApi.enroll(selectedStudent, selectedCourse);
      setEnrollModal(false);
      setSelectedCourse("");
      setSelectedStudent("");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to enroll");
    }
  };

  const handleGrade = async () => {
    if (!selectedEnrollment || !gradeValue) return;
    try {
      await enrollmentsApi.updateGrade(selectedEnrollment, gradeValue);
      setGradeModal(false);
      setSelectedEnrollment("");
      setGradeValue("");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update grade");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="My Courses" value={courses.length} icon={<BookOpen className="w-6 h-6" />} color="bg-blue-500" />
          <StatsCard title="Total Students" value={students.length} icon={<Users className="w-6 h-6" />} color="bg-green-500" />
        </div>

        <div className="flex justify-end">
          <button onClick={() => setEnrollModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4" />
            Enroll Student
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No courses assigned</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {courses.map((course) => (
                <div key={course.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.code} &middot; {course.department?.name}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {course._count?.students || 0} students
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={enrollModal} onClose={() => setEnrollModal(false)} title="Enroll Student in Course">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Select a course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Student</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Select a student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.user?.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEnrollModal(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleEnroll} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Enroll</button>
          </div>
        </div>
      </Modal>

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
