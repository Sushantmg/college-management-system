import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = "bg-indigo-500" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
