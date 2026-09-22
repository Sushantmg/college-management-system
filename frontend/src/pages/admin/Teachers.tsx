import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import { teachersApi, type Teacher } from "../../api/teachers";
import { departmentsApi, type Department } from "../../api/departments";
import { useToast } from "../../context/ToastContext";
import { getApiErrorMessage } from "../../utils/error";
import { Pencil, Trash2, Search, Users } from "lucide-react";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ departmentId: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Teacher | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadTeachers();
    departmentsApi.listAll().then(res => setDepartments(res.data)).catch(() => {});
  }, [pagination.page]);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await teachersApi.list(pagination.page, 10, search || undefined);
      setTeachers(res.data.teachers);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    loadTeachers();
  };

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher);
    setForm({ departmentId: teacher.departmentId || "" });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await teachersApi.update(editing.id, { departmentId: form.departmentId || undefined });
      setModalOpen(false);
      toast.success("Teacher updated");
      loadTeachers();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update"));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await teachersApi.delete(deleting.id);
      toast.success("Teacher deleted");
      loadTeachers();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete"));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Teachers</h1>
          <p className="text-slate-500 mt-1">{pagination.total} total teachers</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teachers..."
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
          ) : teachers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              No teachers found
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
                    <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                            {teacher.user?.name?.charAt(0)}
                          </div>
                          {teacher.user?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{teacher.user?.email}</td>
                      <td className="px-6 py-4 text-sm">
                        {teacher.department ? (
                          <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">{teacher.department.name}</span>
                        ) : (
                          <span className="text-sm text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{teacher._count?.courses || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(teacher)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleting(teacher)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Teacher Department">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ departmentId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition"
            >
              <option value="">No Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 transition disabled:opacity-50">
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Teacher">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete <span className="font-medium text-slate-900">{deleting?.user?.name}</span>?
          Their assigned courses will be unassigned.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDeleting(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:brightness-110 transition">Delete</button>
        </div>
      </Modal>
    </Layout>
  );
}