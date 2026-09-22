export default function StatsCard({
  title,
  value,
  icon,
  color = "from-indigo-500 to-violet-500",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}