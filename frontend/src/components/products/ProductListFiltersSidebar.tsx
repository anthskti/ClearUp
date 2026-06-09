"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  CATEGORY_CONFIG,
  ALL_PRODUCTS_CONFIG,
  CategoryKey,
  type FilterOption,
} from "@/constants/filters";
import { PRODUCT_PRICE_SLIDER_MAX } from "@/constants/productFilters";
import type { CatalogScope } from "@/hooks/useProductCatalog";
import { ROUTINE_SKIN_TYPE_OPTIONS } from "@/lib/routineSkinTypeTags";
import {
  skinTypeLabel,
  toggleAttributeFilter,
  toggleBrandFilter,
  toggleSkinTypeFilter,
} from "@/lib/productListFilters";
import type { ProductListFilters } from "@/types/product";
import PriceRangeFilter from "@/components/filters/PriceRangeFilter";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-zinc-200 pb-4">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center justify-between"
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 transition-colors group-hover:text-zinc-800">
          {title}
        </h3>
        {isOpen ? (
          <Minus size={16} className="text-zinc-400" />
        ) : (
          <Plus size={16} className="text-zinc-400" />
        )}
      </button>
      {isOpen && (
        <div className="mt-4 animate-in space-y-3 duration-200 slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CheckboxOption({ label, checked, onChange }: CheckboxOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 hover:text-[#0e4a84]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-zinc-300 text-[#0e4a84] focus:ring-[#0e4a84]"
      />
      <span className="capitalize">{label}</span>
    </label>
  );
}

interface ProductListFiltersSidebarProps {
  scope: CatalogScope;
  filters: ProductListFilters;
  onFiltersChange: (filters: ProductListFilters) => void;
  draftPriceRange: [number, number];
  onDraftPriceChange: (range: [number, number]) => void;
  onApplyPrice: () => void;
  hasPriceDraftChanges: boolean;
  onClearAll: () => void;
  availableBrands: string[];
  isFiltered: boolean;
}

export default function ProductListFiltersSidebar({
  scope,
  filters,
  onFiltersChange,
  draftPriceRange,
  onDraftPriceChange,
  onApplyPrice,
  hasPriceDraftChanges,
  onClearAll,
  availableBrands,
  isFiltered,
}: ProductListFiltersSidebarProps) {
  const config =
    scope.type === "all"
      ? ALL_PRODUCTS_CONFIG
      : (CATEGORY_CONFIG[scope.slug as CategoryKey] ?? CATEGORY_CONFIG.default);

  // const [openSections, setOpenSections] = useState<Record<string, boolean>>({
  //   skinType: true,
  //   brand: false,
  //   price: false,
  // });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderAttributeSection = (filter: FilterOption) => {
    const selected = filters.attributes[filter.id] ?? [];
    return (
      <FilterSection
        key={filter.id}
        id={filter.id}
        title={filter.labels}
        isOpen={openSections[filter.id] ?? true}
        onToggle={() => toggleSection(filter.id)}
      >
        {filter.options.map((opt) => {
          const value = opt.trim();
          return (
            <CheckboxOption
              key={`${filter.id}-${value}`}
              label={value}
              checked={selected.includes(value)}
              onChange={() =>
                onFiltersChange(
                  toggleAttributeFilter(filters, filter.id, value),
                )
              }
            />
          );
        })}
      </FilterSection>
    );
  };

  return (
    <aside className="space-y-6 lg:col-span-2">
      <div>
        <h1 className="mb-6 text-3xl font-extrabold uppercase text-zinc-900">
          {config.category}
        </h1>
        {isFiltered && (
          <button
            type="button"
            onClick={onClearAll}
            className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#0e4a84] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="mb-6 h-px w-full bg-zinc-200" />

      <FilterSection
        id="skinType"
        title="Skin type"
        isOpen={openSections.skinType ?? true}
        onToggle={() => toggleSection("skinType")}
      >
        {ROUTINE_SKIN_TYPE_OPTIONS.map((skinType) => (
          <CheckboxOption
            key={skinType}
            label={skinTypeLabel(skinType)}
            checked={filters.skinTypes.includes(skinType)}
            onChange={() =>
              onFiltersChange(toggleSkinTypeFilter(filters, skinType))
            }
          />
        ))}
      </FilterSection>

      {availableBrands.length > 0 && (
        <FilterSection
          id="brand"
          title="Brand"
          isOpen={openSections.brand ?? true}
          onToggle={() => toggleSection("brand")}
        >
          {availableBrands.map((brand) => (
            <CheckboxOption
              key={brand}
              label={brand}
              checked={filters.brands.includes(brand)}
              onChange={() =>
                onFiltersChange(toggleBrandFilter(filters, brand))
              }
            />
          ))}
        </FilterSection>
      )}

      <FilterSection
        id="price"
        title="Price"
        isOpen={openSections.price ?? true}
        onToggle={() => toggleSection("price")}
      >
        <PriceRangeFilter
          idPrefix="product-price"
          title="Catalog price (CAD)"
          value={draftPriceRange}
          onChange={onDraftPriceChange}
          sliderMax={PRODUCT_PRICE_SLIDER_MAX}
          step={1}
          size="compact"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3 w-full"
          onClick={onApplyPrice}
          disabled={!hasPriceDraftChanges}
        >
          Apply
        </Button>
      </FilterSection>

      {config.specificFilters.map(renderAttributeSection)}
    </aside>
  );
}
