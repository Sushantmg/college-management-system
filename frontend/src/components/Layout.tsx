import type { ReactNode } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  UserCog,
  LogOut,
  Menu,
  UserCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/departments", label: "Departments", icon: Building2 },
  { to: "/admin/teachers", label: "Teachers", icon: Users },
  { to: "/admin/students", label: "Students", icon: GraduationCap },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/users", label: "Users", icon: UserCog },
];

const teacherLinks = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/courses", label: "My Courses", icon: BookOpen },
  { to: "/teacher/students", label: "Students", icon: GraduationCap },
];

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/courses", label: "My Courses", icon: BookOpen },
];

const roleColors: Record<string, string> = {
  ADMIN: "bg-rose-500/20 text-rose-200 ring-1 ring-inset ring-rose-400/30",
  TEACHER: "bg-sky-500/20 text-sky-200 ring-1 ring-inset ring-sky-400/30",
  STUDENT: "bg-emerald-500/20 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
};

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = user?.role === "ADMIN" ? adminLinks :
               user?.role === "TEACHER" ? teacherLinks :
               studentLinks;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">CollegeMS</h1>
              <p className="text-xs text-slate-400">Management Portal</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}`} />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-5 mt-5 border-t border-white/10">
              <Link
                to="/profile"
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === "/profile"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <UserCircle className={`w-5 h-5 ${location.pathname === "/profile" ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}`} />
                Profile
              </Link>
            </div>
          </nav>

          {/* User footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-sm font-semibold text-white ring-2 ring-white/20 shrink-0">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <span className={`inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded-full font-medium ${roleColors[user?.role || ""] || "bg-white/10 text-slate-300"}`}>
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-4 py-3.5 bg-white border-b border-slate-200 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1" />
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}