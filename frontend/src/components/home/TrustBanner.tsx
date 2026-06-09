import ProceduralWave from "../themes/ProceduralWave";

export const TrustBanner = () => {
  return (
    <div>
      <ProceduralWave className="top-0 w-full" flip={false} seed={2} />
      <div className="bg-linear-to-b from-[#e8f6ff] to-[#79afd9] w-full border-zinc-100 pt-8 pb-20">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 transition-all duration-500">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-black  text-shadow-xs">
              Product Intel
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-950 mt-1">
              200+ Products
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white" />

          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-black text-shadow-xs">
              Smart Filtering
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-950 mt-1">
              By Skin Concern
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white" />

          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-black text-shadow-xs">
              Custom Routines
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-950 mt-1">
              Built for You
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBanner;
