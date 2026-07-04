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
    <section className="bg-white pt-4 pb-10 px-4 md:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-zinc-900">
            Featured Skincare Routines
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Hand-picked routines from the community.
          </p>
        </div>
        <FeaturedRoutinesClient items={cards} />
      </div>
    </section>
  );
}
