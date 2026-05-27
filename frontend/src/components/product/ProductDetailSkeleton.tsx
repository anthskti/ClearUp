import ProceduralWave from "@/components/themes/ProceduralWave";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8] pt-20">
      <ProceduralWave seed={20} height={140} offset={1} />
      <main className="relative z-1 mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:col-span-7">
          <div className="mb-6 space-y-3">
            <Skeleton className="h-10 w-52" />
            <Skeleton className="h-7 w-80" />
            <Skeleton className="h-4 w-36" />
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-lg border border-zinc-100 bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>

          <div className="mb-10 space-y-6">
            <div className="border-b border-zinc-200 pb-2">
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <Skeleton className="mb-3 h-3 w-20" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          <div className="mt-auto">
            <div className="mb-4 border-b border-zinc-200 pb-2">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="overflow-hidden rounded-lg bg-white">
              <div className="grid grid-cols-4 gap-4 border-b border-zinc-200 px-4 py-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-16" />
                ))}
              </div>
              <div className="divide-y divide-zinc-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-14 justify-self-end" />
                    <Skeleton className="h-8 w-12 justify-self-end rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
