import type { GuideRoutine } from "@/types/routine";
import RoutinePreviewCard from "./RoutinePreviewCard";

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
        <RoutinePreviewCard
          key={routine.routineId}
          routineId={routine.routineId}
          name={routine.name}
          authorLabel={routine.author?.name?.trim()}
          skinTypeTags={routine.skinTypeTags}
          previewImageUrls={routine.previewImageUrls}
          estimatedTotalPrice={routine.estimatedTotalPrice}
        />
      ))}
    </div>
  );
}
