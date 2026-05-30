import React from "react";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { getProductById, getMerchantsByProductId } from "@/lib/products";
import ProductClient from "@/components/product/ProductClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const { slug } = await params;
  const productId = parseInt(slug, 10);

  if (!Number.isFinite(productId) || productId <= 0) {
    return { title: "Product Not Found | ClearUp" };
  }

  try {
    const product = await getProductById(String(productId));

    if (product?.name) {
      return {
        title: `${product.name} | ClearUp`,
        description: `View details about ${product.name}.`,
      };
    }
  } catch {
    return { title: "Product | ClearUp" };
  }

  return { title: "Product | ClearUp" };
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

  return <ProductClient product={product} merchantList={merchantList} />;
}
