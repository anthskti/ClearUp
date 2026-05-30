"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Search, Star } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { CountryMapping } from "../../constants/CountryMapping";

import {
  ColumnConfig,
  CATEGORY_CONFIG,
  CategoryKey,
} from "@/constants/filters"; // The config from above
import ProceduralWave from "@/components/themes/ProceduralWave";
import { Product } from "@/types/product";
import AddToRoutineButton from "@/components/routine/AddToRoutineButton";
import { SkinTypeTags } from "./SkinTypeTags";
import {
  getProductsByCategory,
  searchProductsByCategory,
} from "@/lib/products";

interface ProductListClientProps {
  category: string;
  initialProducts: Product[];
}

// Safety checks for products to NOT brick the system
function isValidProduct(p: Product): boolean {
  return Number.isFinite(p?.id) && p.id > 0 && Boolean(p?.name?.trim());
}

function getProductThumbUrl(product: Product): string | null {
  const url = product.imageUrls?.[0]?.trim();
  return url ? url : null;
}

export default function ProductListClient({
  category,
  initialProducts,
}: ProductListClientProps) {
  const safeInitial = (initialProducts ?? []).filter(isValidProduct);
  const [products, setProducts] = useState<Product[]>(safeInitial);
  const [offset, setOffset] = useState(safeInitial.length);
  const [hasMore, setHasMore] = useState(safeInitial.length === 20);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Starts loading when 400px from the bottom.
    skip: products.length === 0 && !isLoading,
  });

  useEffect(() => {
    const next = (initialProducts ?? []).filter(isValidProduct);
    setProducts(next);
    setOffset(next.length);
    setHasMore(next.length === 20);
    setSearchQuery("");
    setInputValue("");
    setIsSearching(false);
  }, [category, initialProducts]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setOffset(0);
    setProducts([]);
    setIsSearching(query.length > 0);

    if (query.trim().length === 0) {
      // Reset to initial products if search is cleared
      const next = (initialProducts ?? []).filter(isValidProduct);
      setProducts(next);
      setOffset(next.length);
      setHasMore(next.length === 20);
      setIsSearching(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = (
        await searchProductsByCategory(category, query, 20, 0)
      ).filter(isValidProduct);
      setProducts(results);
      setOffset(results.length);
      setHasMore(results.length === 20);
    } catch (error) {
      console.error("Search failed:", error);
      setProducts([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(inputValue);
    }
  };

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const newProducts = isSearching
        ? await searchProductsByCategory(category, searchQuery, 20, offset)
        : await getProductsByCategory(category, 20, offset);

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          const merged = [...prev];
          for (const p of newProducts.filter(isValidProduct)) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
          return merged;
        });
        setOffset((prev) => prev + newProducts.length);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading]);
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

  type CellVariant = "desktop" | "mobile";

  const renderCellContent = (
    col: ColumnConfig,
    product: Product,
    variant: CellVariant = "desktop",
  ) => {
    const labelIndexMap: Record<string, number> = {
      texture: 0, // Cleansers & Moisturizers
      benefits: 0, // Toners
      effect: 0, // Essences
      ac: 0, // Serums
      spf: 0, // Sunscreens
      concentration: 1, // Serums
      finish: 1, // Sunscreens & Moisturizer
      filter: 2, // Sunscreens
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
      case "name": {
        const thumb = getProductThumbUrl(product);
        return (
          <div className="flex items-center gap-3">
            {thumb ? (
              <Image
                src={thumb}
                alt={product.name}
                width={44}
                height={44}
                className="h-11 w-11 bg-gray-200 rounded-md shrink-0 object-cover"
              />
            ) : (
              <div
                className="h-11 w-11 shrink-0 rounded-md border border-zinc-200 bg-zinc-100"
                aria-hidden
              />
            )}
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
      }
      case "country": {
        if (variant === "mobile") {
          return (
            <span className="text-[12px] text-zinc-700">
              {product.country?.trim() || "—"}
            </span>
          );
        }
        const flagUrl = CountryMapping[product.country]?.trim();
        const flagBox =
          "relative box-border flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white";
        return flagUrl ? (
          <div className="flex justify-center">
            <div className={flagBox} title={product.country}>
              {/* Local SVG flags vary in aspect ratio; fixed square + object-contain */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flagUrl}
                alt={product.country}
                className="h-full w-full object-cover p-1"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center" aria-hidden>
            <div className="h-10 w-10 shrink-0 rounded-md border border-zinc-200 bg-zinc-100" />
          </div>
        );
      }
      case "price":
        return (
          <span className="font-bold text-zinc-900 block">
            ${product.price.toFixed(2)}
          </span>
        );
      case "add":
        return (
          <AddToRoutineButton
            product={product}
            category={category}
            compact={true}
            size="sm"
          />
        );
      case "rating": {
        return (
          <div
            className={`flex items-center gap-0.5 text-xs text-yellow-600 ${variant === "mobile" ? "justify-start" : "justify-center"}`}
          >
            <Star size={14} className="shrink-0 text-yellow-600" />
            <span>{product.averageRating ?? "—"}</span>
          </div>
        );
      }
      // Default: Just render the default
      default:
        const val = product[col.id as keyof Product];

        // Render skin types with tooltip tags only for the skinType column.
        if (Array.isArray(val)) {
          if (val.length === 0)
            return <span className="text-[12px] text-zinc-400">—</span>;

          if (col.id === "skinType") {
            return <SkinTypeTags skinTypes={val.map(String)} />;
          }

          const firstItem = val[0];
          const remainingCount = val.length - 1;

          return (
            <div className="flex items-center gap-1.5">
              {/* First Tag */}
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-md border border-zinc-200 whitespace-nowrap">
                {firstItem}
              </span>

              {/* +N Badge */}
              {remainingCount > 0 && (
                <div
                  className="px-1.5 py-0.5 bg-zinc-50 text-zinc-500 text-[10px] font-bold rounded-md border border-zinc-200 cursor-help hover:bg-zinc-200 hover:text-zinc-700 transition-colors"
                  title={val.slice(1).join(", ")}
                >
                  +{remainingCount}
                </div>
              )}
            </div>
          );
        }

        // If it's just a normal string or number
        return (
          <span className="text-[12px] text-zinc-900">
            {val as React.ReactNode}
          </span>
        );
    }
  };
  const mobileAttrColumns = config.tableColumns.filter(
    (col) => col.id !== "name" && col.id !== "add" && col.id !== "price",
  );
  const priceColumn = config.tableColumns.find((col) => col.id === "price");
  const nameColumn = config.tableColumns.find((col) => col.id === "name");
  const addColumn = config.tableColumns.find((col) => col.id === "add");

  const emptyState = (
    <div className="p-12 text-center text-sm text-zinc-500">
      <p className="font-medium text-zinc-700">No products yet</p>
      <p className="mt-1">
        {isSearching
          ? "No matches for your search in this category."
          : "No products here :/ Admin needs to do their job."}
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#F8F8F8] pt-24">
      <ProceduralWave seed={6} offset={2} frequency={1.5} />
      <div className="relative z-1 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
        {/* --- LEFT SIDEBAR (FILTERS) --- */}
        <aside className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold uppercase text-zinc-900 mb-6">
              {config.category}
            </h1>
            {/* Showing # Results */}
            <div className="flex flex-cols justify-between items-center mb-6">
              <span></span>
              <div className="flex gap-2 text-sm text-zinc-500 font-medium">
                Showing {products.length} Results
              </div>
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
                    {filter.options.map((opt, optIndex) => (
                      <label
                        key={`${filter.id}-${optIndex}-${opt}`}
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

          {/* Sort button, NOT IMPLMENTED FOR DEMO */}
          {/* <div className="flex justify-end items-center mb-6">
            <button className="text-sm font-bold text-zinc-700 flex items-center gap-2 bg-white px-4 py-2 border border-zinc-200 rounded hover:bg-zinc-50">
              <SlidersHorizontal size={14} /> Sort: Popular
            </button>
          </div> */}
          {/* Search Bar */}
          <div className="relative mb-8 w-full lg:ml-auto lg:w-[40%]">
            <Search className="absolute left-3 top-3 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-md text-sm outline-none focus:border-[#0e4a84]"
            />
          </div>

          {/* Mobile: card list */}
          <div className="mb-10 space-y-3 lg:hidden">
            {products.length === 0 && !isLoading ? (
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                {emptyState}
              </div>
            ) : (
              products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {nameColumn &&
                        renderCellContent(nameColumn, product, "mobile")}
                    </div>
                    <div className="shrink-0">
                      {addColumn &&
                        renderCellContent(addColumn, product, "mobile")}
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4 border-t border-zinc-100 pt-4">
                    {mobileAttrColumns.map((col) => (
                      <div
                        key={`${product.id}-mobile-${col.id}`}
                        className="min-w-0"
                      >
                        <dt className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                          {col.labels || col.id}
                        </dt>
                        <dd className="mt-0.5 text-left [&>*]:justify-start">
                          {renderCellContent(col, product, "mobile")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {priceColumn && (
                    <div className="mt-4 border-t border-zinc-100 pt-3">
                      {renderCellContent(priceColumn, product, "mobile")}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          {/* Desktop: table */}
          <div className="mb-10 hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:block">
            <div className="grid grid-cols-12 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold uppercase text-zinc-500">
              {config.tableColumns.map((col) => (
                <div key={col.id} className={`${col.width} px-1`}>
                  {col.labels}
                </div>
              ))}
            </div>

            <div className="divide-y divide-zinc-100">
              {products.length === 0 && !isLoading
                ? emptyState
                : products.map((product) => (
                    <div
                      key={product.id}
                      className="group grid grid-cols-12 items-center p-5 transition-colors hover:bg-blue-50/30"
                    >
                      {config.tableColumns.map((col) => (
                        <div
                          key={`${product.id}-${col.id}`}
                          className={`${col.width} px-1`}
                        >
                          {renderCellContent(col, product, "desktop")}
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          </div>

          <div ref={ref} className="flex w-full justify-center p-4 lg:p-8">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
                Loading more products...
              </div>
            )}
            {!hasMore && products.length > 0 && (
              <p className="text-sm italic text-zinc-400">
                You've reached the end of the shelf.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
