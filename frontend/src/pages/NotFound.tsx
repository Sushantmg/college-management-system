import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 px-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl mb-6 shadow-lg shadow-indigo-900/40 ring-1 ring-white/20">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">404</h1>
        <p className="text-slate-300 mt-3 text-lg">This page could not be found.</p>
        <Link
          to="/login"
          className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-900/40 hover:brightness-110 transition"
        >
          Go to Sign in
        </Link>
      </div>
    </div>
  );
}