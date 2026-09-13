import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-gray-500 mt-3 text-lg">This page could not be found.</p>
        <Link
          to="/login"
          className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Go to Sign in
        </Link>
      </div>
    </div>
  );
}