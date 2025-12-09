import ProceduralWave from "../themes/ProceduralWave";
const HowItWorks = () => {
  return (
    <section>
      <ProceduralWave className="top-0 w-full" flip={false} seed={2} />
      <div className="bg-[#e8f6ff] w-full pt-5 pb-15 px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center max-w-7xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-white text-[#0F4A82] rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="font-bold text-lg mb-2">Pick Products</h3>
            <p className="text-zinc-800 text-sm px-4">
              Filter over 10,000 products by price, skin type, ingredients, and
              concern.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-white text-[#0F4A82] rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="font-bold text-lg mb-2">Build Your Routine</h3>
            <p className="text-zinc-800 text-sm px-4">
              Add each products to your AM/PM slots and notes to how you use
              each product. See the price and where to buy whenever you need a
              refill.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-white text-[#0F4A82] rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="font-bold text-lg mb-2">Improve Your Skin</h3>
            <p className="text-zinc-800 text-sm px-4">
              Watch as your skin improves with your new routine. Discover whats
              right for you along the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
