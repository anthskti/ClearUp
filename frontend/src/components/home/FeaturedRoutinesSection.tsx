import { getPublicFeaturedRoutines } from "@/lib/routines";
import FeaturedRoutinesClient, {
  type FeaturedRoutineCard,
} from "./FeaturedRoutinesClient";

// function blurbFromDescription(description?: string): string | undefined {
//   if (!description?.trim()) return undefined;
//   try {
//     const p = JSON.parse(description) as {
//       morning?: unknown[];
//       evening?: unknown[];
//     };
//     const m = Array.isArray(p.morning) ? p.morning.length : 0;
//     const e = Array.isArray(p.evening) ? p.evening.length : 0;
//     const total = m + e;
//     if (total > 0) {
//       return `Includes ${total} personalized note${total === 1 ? "" : "s"} (morning & evening).`;
//     }
//   } catch {
//     // plain text
//     const t = description.trim();
//     return t.length > 140 ? `${t.slice(0, 140)}…` : t;
//   }
//   return undefined;
// }

export default async function FeaturedRoutinesSection() {
  let cards: FeaturedRoutineCard[] = [];
  try {
    const featured = await getPublicFeaturedRoutines();
    cards = featured.map((f) => ({
      routineId: f.routineId,
      name: f.name,
      authorLabel: f.author?.name?.trim() || "",
      skinTypeTags: f.skinTypeTags ?? [],
      previewImageUrls: f.previewImageUrls ?? [],
      // blurb: blurbFromDescription(f.description),
    }));
  } catch {
    cards = [];
  }

  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 text-center md:text-left md:pr-24">
          <h2 className="text-2xl font-bold text-zinc-900">
            Featured community routines
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Hand-picked guides from the community. Swipe or use arrows to see
            more.
          </p>
        </div>
        <FeaturedRoutinesClient items={cards} />
      </div>
    </section>
  );
}
