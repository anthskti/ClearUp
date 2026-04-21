export const TrustBanner = () => {
  return (
    <div className="w-full bg-white border-y border-zinc-100 py-8">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-semibold text-stone-950 uppercase tracking-wider mb-6">
          Powering routines with
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 transition-all duration-500">
          {/* Replace these with actual brand logos or features later */}
          <div className="text-xl font-bold text-stone-950">10+ Products</div>
          <div className="hidden md:block w-px h-8 bg-zinc-200"></div>
          <div className="text-xl font-bold text-stone-950">
            Smart Category Mapping
          </div>
          <div className="hidden md:block w-px h-8 bg-zinc-200"></div>
          <div className="text-xl font-bold text-stone-950">
            Custom Routines
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBanner;
