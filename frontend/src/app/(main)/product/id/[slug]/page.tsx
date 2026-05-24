import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { getProductById, getMerchantsByProductId } from "@/lib/products";
// UI
import ProductClient from "@/components/product/ProductClient";

export const dynamic = "force-dynamic";

interface ProductProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductListPage({ params }: ProductProps) {
  const { slug } = await params;
  const productId = parseInt(slug, 10);
  if (!Number.isFinite(productId) || productId <= 0) {
    notFound();
  }
  // Although Concurrency is faster, if the product input is invalid, system bricks.
  let product: Product;
  try {
    product = await getProductById(String(productId));
  } catch {
    notFound();
  }
  if (!product?.id || !product?.name?.trim()) {
    notFound();
  }

  const merchantList = await getMerchantsByProductId(String(productId));

  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ProductClient product={product} merchantList={merchantList} />
    </Suspense>
  );
}
