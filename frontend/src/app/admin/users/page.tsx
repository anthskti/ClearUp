// Top users list, and eventually, moderation tools (ban, suspend, email).
import Link from "next/link";
import { getAdminDashboardStatsServer, getAdminUsersServer } from "@/lib/admin-server";

const PAGE_SIZE = 25;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  let stats;
  let userPayload;
  try {
    [stats, userPayload] = await Promise.all([
      getAdminDashboardStatsServer(14),
      getAdminUsersServer({ limit: PAGE_SIZE, offset }),
    ]);
  } catch (e: unknown) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900">
        {e instanceof Error ? e.message : "Could not load users."}
      </div>
    );
  }

  const { topAuthors } = stats;
  const { users, total } = userPayload;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-10">
      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Top contributors
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Highlighted from analytics — same signal as the dashboard.
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
              {topAuthors.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">All users</h2>
            <p className="text-xs text-zinc-500">
              {total} registered · page {page} of {totalPages}
            </p>
          </div>
          <div className="flex gap-2">
            <PaginationLink
              disabled={page <= 1}
              href={`/admin/users?page=${page - 1}`}
              label="Previous"
            />
            <PaginationLink
              disabled={page >= totalPages}
              href={`/admin/users?page=${page + 1}`}
              label="Next"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Verified</th>
                <th className="px-6 py-3 text-right">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/80"
                >
                  <td className="px-6 py-3 font-medium text-zinc-900">
                    {u.name}
                  </td>
                  <td className="px-6 py-3 text-zinc-600">{u.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-zinc-600">
                    {u.emailVerified ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-3 text-right text-xs text-zinc-500">
                    {u.createdAt.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PaginationLink({
  href,
  label,
  disabled,
}: {
  href: string;
  label: string;
  disabled: boolean;
}) {
  if (disabled) {
    return (
      <span className="rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-400">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
    >
      {label}
    </Link>
  );
}
