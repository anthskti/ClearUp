import React, { Suspense } from "react";
import { Product } from "@/types/product";
import { getProductById, getMerchantsByProductId } from "@/lib/products";
// UI
import ProductClient from "@/components/product/ProductClient";

interface ProductProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductListPage({ params }: ProductProps) {
  const { slug } = await params;

  const [product, merchantList] = await Promise.all([
    getProductById(slug),
    getMerchantsByProductId(slug),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductClient product={product} merchantList={merchantList} />
    </Suspense>
  );
}
