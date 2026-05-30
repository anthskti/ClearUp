import { getProductsByCategory } from "@/lib/products";
import ProductListClient from "@/components/products/ProductListClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Product Catalog | ClearUp",
  description: "Browse products.",
};

export default async function ProductListPage({ params }: PageProps) {
  const { slug } = await params;

  const products = await getProductsByCategory(slug, 20, 0);

  return <ProductListClient category={slug} initialProducts={products} />;
}
