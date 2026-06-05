import { fetchCategoryBrands, fetchProductsByCategory } from "@/lib/products";
import ProductListClient from "@/components/products/ProductListClient";
import { Metadata } from "next";
import {
  flattenSearchParams,
  parseProductListFiltersFromSearchParams,
} from "@/lib/productListFilters";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "Product Catalog | Clearup",
  description: "Browse products.",
};

export default async function ProductListPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const flatParams = flattenSearchParams(await searchParams);
  const initialFilters = parseProductListFiltersFromSearchParams(
    flatParams,
    slug,
  );
  const initialSearch = flatParams.search ?? "";

  const [productsPage, availableBrands] = await Promise.all([
    fetchProductsByCategory(slug, 20, 0, {
      search: initialSearch || undefined,
      filters: initialFilters,
    }),
    fetchCategoryBrands(slug),
  ]);

  return (
    <ProductListClient
      scope={{ type: "category", slug }}
      initialProducts={productsPage.products}
      initialTotal={productsPage.total}
      initialFilters={initialFilters}
      initialSearch={initialSearch}
      availableBrands={availableBrands}
    />
  );
}
