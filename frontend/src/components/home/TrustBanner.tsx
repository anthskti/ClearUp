export const TrustBanner = () => {
  return (
    <div className="w-full bg-white border-y border-zinc-100 py-8">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 transition-all duration-500">
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-stone-950">
            Product Intel
          </div>
          <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">
            200+ Products
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-zinc-200"></div>

        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-stone-950">
            Smart Filtering
          </div>
          <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">
            By Skin Concern
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-zinc-200"></div>

        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-stone-950">
            Custom Routines
          </div>
          <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">
            Built for You
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBanner;
