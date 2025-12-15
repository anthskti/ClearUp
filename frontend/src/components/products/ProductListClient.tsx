"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Minus, Plus, SlidersHorizontal, Search } from "lucide-react";
import { CATEGORY_CONFIG, CategoryKey } from "@/constants/filters"; // The config from above
import ProceduralWave from "@/components/themes/ProceduralWave";
import { Product } from "@/types/product";
import { ProductCategory } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

// Move to types later
interface ColumnConfig {
  id: string;
  labels: string;
  width: string;
}

interface ProductListClientProps {
  category: string;
  initialProducts: Product[];
}

function AddToRoutineButton({
  product,
  category,
}: {
  product: Product;
  category: string;
}) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToRoutine = () => {
    setIsAdding(true);
    
    // Store product in localStorage for builder page to pick up
    const addToRoutineData = {
      product,
      category: category as ProductCategory,
      timestamp: Date.now(),
    };
    
    // Store in localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "pending-routine-add",
          JSON.stringify(addToRoutineData)
        );
        
        // Dispatch a custom event in case builder page is already open
        window.dispatchEvent(
          new CustomEvent("addToRoutine", {
            detail: addToRoutineData,
          })
        );
        
        // Redirect to builder page
        router.push("/builder");
      } catch (error) {
        console.error("Failed to add product to routine:", error);
        alert("Failed to add product to routine. Please try again.");
        setIsAdding(false);
      }
    }
  };

  return (
    <button
      onClick={handleAddToRoutine}
      disabled={isAdding}
      className="bg-zinc-900 text-white text-xs font-bold px-2 py-1.5 rounded hover:bg-blue-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? "Adding..." : "Add"}
    </button>
  );
}

export default function ProductListClient({
  category,
  initialProducts,
}: ProductListClientProps) {
  const products = initialProducts;

  // Client-side Hooks are safe here
  const categorySlug = category;
  const config =
    CATEGORY_CONFIG[categorySlug as CategoryKey] || CATEGORY_CONFIG.default;

  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    brand: true,
  });

  const toggleFilter = (id: string) => {
    setOpenFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCellContent = (col: ColumnConfig, product: Product) => {
    const labelIndexMap: Record<string, number> = {
      // Cleansers & Moisturizers (labels[0] is usually texture)
      texture: 0,

      // Essences
      effect: 0,

      // Toners
      benefits: 0,

      // Serums (You called the ID 'ac' or 'activeIngredient')
      ac: 0,

      // Sunscreens (You have 3 dynamic columns here!)
      spf: 0, // First item in labels[] is SPF
      finish: 1, // Third item is Finish; need to change moisturizer
      filter: 2, // Second item is Filter
    };

    if (col.id in labelIndexMap) {
      const index = labelIndexMap[col.id];
      // Safety check: ensure labels exist and the index is valid
      const value = product.labels?.[index] || "—";

      return (
        <span className="text-[12px] text-zinc-700 capitalize">{value}</span>
      );
    }

    switch (col.id) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={10}
              height={10}
              className="h-11 w-11 bg-gray-200 rounded-md shrink-0"
              unoptimized={true}
            />
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                {product.brand}
              </div>
              <div className="font-bold text-zinc-900 text-sm">
                <Link href={`/product/id/${product.id}`}>{product.name}</Link>
              </div>
            </div>
          </div>
        );
      case "country":
        return (
          <div className="flex items-center justify-between h-10 w-10 bg-gray-200 rounded-md shrink-0" />
        );
      case "price":
        return (
          <span className="font-bold text-zinc-900 block">
            ${product.price.toFixed(2)}
          </span>
        );
      case "add":
        return (
          <AddToRoutineButton product={product} category={category} />
        );
      case "rating":
        return (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < product.averageRating
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
        );
      // Default: Just render the default
      default:
        const val = product[col.id as keyof Product];
        return (
          <span className="text-[12px] text-zinc-900">
            {Array.isArray(val) ? val.join(", ") : val}
          </span>
        );
    }
  };
  return (
    <div className="relative min-h-screen bg-[#F8F8F8] pt-24">
      <ProceduralWave seed={6} offset={2} frequency={1.5} />
      <div className="relative z-1 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
        <aside className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-zinc-900 mb-6">
              {config.category}
            </h1>
            <div className="relative mb-8">
              <Search
                className="absolute left-3 top-3 text-zinc-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-md text-sm outline-none focus:border-[#0e4a84]"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-200 w-full mb-6" />

          {/* Global Filters, aka Brands, Price */}
          <div className="border-b border-zinc-200 pb-4">
            <button
              onClick={() => toggleFilter("brand")}
              className="w-full flex justify-between items-center group"
            >
              <h3 className="font-bold text-sm uppercase text-zinc-500 tracking-wider group-hover:text-zinc-800 transition-colors">
                Brand
              </h3>
              {/* Show Minus if Open, Plus if Closed */}
              {openFilters["brand"] ? (
                <Minus size={16} className="text-zinc-400" />
              ) : (
                <Plus size={16} className="text-zinc-400" />
              )}
            </button>

            {/* Collapse; Leave Auto Opened */}
            {openFilters["brand"] && (
              <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer hover:text-[#0e4a84]">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 text-[#0e4a84] focus:ring-[#0e4a84]"
                  />
                  SKIN1004
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer hover:text-blue-600">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  Round Lab
                </label>
              </div>
            )}
          </div>

          {/* 2. Dynamic Filters  */}
          {config.specificFilters.map((filter) => {
            const isOpen = openFilters[filter.id];

            return (
              <div key={filter.id} className="border-b border-zinc-200 pb-4">
                <button
                  onClick={() => toggleFilter(filter.id)}
                  className="w-full flex justify-between items-center group"
                >
                  <h3 className="font-bold text-sm uppercase text-zinc-500 tracking-wider group-hover:text-zinc-800 transition-colors">
                    {filter.labels}
                  </h3>
                  {isOpen ? (
                    <Minus size={16} className="text-zinc-400" />
                  ) : (
                    <Plus size={16} className="text-zinc-400" />
                  )}
                </button>

                {/* Collapsible; leave auto closed at startup*/}
                {isOpen && (
                  <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {filter.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer hover:text-blue-600"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* --- RIGHT CONTENT (LIST) --- */}
        <main className="lg:col-span-10">
          {/* List Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-zinc-500 font-medium">
              Showing {products.length} Results
            </span>
            <div className="flex gap-2">
              {/* Sort button, NOT IMPLMENTED FOR DEMO */}
              <button className="text-sm font-bold text-zinc-700 flex items-center gap-2 bg-white px-4 py-2 border border-zinc-200 rounded hover:bg-zinc-50">
                <SlidersHorizontal size={14} /> Sort: Popular
              </button>
            </div>
          </div>

          {/* The Product Table / List Headers */}
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm mb-10">
            {/* Dynamic Header */}
            <div className="grid grid-cols-12 bg-zinc-50 text-xs font-bold uppercase text-zinc-500 border-b border-zinc-200 py-3 px-4">
              {config.tableColumns.map((col) => (
                <div key={col.id} className={`${col.width} px-1`}>
                  {col.labels}
                </div>
              ))}
            </div>

            {/* Product Rows */}
            <div className="divide-y divide-zinc-100">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-12 items-center p-4 hover:bg-blue-50/30 transition-colors group"
                >
                  {/* COLUMN LOOP: This handles EVERY cell, including Name, Price, and Buttons */}
                  {config.tableColumns.map((col) => (
                    <div
                      key={`${product.id}-${col.id}`}
                      className={`${col.width} px-1`}
                    >
                      {renderCellContent(col, product)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
