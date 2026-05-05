// Total users/guides stats, New users chart.
// Keep these as separate Server Components that fetch their own data
// so one slow query doesn't block the whole page.
import { Users, Layers3, Star } from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { AdminTrendChart } from "@/components/admin/AdminTrendChart";
import { getAdminDashboardStatsServer } from "@/lib/admin-server";

export default async function AdminDashboardPage() {
  let stats;
  try {
    stats = await getAdminDashboardStatsServer(14);
  } catch (e: unknown) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900">
        {e instanceof Error ? e.message : "Could not load dashboard stats."}
      </div>
    );
  }

  const { totals, series, topAuthors } = stats;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          icon={<Layers3 className="h-4 w-4 text-zinc-500" />}
          label="Total guides"
          value={totals.routines}
        />
        <MetricCard
          icon={<Users className="h-4 w-4 text-zinc-500" />}
          label="Total users"
          value={totals.users}
        />
        <MetricCard
          icon={<Star className="h-4 w-4 text-zinc-500" />}
          label="Featured guides"
          value={totals.featuredRoutines}
        />
      </div>

      <AdminTrendChart series={series} />

      <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Top contributors
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Users with the most guides in the database (admin analytics).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3 text-right">Guides</th>
              </tr>
            </thead>
            <tbody>
              {topAuthors.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-zinc-500"
                  >
                    No data yet.
                  </td>
                </tr>
              ) : (
                topAuthors.map((row) => (
                  <tr
                    key={row.userId}
                    className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/80"
                  >
                    <td className="px-6 py-3 font-medium text-zinc-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-3 text-zinc-600">{row.email}</td>
                    <td className="px-6 py-3 text-right tabular-nums text-zinc-900">
                      {row.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
