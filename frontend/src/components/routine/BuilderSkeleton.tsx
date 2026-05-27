import ProceduralWave from "@/components/themes/ProceduralWave";
import { Skeleton } from "@/components/ui/skeleton";

const SLOT_LABELS = [
  "Cleanser",
  "Toner",
  "Essence",
  "Serum",
  "Moisturizer",
  "Sunscreen",
];

export default function BuilderSkeleton() {
  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8]">
      <ProceduralWave seed={3} height={190} />
      <div className="relative z-1 mx-auto max-w-6xl px-6 pt-20 pb-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-11 w-full max-w-md rounded-md" />
        </div>

        <div className="mb-2 hidden grid-cols-12 gap-4 border-b border-zinc-200 px-2 pb-2 md:grid">
          {["Category", "Product", "Merchant", "Price"].map((label, i) => (
            <Skeleton
              key={label}
              className={i === 1 ? "col-span-7 h-4 w-28" : "col-span-2 h-4 w-20"}
            />
          ))}
        </div>

        <div className="space-y-4 md:space-y-0">
          {SLOT_LABELS.map((label) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-12 md:items-center md:rounded-none md:border-0 md:border-b md:border-zinc-200 md:bg-transparent md:px-2 md:py-5 md:shadow-none"
            >
              <div className="md:col-span-2">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="md:col-span-7">
                <div className="flex h-14 items-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 px-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="hidden md:col-span-2 md:flex md:justify-start">
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
              <div className="hidden md:col-span-1 md:block md:text-right">
                <Skeleton className="ml-auto h-6 w-12" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white px-6 py-4 shadow-sm">
          <div className="mb-4">
            <Skeleton className="mb-3 h-3 w-28" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
