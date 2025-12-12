// components/home/TrendingBuilds.tsx
import React from "react";

const ROUTINES = [
  {
    id: 1,
    title: "The Glass Skin Routine",
    author: "@UserGlows",
    price: 37,
    tags: ["Hydration", "Glow"],
    products: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
  },
  {
    id: 2,
    title: "Low Maintenance Prevent Acne",
    author: "@UserSimple",
    price: 30,
    tags: ["Prevent", "Dry Skin"],
    products: ["/img4.jpg", "/img5.jpg", "/img3.jpg", "/img3.jpg"],
  },
  {
    id: 3,
    title: "Pore Minimizing Routine",
    author: "@UserClear",
    price: 44,
    tags: ["Acne", "Oily", "Big Pores"],
    products: ["/img6.jpg", "/img7.jpg", "/img8.jpg", "/img9.jpg"],
  },
];

const TrendingBuilds = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl text-center font-bold text-zinc-900">
            Trending Community Builds
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROUTINES.map((routine) => (
            <div
              key={routine.id}
              className="bg-white border border-zinc-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-zinc-900">{routine.title}</h3>
                  <span className="text-xs text-zinc-500">
                    by {routine.author}
                  </span>
                </div>
                <span className="bg-zinc-100 text-zinc-800 text-xs font-bold px-2 py-1 rounded">
                  ${routine.price}
                </span>
              </div>

              {/* Product Previews (Mock Visuals) */}
              <div className="flex gap-2 mb-4">
                {routine.products.map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-12 bg-zinc-100 rounded-md border border-zinc-50 relative overflow-hidden"
                  >
                    {/* In reality, put <img src={p} /> here */}
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300 text-[8px]">
                      PROD
                    </div>
                  </div>
                ))}
                {routine.products.length > 3 && (
                  <div className="h-12 w-12 flex items-center justify-center text-xs text-zinc-400 bg-zinc-50 rounded-md">
                    +
                  </div>
                )}
              </div>

              {/* Footer Tags */}
              <div className="flex gap-2">
                {routine.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 border border-zinc-200 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingBuilds;
