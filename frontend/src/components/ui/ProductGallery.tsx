"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  imageUrls: string[];
}

const ProductImageGallery = ({ imageUrls }: ProductImageGalleryProps) => {
  // Clean the data for empty strings
  const validImages = useMemo(() => {
    return imageUrls.filter((url) => url && url.trim() !== "");
  }, [imageUrls]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no images exist after filtering, return null or a placeholder
  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
        No Image
      </div>
    );
  }

  // Left and Right Arrows
  const nextSlide = () => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevSlide = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length,
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* The Carousel */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-zinc-100 group">
        {/* Sliding Track */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
        >
          {validImages.map((url, index) => (
            <div
              key={index}
              className="min-w-full h-full relative flex items-center justify-center"
            >
              <Image
                src={url}
                alt={`Product view ${index + 1}`}
                fill
                className="object-contain p-2"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows for images > 1 */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-sm border border-zinc-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-sm border border-zinc-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-zinc-700" />
            </button>
          </>
        )}
      </div>

      {/*Thumbnails At Bottom  */}
      <div className="grid grid-cols-5 gap-3">
        {validImages.map((url, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`
              relative aspect-square overflow-hidden rounded-md transition-all duration-300
              ${
                selectedIndex === index
                  ? "ring-2 ring-zinc-800 ring-offset-2 opacity-100"
                  : "opacity-60 hover:opacity-100 hover:ring-2 hover:ring-zinc-300 hover:ring-offset-1"
              }
            `}
          >
            <Image
              src={url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
