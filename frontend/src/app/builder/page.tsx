import Link from "next/link";
import React from "react";
import { Copy, Plus, ExternalLink, X, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import WaveBackground from "@/components/themes/wavebackground";

const mockRoutine = [
  { id: "cleanser", label: "Cleanser", product: null },
  {
    id: "toner",
    label: "Toner",
    product: {
      name: "Madagascar Centella Toning Toner Water Liquid Gel Liquid",
      brand: "SKIN1004",
      price: 18.0,
      image: "https://placehold.co/100", // Replace with real image
      merchant: "Stylevana",
      merchantLogo: "SV",
    },
  },
  { id: "essence", label: "Essence", product: null },
  {
    id: "serum",
    label: "Serum",
    product: {
      name: "Glow Deep Serum",
      brand: "Beauty of Joseon",
      price: 14.5,
      image: "https://placehold.co/100",
      merchant: "Amazon",
      merchantLogo: "AMZN",
    },
  },
  { id: "moisturizer", label: "Moisturizer", product: null },
  { id: "sunscreen", label: "Sunscreen", product: null },
];

const Builder: React.FC = () => {
  const totalPrice = mockRoutine.reduce(
    (acc, step) => acc + (step.product?.price || 0),
    0
  );
  const totalItems = mockRoutine.filter((step) => step.product).length;

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8] pt-20 pb-20">
      <WaveBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2E2E2E] uppercase">
            Build Your Routine.
          </h1>

          {/* External Link */}
          <div className="flex items-center bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm max-w-md w-full md:w-auto">
            <div className="bg-zinc-50 px-3 py-2 border-r border-zinc-200 text-zinc-400">
              <ExternalLink size={16} />
            </div>
            <input
              readOnly
              value="https://clearup.ca/TestUser1/2"
              className="px-3 py-2 text-sm text-zinc-600 outline-none w-full md:w-64 bg-transparent"
            />
            <button className="px-4 py-2 hover:bg-zinc-50 border-l border-zinc-200 transition-colors">
              <Copy size={16} className="text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-zinc-500 font-bold uppercase text-xs border-b border-zinc-200 px-2 pb-2 mb-2">
          <div className="col-span-2">Category</div>
          <div className="col-span-7">Product Selection</div>
          <div className="col-span-2">Merchant</div>
          <div className="col-span-1 text-right">Price</div>
        </div>

        {/* Builder */}
        <div className="space-y-4 md:space-y-0">
          {mockRoutine.map((step) => (
            <div
              key={step.id}
              className={`
              group bg-white rounded-xl border border-zinc-200 shadow-sm p-4 grid grid-cols-1 gap-4 items-center transition-all hover:bg-zinc-50/50
              md:bg-transparent md:rounded-none md:border-0 md:border-b md:border-zinc-200 md:shadow-none md:px-2 md:py-5 md:grid-cols-12 
              `}
            >
              {/* Category Label */}
              <div className="col-span-1 md:col-span-2 flex justify-between md:block">
                <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
                  {step.label}
                </span>
                {/* Mobile Price Display */}
                {step.product && (
                  <span className="md:hidden font-bold text-zinc-900">
                    ${step.product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Selection Area */}
              <div className="col-span-1 md:col-span-7">
                {step.product ? (
                  // FILLED STATE
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-100 rounded-md border border-zinc-200 shrink-0 overflow-hidden">
                      {/* ADD IMAGE HERE */}
                      <div className="w-full h-full bg-zinc-200" />
                    </div>

                    <div className="grow min-w-0">
                      <div className="text-xs font-bold text-zinc-400 uppercase mb-0.5">
                        {step.product.brand}
                      </div>
                      <Link
                        href={`/product/${step.product.name}`}
                        className="font-medium text-black leading-tight hover:underline hover:text-blue-800 block transition-all duration-100"
                      >
                        {step.product.name}
                      </Link>
                      {/* Mobile Merchant Display */}
                      <div className="md:hidden text-xs text-zinc-500 mt-1 flex items-center gap-1">
                        via {step.product.merchant} <ExternalLink size={10} />
                      </div>
                    </div>
                    {/* Delete Action (Mobile/Desktop) */}
                    <div className="shrink-0">
                      {step.product && (
                        <button
                          className={`
                          top-2 right-2 group-hover:block p-2 text-zinc-300 hover:text-red-500 transition-colors
                          md:relative md:top-auto md:right-auto
                          `}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // EMPTY STATE (Dashed Slot)
                  <Link href={`/browse?category=${step.id}`}>
                    <div className="w-full h-14 md:h-16 border-2 border-dashed border-zinc-300 rounded-lg flex items-center justify-center gap-2 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all cursor-pointer">
                      <Plus size={18} />
                      <span className="font-medium text-sm">
                        Select {step.label}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Merchant Column (Desktop Only) */}
              <div className="hidden md:flex col-span-2 items-center">
                {step.product && (
                  <div className="flex items-center gap-2 p-3 bg-white border border-zinc-200 rounded text-xs font-bold text-zinc-700 shadow-sm">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-700">
                      {step.product.merchantLogo}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Column (Desktop Only) */}
              <div className="hidden md:block col-span-1 text-right">
                {step.product ? (
                  <div className="text-lg font-bold text-zinc-900">
                    ${step.product.price.toFixed(2)}
                  </div>
                ) : (
                  <span className="text-zinc-200 font-medium">---</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`
          bottom-0 left-0 w-full bg-white border border-zinc-200 shadow-md rounded-lg mt-4 z-40 px-6 py-4
          lg:top-20 lg:bottom-auto lg:shadow-sm 
          `}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                Estimated Total
              </div>
              <div className="text-2xl font-extrabold text-black">
                CA ${totalPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex gap-3">
              <span className="hidden sm:flex items-center text-sm font-medium text-zinc-500 mr-2">
                {totalItems} items selected
              </span>
              <Button variant="secondary">Save Routine</Button>
            </div>
          </div>
        </div>

        {/* User instructions card */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Book size={20} /> Users Notes:
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold uppercase text-xs tracking-wider">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Morning
              </div>
              <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                <li className="ml-6">
                  <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                  <h4 className="font-bold text-zinc-900 text-sm">Cleanse</h4>
                  <p className="text-sm text-zinc-500 mt-1">
                    Wash face with warm water. Use cleanser if you have oily
                    skin.
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                  <h4 className="font-bold text-zinc-900 text-sm">
                    Sunscreen (Crucial)
                  </h4>
                  <p className="text-sm text-zinc-500 mt-1">
                    Apply generously as the final step.
                  </p>
                </li>
              </ol>
            </div>
            {/* Night Routine... same structure */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-violet-500 font-bold uppercase text-xs tracking-wider">
                <div className="w-2 h-2 rounded-full bg-violet-500" /> Night
              </div>
              <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                <li className="ml-6">
                  <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                  <h4 className="font-bold text-zinc-900 text-sm">Cleanse</h4>
                  <p className="text-sm text-zinc-500 mt-1">
                    Wash face with warm water. Use cleanser if you have oily
                    skin.
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                  <h4 className="font-bold text-zinc-900 text-sm">
                    Moisturize
                  </h4>
                  <p className="text-sm text-zinc-500 mt-1">
                    Apply generously as the final step.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
