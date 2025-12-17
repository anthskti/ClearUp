"use client";

import React, { useEffect, useState } from "react";
import { X, Search, Check, Loader2 } from "lucide-react";
import { getAllMerchants } from "@/lib/merchants";
import { addMerchantByProductId } from "@/lib/products";
import { Merchant } from "@/types/merchant";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

export default function AddMerchantModal({
  isOpen,
  onClose,
  productId,
}: AddMerchantModalProps) {
  const router = useRouter();

  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedMerchantId, setSelectedMerchantId] = useState<number | null>(
    null
  );
  const [website, setWebsite] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [shippingInfo, setShippingInfo] = useState("Free Shipping");

  // Merchant modal opens and closes
  useEffect(() => {
    if (isOpen && merchants.length === 0) {
      const fetchMerchants = async () => {
        try {
          const data = await getAllMerchants();
          setMerchants(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMerchants();
    }
  }, [isOpen, merchants.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchantId || !price || !website) return;

    setIsSubmitting(true);
    try {
      await addMerchantByProductId(productId, {
        merchantId: selectedMerchantId,
        website,
        price: parseFloat(price),
        stock: inStock,
        shipping: shippingInfo,
      });

      // Refresh page data and close
      router.refresh();
      onClose();
      setSelectedMerchantId(null);
      setPrice("");
      setWebsite("");
    } catch (error) {
      alert("Failed to add merchant link");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Add a Merchant...</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Merchant Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                  Select Merchant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {merchants.map((merchant) => (
                    <div
                      key={merchant.id}
                      onClick={() => setSelectedMerchantId(merchant.id)}
                      className={`
                        cursor-pointer flex items-center gap-3 p-2 rounded-lg border transition-all
                        ${
                          selectedMerchantId === merchant.id
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-zinc-200 hover:border-zinc-300"
                        }
                      `}
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                        {/* No logo */}
                        {merchant.logo ? (
                          <Image
                            src={merchant.logo}
                            alt={merchant.name}
                            width={32}
                            height={32}
                            unoptimized={true}
                          />
                        ) : (
                          <span className="text-xs font-bold text-zinc-400">
                            {merchant.name[0]}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-zinc-700 truncate">
                        {merchant.name}
                      </span>
                      {selectedMerchantId === merchant.id && (
                        <Check size={16} className="ml-auto text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Link */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                    Product Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* In-Stock? */}
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="stock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-zinc-700 select-none"
                  >
                    Product is In Stock
                  </label>
                </div>
                {/* Shipping Details */}
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Shipping Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free with Prime / Free over $50"
                    value={shippingInfo}
                    onChange={(e) => setShippingInfo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Adding */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedMerchantId}
                  className="w-full bg-zinc-900 text-white font-bold py-3 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Link
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
