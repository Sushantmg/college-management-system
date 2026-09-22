import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Eye, EyeOff, Building2, BookOpen, ShieldCheck } from "lucide-react";
import { getApiErrorMessage } from "../utils/error";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register({ name, email, password });
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "TEACHER") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 ring-1 ring-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CollegeMS</h1>
            <p className="text-sm text-slate-400">Management Portal</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Your campus,
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              organized.
            </span>
          </h2>
          <p className="mt-4 text-slate-300 max-w-sm">
            Join your college community and keep track of courses, grades and more.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, text: "Role-based dashboards for admin, teacher & student" },
              { icon: Building2, text: "Manage departments, teachers, students & courses" },
              { icon: BookOpen, text: "Enrollments and grade tracking in real time" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-white/10 ring-1 ring-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-indigo-300" />
                </span>
                <span className="text-sm text-slate-200">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} CollegeMS &middot; Built for education</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 lg:hidden">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
            <p className="text-slate-500 mt-1">Join the College Management System</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8">
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create account</h1>
              <p className="text-slate-500 mt-1">Join the College Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-sm px-4 py-3 rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 outline-none transition pr-10"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Min 8 characters with at least one letter and one number. New accounts are created as students.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:brightness-110 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}