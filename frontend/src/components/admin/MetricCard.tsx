import { ReactNode } from "react";

export function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-900">{value}</div>
    </div>
  );
}
