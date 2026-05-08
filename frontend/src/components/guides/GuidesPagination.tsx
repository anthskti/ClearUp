import Link from "next/link";

function buildGuidesHref(page: number, tags: string, maxPrice: string): string {
  const params = new URLSearchParams();
  if (tags.trim()) {
    params.set("tags", tags.trim());
  }
  if (maxPrice.trim()) {
    params.set("maxPrice", maxPrice.trim());
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const qs = params.toString();
  return qs ? `/guides?${qs}` : "/guides";
}

export default function GuidesPagination({
  page,
  hasNext,
  tags,
  maxPrice,
}: {
  page: number;
  hasNext: boolean;
  tags: string;
  maxPrice: string;
}) {
  const prevHref = buildGuidesHref(page - 1, tags, maxPrice);
  const nextHref = buildGuidesHref(page + 1, tags, maxPrice);
  const linkClass =
    "rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50";

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
      aria-label="Guides pagination"
    >
      {page > 1 ? (
        <Link href={prevHref} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-zinc-300">
          Previous
        </span>
      )}
      <span className="text-sm text-zinc-500">Page {page}</span>
      {hasNext ? (
        <Link href={nextHref} className={linkClass}>
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-zinc-300">
          Next
        </span>
      )}
    </nav>
  );
}
