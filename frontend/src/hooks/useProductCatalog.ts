"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductListFilters } from "@/types/product";
import { fetchProducts, fetchProductsByCategory } from "@/lib/products";
import {
  hasActiveProductListFilters,
  productListFiltersToSearchParams,
} from "@/types/productListFilters";

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

async function fetchCatalogPage(
  scope: CatalogScope,
  limit: number,
  offset: number,
  options: { search?: string; filters: ProductListFilters },
): Promise<Product[]> {
  if (scope.type === "all") {
    return fetchProducts(limit, offset, options);
  }
  return fetchProductsByCategory(scope.slug, limit, offset, options);
}

export interface UseProductCatalogOptions {
  scope: CatalogScope;
  initialProducts: Product[];
  initialFilters: ProductListFilters;
  initialSearch?: string;
}

export function useProductCatalog({
  scope,
  initialProducts,
  initialFilters,
  initialSearch = "",
}: UseProductCatalogOptions) {
  const router = useRouter();
  const skipInitialFetch = useRef(true);
  const basePath = catalogBasePath(scope);

  const [filters, setFilters] = useState<ProductListFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inputValue, setInputValue] = useState(initialSearch);
  const [products, setProducts] = useState<Product[]>(() =>
    (initialProducts ?? []).filter(isValidProduct),
  );
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
        const rows = (
          await fetchCatalogPage(scope, PAGE_SIZE, pageOffset, {
            search: searchQuery.trim() || undefined,
            filters,
          })
        ).filter(isValidProduct);

        setHasMore(rows.length === PAGE_SIZE);
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
    setSearchQuery(initialSearch);
    setInputValue(initialSearch);
    setProducts(next);
    setOffset(next.length);
    setHasMore(next.length === PAGE_SIZE);
  }, [scopeKey, initialProducts, initialFilters, initialSearch]);

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
    const empty = { skinTypes: [], brands: [], attributes: {} };
    setFilters(empty);
    setSearchQuery("");
    setInputValue("");
    syncUrl(empty, "");
  }, [syncUrl]);

  const isFiltered =
    hasActiveProductListFilters(filters, searchQuery) ||
    searchQuery.trim().length > 0;

  return {
    products,
    filters,
    updateFilters,
    searchQuery,
    inputValue,
    setInputValue,
    commitSearch,
    clearAll,
    isLoading,
    hasMore,
    loadMore,
    isFiltered,
  };
}
