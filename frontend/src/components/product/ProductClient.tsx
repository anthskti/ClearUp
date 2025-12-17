"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Plus,
  Check,
  Info,
  Droplets,
  MapPin,
  FlaskConical,
} from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductImageGallery from "@/components/ui/ProductGallery";
import ProceduralWave from "@/components/themes/ProceduralWave";
import getProductData from "@/components/product/details";
import { DETAIL_CONFIG, CategoryKey } from "@/components/product/details";
import AddToRoutineButton from "@/components/routine/AddToRoutineButton";

import { Product } from "@/types/product";
import { ProductMerchantWithDetails } from "@/types/merchant";

import AddMerchantModal from "./AddMerchantModal";

interface ProductClientProps {
  product: Product;
  merchantList: ProductMerchantWithDetails[];
}

export default function ProductClient({
  product,
  merchantList,
}: ProductClientProps) {
  const config =
    DETAIL_CONFIG[product.category as CategoryKey] || DETAIL_CONFIG.default;

  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8] pt-20">
      <ProceduralWave seed={20} height={140} offset={1} />
      <AddMerchantModal
        isOpen={isMerchantModalOpen}
        onClose={() => setIsMerchantModalOpen(false)}
        productId={product.id}
      />
      <main className="relative z-1 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-5 space-y-4">
          <ProductImageGallery imageUrls={product.imageUrls} />
        </div>

        {/* Right Column: Data & Actions */}
        <div className="lg:col-span-7 flex flex-col">
          {/* 1. Brand and Product Name */}
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-black mb-1 uppercase">
              {product.brand}
            </h1>
            <h2 className="text-2xl text-zinc-600 font-light ">
              {product.name}
            </h2>
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="flex text-yellow-600">★★★★★</span>{" "}
              {/* Input Function for stars later */}
              <span className="text-zinc-400">
                ({product.reviewCount} review logs)
              </span>
            </div>
          </div>

          {/* 2. Add to Routine */}
          <div className="bg-white p-4 border border-zinc-100 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-zinc-400 tracking-wider mb-1">
                Database Status
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Indexed & Tracked
              </div>
            </div>
            <AddToRoutineButton
              product={product}
              category={product.category}
              variant="secondary"
            />
          </div>

          {/* 3. Detail Sheet */}
          <div className="space-y-6 mb-10">
            <div className="border-b border-zinc-200 pb-2 mb-4">
              <h3 className="text-sm font-bold uppercase text-zinc-400">
                Details
              </h3>
            </div>

            {/* Grid Layout for Datails*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {config.sheet.map((col, index) => {
                const displayValue = getProductData(product, col.dataKey);

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 text-zinc-400">{col.icon}</div>
                    <div>
                      <span className="block text-xs text-zinc-500 uppercase font-medium">
                        {col.label}
                      </span>
                      <span className="block text-zinc-900 font-medium">
                        {displayValue}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4">
              <span className="block text-xs text-zinc-500 uppercase font-medium mb-2">
                How to Use:
              </span>
              <ul className="list-disc list-inside text-zinc-600 space-y-1">
                {product.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Merchant Tracker, Implement through admin. Might Add Datascrapper in future.  */}
          <div className="mt-auto">
            <div className="border-b border-zinc-200 pb-2 mb-4 flex justify-between items-end">
              <h3 className="text-sm font-bold uppercase text-zinc-400">
                Marketplace Data
              </h3>
              <span>
                {/* Unhide when Users are available */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMerchantModalOpen(true)}
                >
                  Add Merchant Info
                </Button>
              </span>
            </div>

            <div className="overflow-hidden rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="text-zinc-500 font-medium uppercase text-xs border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-3">Merchant</th>
                    <th className="px-4 py-3">Availability</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {merchantList.map((merchant, index) => (
                    <tr
                      key={index}
                      className="hover:bg-zinc-50 transition-colors border-b border-zinc-200"
                    >
                      <td className="px-4 py-4 font-medium text-zinc-900">
                        <div className="flex flex-col items-center">
                          <Image
                            src={merchant.merchant?.logo || ""}
                            alt={merchant.merchant?.name || "Unknown Merchant"}
                            width={20}
                            height={20}
                            className="object-cover"
                            unoptimized={true}
                          />
                          <span className="text-xs text-zinc-500">
                            {merchant.merchant?.name || "Unknown Merchant"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {merchant.stock ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-medium border border-emerald-100">
                            <Check size={12} /> In Stock
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic">
                            Out of stock
                          </span>
                        )}
                        <div className="text-xs text-zinc-400 mt-1">
                          {merchant.shipping}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-zinc-900">
                        CA ${merchant.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <a
                          href={merchant.website}
                          className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 text-xs font-bold uppercase"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Visit Store <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Compatibility Products --Implement algo for similar products later. */}
        {/* <div className="col-span-1 lg:col-span-12 mt-4 pt-10 border-t border-zinc-200">
          <h3 className="text-xl font-bold text-zinc-900">
            Often Paired In Routines
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            Mock Suggestion Cards
            {product.compatible.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square bg-zinc-100 mb-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="text-xs text-zinc-500 uppercase font-bold tracking-wide">
                  {item.brand}
                </div>
                <div className="text-sm text-zinc-800 group-hover:underline">
                  {item.name}
                </div>
                 <div className="mt-2 text-xs text-[#0E4B84] flex items-center gap-1">
                  <Plus size={12} /> Add to Routine
                </div> 
              </div>
            ))}
           </div>
        </div> */}

        {/* Comment Section */}
        <div className="col-span-1 lg:col-span-12 mt-4 py-10 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-zinc-900">
                Community Comments
              </h3>
            </div>
            <Button variant="outline">Add a Comment</Button>
          </div>

          <div className="space-y-8">
            {/* Comment 1 */}
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                T1
              </div>
              <div className="grow">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-zinc-900 text-sm">
                    TestUser1
                  </span>
                  <span className="text-xs text-zinc-400">2 days ago</span>
                </div>

                {/* User "Metadata" Tags - Crucial for a Database feel */}
                <div className="flex flex-wrap gap-2 my-2">
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-wide font-bold rounded">
                    Oily Skin
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-wide font-bold rounded">
                    Acne Prone
                  </span>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed">
                  It gave me a glass skin look within a few week of consistent
                  use! I recommend you pair it with a good moisturizer to lock
                  in the hydration.
                </p>

                <div className="mt-3 flex gap-4 text-xs text-zinc-400 font-medium cursor-pointer">
                  <span className="hover:text-zinc-600">Helpful (12)</span>
                  <span className="hover:text-zinc-600">Reply</span>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                T2
              </div>
              <div className="grow">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-zinc-900 text-sm">
                    TestUser2
                  </span>
                  <span className="text-xs text-zinc-400">1 week ago</span>
                </div>

                <div className="flex flex-wrap gap-2 my-2">
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-wide font-bold rounded">
                    Combination Skin
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-wide font-bold rounded">
                    Sensitive
                  </span>
                </div>

                <p className="text-sm text-zinc-700 leading-relaxed">
                  Throughout work, this ampoule kept my skin hydrated. It
                  ultimately soothes my skin well even after a long day of work.
                  I highly recommend.
                </p>

                <div className="mt-3 flex gap-4 text-xs text-zinc-400 font-medium cursor-pointer">
                  <span className="hover:text-zinc-600">Helpful (4)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="text-sm text-zinc-500 hover:text-zinc-900 font-medium border-b border-transparent hover:border-zinc-900 pb-0.5 transition-all">
              Load more comments
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
