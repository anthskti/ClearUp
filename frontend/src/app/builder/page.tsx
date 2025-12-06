import Link from "next/link";
import React from "react";

import { Copy } from "lucide-react";

const Categories = [
  "Face Cleanser",
  "Toner",
  "Essence",
  "Serum",
  "Eye Cream",
  "Moisturizer",
  "Sunscreen",
];

const Builder: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#F6FBFF] pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl text-[#2E2E2E] pt-12 mb-8">
          Build Your Routine.
        </h1>

        {/* External Link */}
        <div className="m-6">
          <div className="flex justify-between items-center bg-white px-10 py-2 rounded-lg shadow-md">
            <div className="flex-1 text-left bg-[#F6FBFF] mr-4 px-10 py-1 rounded-lg border border-gray-200">
              <Link href="/" passHref>
                https://clearup.ca/routine/123
              </Link>
            </div>
            {/* Copy/Paste Icon */}
            <Copy className="m-2 w-5 h-5 cursor-pointer text-gray-500" />
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[180px_1fr_120px_100px] items-center border-b py-6">
          <div className="text-xs">Category</div>
          <div className="text-xs">Selection</div>
          <div className="text-xs">Where</div>
          <div className="text-xs text-center">Price</div>
        </div>

        {/* Categories list */}
        <div className="space-y-2">
          {Categories.map((category) => (
            <div
              key={category}
              className="grid grid-cols-[180px_1fr_120px_100px] items-center border-b py-4"
            >
              {/* Category */}
              <div className="text-sm text-gray-800">{category}</div>

              {/* Selection (long) */}
              <div className="flex items-center justify-between">
                {category === "Essence" ? (
                  <button className="bg-[#0e4b84] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#0a345c] transition-all duration-300">
                    + Choose an Essence
                  </button>
                ) : (
                  // Some Image Placeholder. Grab First Image of Product
                  // If Empty, have the add button with "+ Choose a [Category]"
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#d9d9d9] rounded-sm" />
                    <Link href="/product/" passHref>
                      <p className="text-black hover:text-[#0a345c] underline transition-all duration-300">
                        SKIN 1004: Centella Ampoule Moisturizer
                      </p>
                    </Link>
                  </div>
                )}
              </div>

              {/* Where */}
              <div className="text-sm text-gray-600 text-center">
                <div className="w-10 h-10 bg-[#d9d9d9] rounded-sm" />
              </div>

              {/* Price */}
              <div className="text-sm text-gray-600 text-center">
                <p className="text-lg font-semibold">$10.99</p>
              </div>
            </div>
          ))}
        </div>

        {/* User instructions card */}
        <div className="mt-10 bg-white rounded-lg shadow-md  p-6">
          <p className="font-semibold mb-3">User Instructions:</p>
          <div className="mb-4">
            <p className="font-semibold">Morning:</p>
            <ol className="list-decimal ml-6">
              <li>Cleanse with ....</li>
              <li>Sunscreen</li>
            </ol>
          </div>

          <div>
            <p className="font-semibold">Nights:</p>
            <ol className="list-decimal ml-6">
              <li>Cleanse with ....</li>
              <li>Lotion</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
