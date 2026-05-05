"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  featureRoutine,
  unfeatureRoutine,
} from "@/lib/routines";
import type { RoutineWithProducts } from "@/types/routine";

type Props = {
  routines: RoutineWithProducts[];
  initialFeaturedIds: number[];
  featuredLimit: number;
};

export function ContentGuidesClient({
  routines,
  initialFeaturedIds,
  featuredLimit,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [featuredIds, setFeaturedIds] = useState<Set<number>>(
    () => new Set(initialFeaturedIds),
  );
  const [error, setError] = useState<string | null>(null);

  const featuredCount = featuredIds.size;

  const rows = useMemo(
    () =>
      [...routines].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [routines],
  );

  const toggle = (routineId: number, next: boolean) => {
    setError(null);
    startTransition(async () => {
      try {
        if (next) {
          if (featuredCount >= featuredLimit) {
            setError(`Featured limit is ${featuredLimit} guides.`);
            return;
          }
          await featureRoutine(routineId);
          setFeaturedIds((prev) => new Set(prev).add(routineId));
        } else {
          await unfeatureRoutine(routineId);
          setFeaturedIds((prev) => {
            const n = new Set(prev);
            n.delete(routineId);
            return n;
          });
        }
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Update failed");
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <p className="text-sm text-zinc-500">
        Featured on the landing page:{" "}
        <span className="font-medium text-zinc-900">
          {featuredCount} / {featuredLimit}
        </span>
      </p>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3">Guide</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3 text-right">Featured</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isFeatured = featuredIds.has(r.id);
              const author = r.author;
              return (
                <tr
                  key={r.id}
                  className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/80"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {r.name}
                  </td>
                  <td className="px-4 py-3">
                    {author ? (
                      <div>
                        <div className="font-medium text-zinc-900">
                          {author.name}
                        </div>
                        <div className="text-xs text-zinc-500">{author.email}</div>
                      </div>
                    ) : (
                      <span
                        className="text-zinc-500"
                        title={String(r.userId ?? "")}
                      >
                        Unknown user
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => toggle(r.id, !isFeatured)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        isFeatured
                          ? "bg-zinc-900 text-white hover:bg-zinc-800"
                          : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {isFeatured ? "Featured" : "Feature"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
