import Link from "next/link";
import type { GuideRoutine } from "@/lib/routines";
import { skinTypeLabel } from "@/lib/routineSkinTypeTags";

export default function GuidesGrid({ items }: { items: GuideRoutine[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-16 text-center text-sm text-zinc-500">
        No guides match these filters yet. Try clearing a filter or check back
        soon.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((routine) => (
        <article key={routine.routineId}>
          <Link
            href={`/routine/${routine.routineId}`}
            className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:border-zinc-300 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-bold leading-snug text-zinc-900">
                  {routine.name}
                </h3>
                {routine.author?.name?.trim() && (
                  <p className="mt-1 text-xs text-zinc-500">
                    by {routine.author.name.trim()}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                Est. ${routine.estimatedTotalPrice.toFixed(0)}
              </span>
            </div>
            {routine.previewImageUrls.length > 0 && (
              <div className="mb-3 flex gap-1.5">
                {routine.previewImageUrls.slice(0, 4).map((url, i) => (
                  <div
                    key={`${routine.routineId}-${i}-${url.slice(-24)}`}
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50"
                  >
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {routine.skinTypeTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {routine.skinTypeTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700"
                  >
                    {skinTypeLabel(t)}
                  </span>
                ))}
              </div>
            )}
            <span className="mt-auto pt-3 text-sm font-medium text-blue-700">
              Open guide →
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}
