import type { Metadata } from "next";
import ProceduralWave from "@/components/themes/ProceduralWave";
import GuidesFilters from "@/components/guides/GuidesFilters";
import GuidesGrid from "@/components/guides/GuidesGrid";
import GuidesPagination from "@/components/guides/GuidesPagination";
import { getPublicGuides } from "@/lib/routines";
import type { GuideRoutine } from "@/lib/routines";
import { parseSkinTypeTagsFromParam } from "@/lib/routineSkinTypeTags";

export const metadata: Metadata = {
  title: "Community guides",
  description:
    "Browse public skincare routines from the ClearUp community. Filter by skin type and budget.",
};

type Props = {
  searchParams: Promise<{ tags?: string; maxPrice?: string; page?: string }>;
};

export default async function GuidesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tagsParam = sp.tags?.trim() ?? "";
  const maxPriceParam = sp.maxPrice?.trim() ?? "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 24;
  const offset = (page - 1) * limit;

  const initialTags = parseSkinTypeTagsFromParam(tagsParam);

  let guides: GuideRoutine[] = [];
  try {
    guides = await getPublicGuides({
      tags: tagsParam,
      maxPrice: maxPriceParam,
      limit,
      offset,
    });
  } catch {}

  const hasNext = guides.length === limit;

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8]">
      <ProceduralWave seed={7} height={160} />
      <div className="relative z-1 mx-auto max-w-6xl px-6 pt-20 pb-20">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold uppercase text-[#2E2E2E] md:text-4xl">
            Community guides
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            Public routines from registered members. Each load is randomized.
            Use filters to narrow by skin type tags or estimated routine total
            (sum of catalog prices).
          </p>
        </header>

        <div className="mb-10">
          <GuidesFilters
            initialTags={initialTags}
            initialMaxPrice={maxPriceParam}
          />
        </div>

        <GuidesGrid items={guides} />

        <GuidesPagination
          page={page}
          hasNext={hasNext}
          tags={tagsParam}
          maxPrice={maxPriceParam}
        />
      </div>
    </div>
  );
}
