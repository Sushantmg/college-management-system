import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import { enrollmentsApi, type Enrollment } from "../../api/enrollments";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/error";
import { Search, UserCheck, Star } from "lucide-react";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];

const gradePill: Record<string, string> = {
  "A+": "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
  A: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
  "A-": "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
  "B+": "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
  B: "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
  "B-": "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
  "C+": "bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-100",
  C: "bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-100",
  "C-": "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-100",
  "D+": "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-100",
  D: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100",
  F: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100",
};

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Enrollment | null>(null);
  const [removingPending, setRemovingPending] = useState(false);
  const toast = useToast();

  useEffect(() => { loadEnrollments(); }, [pagination.page]);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const res = await enrollmentsApi.list(pagination.page, 20, search || undefined);
      setEnrollments(res.data.enrollments);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    loadEnrollments();
  };

  const handleGradeChange = async (enrollment: Enrollment, grade: string) => {
    setUpdating(enrollment.id);
    try {
      const res = await enrollmentsApi.updateGrade(enrollment.id, grade);
      if (res.data.enrollment) {
        setEnrollments(prev =>
          prev.map(enr =>
            enr.id === enrollment.id ? { ...enr, grade: res.data.enrollment.grade } : enr
          )
        );
      }
      toast.success(grade ? `Grade set to ${grade}` : "Grade removed");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update grade"));
      loadEnrollments();
    } finally {
      setUpdating(null);
    }
  };

  const handleUnenroll = async () => {
    if (!removing) return;
    setRemovingPending(true);
    try {
      await enrollmentsApi.unenroll(removing.studentId, removing.courseId);
      toast.success("Student unenrolled");
      setRemoving(null);
      loadEnrollments();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to unenroll"));
    } finally {
      setRemovingPending(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Enrollments</h1>
          <p className="text-slate-500 mt-1">{pagination.total} total enrollments</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student or course..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition shadow-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 shadow-sm transition">
            Search
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <UserCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              No enrollments found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Teacher</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Grade</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Enrolled</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                            {enrollment.student?.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{enrollment.student?.user?.name}</p>
                            <p className="text-sm text-slate-500">{enrollment.student?.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{enrollment.course?.name}</p>
                        <span className="inline-block mt-0.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{enrollment.course?.code}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{enrollment.course?.teacher?.user?.name || "Unassigned"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <select
                            value={enrollment.grade || ""}
                            disabled={updating === enrollment.id}
                            onChange={(e) => handleGradeChange(enrollment, e.target.value)}
                            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border border-transparent outline-none transition focus:ring-2 focus:ring-indigo-500/60 disabled:opacity-50 ${enrollment.grade && gradePill[enrollment.grade] ? gradePill[enrollment.grade] : "bg-slate-100 text-slate-500"}`}
                          >
                            <option value="">Not graded</option>
                            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setRemoving(enrollment)}
                          className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                        >
                          Unenroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200">
              <span className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</span>
              <div className="flex gap-2">
                <button disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition">Previous</button>
                <button disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!removing} onClose={() => setRemoving(null)} title="Unenroll Student">
        <p className="text-sm text-slate-600">
          Remove <span className="font-medium text-slate-900">{removing?.student?.user?.name}</span> from
          <span className="font-medium text-slate-900"> "{removing?.course?.name}"</span>? Any assigned grade will be lost.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setRemoving(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition">Cancel</button>
          <button onClick={handleUnenroll} disabled={removingPending} className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:brightness-110 transition disabled:opacity-50">
            {removingPending ? "Removing..." : "Unenroll"}
          </button>
        </div>
      </Modal>
    </Layout>
  );
}