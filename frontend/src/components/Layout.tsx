import { ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  UserCog,
  LogOut,
  Menu,
  X,
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

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = user?.role === "ADMIN" ? adminLinks :
               user?.role === "TEACHER" ? teacherLinks :
               studentLinks;

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700",
    TEACHER: "bg-blue-100 text-blue-700",
    STUDENT: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">CollegeMS</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user?.role || ""]}`}>
                  {user?.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
