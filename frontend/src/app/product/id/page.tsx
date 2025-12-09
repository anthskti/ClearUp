"use client";

import React, { useState } from "react";
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
import ProceduralWave from "@/components/themes/ProceduralWave";

const ProductDatabasePage = () => {
  // Mock Data based on your screenshot
  const product = {
    brand: "SKIN1004",
    name: "Madagascar Centella Asiatica 100 Ampoule",
    rating: 4.8,
    reviews: 1240,
    description:
      "A soothing ampoule that helps calm and restore imbalance in the skin caused by harsh environments. Made with 100% Centella Asiatica Extract.",
    details: [
      {
        label: "Capacity",
        value: "100ml",
        icon: <FlaskConical size={16} />,
      },
      {
        label: "Country",
        value: "South Korea",
        icon: <MapPin size={16} />,
      },
      {
        label: "Texture",
        value: "Watery, Non-sticky",
        icon: <Droplets size={16} />,
      },
      {
        label: "Key Active",
        value: "Centella Asiatica Extract",
        icon: <Info size={16} />,
      },
    ],
    instructions: [
      "After cleansing and toning, apply 2-3 drops on face.",
      "Pat gently for better absorption.",
    ],
    merchants: [
      { name: "Amazon", price: 9.99, stock: true, shipping: "Free with Prime" },
      { name: "Stylevana", price: 10.99, stock: true, shipping: "$3.99" },
      { name: "YesStyle", price: 12.5, stock: false, shipping: "Free > $50" },
    ],
    compatible: [
      { name: "Gardening Gel Moisturizer", brand: "SKIN 1004" },
      { name: "Tapestry Balm Cleanser", brand: "SKIN 1004" },
    ],
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8] pt-20">
      <ProceduralWave seed={10} height={140} offset={1} />
      <main className="relative z-1 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-sm text-zinc-500">
            Products / Serums / Skin 1004
          </div>
          {/* Main Image Placeholder */}
          <div className="aspect-4/5 bg-zinc-100 rounded-sm flex items-center justify-center relative overflow-hidden group">
            <span className="text-zinc-400">Product Image</span>
            {/* Hover visual cue */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Carousel Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-50 hover:bg-zinc-100 cursor-pointer border border-transparent hover:border-zinc-300 transition-all"
              />
            ))}
          </div>
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
                ({product.reviews} verified logs)
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
            <Button variant="secondary" size="default" asChild>
              <Link href="/">
                <Plus size={18} />
                Add to Routine
              </Link>
            </Button>
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
              {product.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 text-zinc-400">{detail.icon}</div>
                  <div>
                    <span className="block text-xs text-zinc-500 uppercase font-medium">
                      {detail.label}
                    </span>
                    <span className="block text-zinc-900 font-medium">
                      {detail.value}
                    </span>
                  </div>
                </div>
              ))}
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

          {/* 4. Merchant Tracker, Implement Later Through Datascrape */}
          <div className="mt-auto">
            <div className="border-b border-zinc-200 pb-2 mb-4 flex justify-between items-end">
              <h3 className="text-sm font-bold uppercase text-zinc-400">
                Marketplace Data
              </h3>
              {/* <span className="text-xs text-zinc-400">
                Last updated: 2h ago
              </span> */}
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
                  {product.merchants.map((merchant, i) => (
                    <tr
                      key={i}
                      className="hover:bg-zinc-50 transition-colors border-b border-zinc-200"
                    >
                      <td className="px-4 py-4 font-medium text-zinc-900">
                        {merchant.name}
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
                        <button className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 text-xs font-bold uppercase">
                          Visit Store <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Compatibility Products --Implement algo for similar products later. */}
        <div className="col-span-1 lg:col-span-12 mt-4 pt-10 border-t border-zinc-200">
          <h3 className="text-xl font-bold text-zinc-900">
            Often Paired In Routines
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Mock Suggestion Cards */}
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
                {/* <div className="mt-2 text-xs text-[#0E4B84] flex items-center gap-1">
                  <Plus size={12} /> Add to Routine
                </div> */}
              </div>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="col-span-1 lg:col-span-12 mt-4 pt-10 border-t border-zinc-200">
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
};

export default ProductDatabasePage;
