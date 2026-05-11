import { AdminDashboardStats } from "@/types/routine-admin";

type Props = {
  series: AdminDashboardStats["series"];
};

export function AdminTrendChart({ series }: Props) {
  // Empty State
  if (!series.length) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
        No trend data for this period.
      </p>
    );
  }

  // Calculate the maximum value for the chart
  const maxVal = Math.max(1, ...series.flatMap((s) => [s.users, s.routines]));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-medium text-zinc-900">
        New Users + Guides (Daily)
      </h2>
      {/* Chart */}
      <div className="flex h-40 items-end gap-1 overflow-x-auto pb-2">
        {series.map((row) => {
          const uh = Math.round((row.users / maxVal) * 100);
          const rh = Math.round((row.routines / maxVal) * 100);
          const label = row.date.slice(5, 10);
          return (
            <div
              key={row.date}
              className="flex min-w-[18px] flex-1 flex-col items-center gap-1"
              title={`${row.date}: ${row.users} users, ${row.routines} guides`}
            >
              <div className="flex h-32 w-full items-end justify-center gap-0.5">
                <div
                  className="w-1/2 max-w-[8px] rounded-t bg-violet-400/90"
                  style={{ height: `${Math.max(4, uh)}%` }}
                />
                <div
                  className="w-1/2 max-w-[8px] rounded-t bg-emerald-500/90"
                  style={{ height: `${Math.max(4, rh)}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-violet-400" /> Users
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Guides
        </span>
      </div>
    </div>
  );
}
