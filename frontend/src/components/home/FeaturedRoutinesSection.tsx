import { getPublicFeaturedRoutines } from "@/lib/routines";
import FeaturedRoutinesClient, {
  type FeaturedRoutineCard,
} from "./FeaturedRoutinesClient";

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
      estimatedTotalPrice: f.estimatedTotalPrice ?? 0,
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
