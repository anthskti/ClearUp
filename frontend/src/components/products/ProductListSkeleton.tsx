import ProceduralWave from "@/components/themes/ProceduralWave";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#F8F8F8] pt-24">
      <ProceduralWave seed={6} offset={2} frequency={1.5} />
      <div className="relative z-1 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12">
        <aside className="hidden lg:col-span-2 lg:block">
          <Skeleton className="mb-4 h-6 w-28" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-5 rounded-xl border border-zinc-200 bg-white p-4">
              <Skeleton className="h-4 w-20" />
              <div className="mt-4 space-y-3">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <main className="lg:col-span-10">
          <div className="mb-8 flex justify-end">
            <Skeleton className="h-11 w-full max-w-sm rounded-lg" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[2.3fr_1fr_1fr_1fr_1fr_0.9fr] gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 md:grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>

            <div className="divide-y divide-zinc-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-[2.3fr_1fr_1fr_1fr_1fr_0.9fr] md:items-center md:px-6"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-10 justify-self-start rounded-md md:justify-self-center" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
