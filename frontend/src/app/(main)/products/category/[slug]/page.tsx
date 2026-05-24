import { Suspense } from "react";
import { getProductsByCategory } from "@/lib/products";
// UI
import ProductListClient from "@/components/products/ProductListClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductListPage({ params }: PageProps) {
  const { slug } = await params;

  const products = await getProductsByCategory(slug, 20, 0);

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductListClient category={slug} initialProducts={products} />
    </Suspense>
  );
}
