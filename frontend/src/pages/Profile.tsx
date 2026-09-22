import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { getApiErrorMessage } from "../utils/error";
import {
  Mail,
  Shield,
  Calendar,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  UserRound,
} from "lucide-react";

const roleColors: Record<string, string> = {
  ADMIN: "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
  TEACHER: "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200",
  STUDENT: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200",
  STAFF: "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200",
  SUPERUSER: "bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-200",
};

export default function Profile() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("Password must contain at least one letter and one number");
      return;
    }
    if (oldPassword === newPassword) {
      setError("New password must be different from the current one");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setSuccess("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to change password"));
    } finally {
      setSaving(false);
    }
  };

  const infoRows = [
    { icon: UserRound, label: "Name", value: user?.name },
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Shield, label: "Role", value: user?.role, badge: true },
    {
      icon: Calendar,
      label: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
          <p className="text-slate-500 mt-1">View your account details and update your password</p>
        </div>

        {/* Identity banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 rounded-2xl p-6 flex items-center gap-4 shadow-lg shadow-indigo-900/20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg ring-1 ring-white/20">
            {user?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-white truncate">{user?.name}</p>
            <p className="text-sm text-slate-300 truncate">{user?.email}</p>
            <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${roleColors[user?.role || ""] || "bg-white/10 text-slate-200"}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Account Details</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {infoRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm text-slate-500">{row.label}</span>
                    </div>
                    {row.badge ? (
                      <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${roleColors[user?.role || ""] || "bg-slate-100 text-slate-700"}`}>
                        {row.value}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-slate-900 truncate ml-4">{row.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-slate-900">Change Password</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-sm px-4 py-3 rounded-xl border border-rose-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition"
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition pr-10"
                    placeholder="At least 8 chars, 1 letter + 1 number"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:brightness-110 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}