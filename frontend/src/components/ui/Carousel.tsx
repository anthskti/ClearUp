"use client";
import React, { useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode;
  className?: string;
}

const Carousel = ({ children, className = "" }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert children to array to ensure we can index them safely
  const items = React.Children.toArray(children);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className={`relative w-full group/carousel ${className}`}>
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-2 
                   bg-white rounded-full shadow-lg hover:bg-gray-100 transition-transform active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 text-zinc-700" />
      </button>

      {/* The Content */}
      <div className="overflow-hidden px-1">
        <div className="w-full transition-all duration-300">
          {items[currentIndex]}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-2 
                   bg-white rounded-full shadow-lg hover:bg-gray-100 transition-transform active:scale-95"
      >
        <ChevronRight className="w-5 h-5 text-zinc-700" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-zinc-800 w-2" : "bg-zinc-300 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
