"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCT_PRICE_SLIDER_MAX } from "@/constants/productFilters";
import type { Product, ProductListFilters } from "@/types/product";
import { fetchProducts, fetchProductsByCategory } from "@/lib/products";
import {
  EMPTY_PRODUCT_LIST_FILTERS,
  hasActiveProductListFilters,
  productListFiltersToSearchParams,
  setProductPriceRange,
} from "@/lib/productListFilters";

const PAGE_SIZE = 20;

export type CatalogScope =
  | { type: "all" }
  | { type: "category"; slug: string };

function catalogBasePath(scope: CatalogScope): string {
  return scope.type === "all"
    ? "/products"
    : `/products/category/${scope.slug}`;
}

function isValidProduct(p: Product): boolean {
  return Number.isFinite(p?.id) && p.id > 0 && Boolean(p?.name?.trim());
}

function priceRangeFromFilters(
  filters: ProductListFilters,
): [number, number] {
  return [filters.minPrice, filters.maxPrice];
}

async function fetchCatalogPage(
  scope: CatalogScope,
  limit: number,
  offset: number,
  options: { search?: string; filters: ProductListFilters },
): Promise<{ products: Product[]; total: number }> {
  if (scope.type === "all") {
    return fetchProducts(limit, offset, options);
  }
  return fetchProductsByCategory(scope.slug, limit, offset, options);
}

export interface UseProductCatalogOptions {
  scope: CatalogScope;
  initialProducts: Product[];
  initialTotal: number;
  initialFilters: ProductListFilters;
  initialSearch?: string;
}

export function useProductCatalog({
  scope,
  initialProducts,
  initialTotal,
  initialFilters,
  initialSearch = "",
}: UseProductCatalogOptions) {
  const router = useRouter();
  const skipInitialFetch = useRef(true);
  const basePath = catalogBasePath(scope);

  const [filters, setFilters] = useState<ProductListFilters>(initialFilters);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>(() =>
    priceRangeFromFilters(initialFilters),
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [products, setProducts] = useState<Product[]>(() =>
    (initialProducts ?? []).filter(isValidProduct),
  );
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [offset, setOffset] = useState(() =>
    (initialProducts ?? []).filter(isValidProduct).length,
  );
  const [hasMore, setHasMore] = useState(
    () => (initialProducts ?? []).filter(isValidProduct).length === PAGE_SIZE,
  );
  const [isLoading, setIsLoading] = useState(false);

  const syncUrl = useCallback(
    (nextFilters: ProductListFilters, search: string) => {
      const qs = productListFiltersToSearchParams(nextFilters, search);
      const suffix = qs.toString();
      router.replace(`${basePath}${suffix ? `?${suffix}` : ""}`, {
        scroll: false,
      });
    },
    [basePath, router],
  );

  const fetchPage = useCallback(
    async (pageOffset: number, append: boolean) => {
      setIsLoading(true);
      try {
        const page = await fetchCatalogPage(scope, PAGE_SIZE, pageOffset, {
          search: searchQuery.trim() || undefined,
          filters,
        });
        const rows = page.products.filter(isValidProduct);

        setTotalCount(page.total);
        setHasMore(pageOffset + rows.length < page.total);
        setOffset(pageOffset + rows.length);

        if (append) {
          setProducts((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            for (const row of rows) {
              if (!seen.has(row.id)) {
                seen.add(row.id);
                merged.push(row);
              }
            }
            return merged;
          });
        } else {
          setProducts(rows);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (!append) {
          setProducts([]);
          setTotalCount(0);
          setHasMore(false);
          setOffset(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [scope, filters, searchQuery],
  );

  const resetAndFetch = useCallback(() => {
    void fetchPage(0, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    void fetchPage(offset, true);
  }, [fetchPage, hasMore, isLoading, offset]);

  const scopeKey = scope.type === "all" ? "all" : scope.slug;

  useEffect(() => {
    skipInitialFetch.current = true;
    const next = (initialProducts ?? []).filter(isValidProduct);
    setFilters(initialFilters);
    setDraftPriceRange(priceRangeFromFilters(initialFilters));
    setSearchQuery(initialSearch);
    setInputValue(initialSearch);
    setProducts(next);
    setTotalCount(initialTotal);
    setOffset(next.length);
    setHasMore(next.length === PAGE_SIZE && next.length < initialTotal);
  }, [scopeKey, initialProducts, initialTotal, initialFilters, initialSearch]);

  useEffect(() => {
    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }
    resetAndFetch();
  }, [filters, searchQuery, resetAndFetch]);

  const updateFilters = useCallback(
    (next: ProductListFilters) => {
      setFilters(next);
      syncUrl(next, searchQuery);
    },
    [searchQuery, syncUrl],
  );

  const applyPriceFilter = useCallback(() => {
    const next = setProductPriceRange(filters, draftPriceRange);
    setFilters(next);
    syncUrl(next, searchQuery);
  }, [draftPriceRange, filters, searchQuery, syncUrl]);

  const commitSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      setSearchQuery(trimmed);
      setInputValue(trimmed);
      syncUrl(filters, trimmed);
    },
    [filters, syncUrl],
  );

  const clearAll = useCallback(() => {
    setFilters(EMPTY_PRODUCT_LIST_FILTERS);
    setDraftPriceRange([0, PRODUCT_PRICE_SLIDER_MAX]);
    setSearchQuery("");
    setInputValue("");
    syncUrl(EMPTY_PRODUCT_LIST_FILTERS, "");
  }, [syncUrl]);

  const isFiltered =
    hasActiveProductListFilters(filters, searchQuery) ||
    searchQuery.trim().length > 0;

  const hasPriceDraftChanges =
    draftPriceRange[0] !== filters.minPrice ||
    draftPriceRange[1] !== filters.maxPrice;

  return {
    products,
    filters,
    updateFilters,
    draftPriceRange,
    setDraftPriceRange,
    applyPriceFilter,
    hasPriceDraftChanges,
    searchQuery,
    inputValue,
    setInputValue,
    commitSearch,
    clearAll,
    isLoading,
    hasMore,
    loadMore,
    isFiltered,
    totalCount,
  };
}
