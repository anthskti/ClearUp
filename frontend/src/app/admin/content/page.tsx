// List of all guides, and a toggle/interface to select
// which guides are "Featured" for the landing page.
import { ContentGuidesClient } from "@/components/admin/ContentGuidesClient";
import {
  getAllRoutinesServer,
  getFeaturedRoutinesServer,
} from "@/lib/admin-server";

const FEATURED_CAP = 20;

export default async function AdminContentPage() {
  let routines;
  let featured;
  try {
    [routines, featured] = await Promise.all([
      getAllRoutinesServer(200, 0),
      getFeaturedRoutinesServer(),
    ]);
  } catch (e: unknown) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900">
        {e instanceof Error ? e.message : "Could not load guides."}
      </div>
    );
  }

  const initialFeaturedIds = featured.map((f) => f.routineId);
  const featuredKey = initialFeaturedIds.slice().sort((a, b) => a - b).join(",");

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Manage which guides appear as <strong className="text-zinc-800">featured</strong>{" "}
        on the public landing page (max {FEATURED_CAP}).
      </p>
      <ContentGuidesClient
        key={featuredKey}
        routines={routines}
        initialFeaturedIds={initialFeaturedIds}
        featuredLimit={FEATURED_CAP}
      />
    </div>
  );
}
