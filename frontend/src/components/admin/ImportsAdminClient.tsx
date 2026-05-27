"use client";

import { useState } from "react";
import {
  importProductsCsv,
  importPriceUpdatesCsv,
} from "@/lib/products";

// Tab state for products and prices
type Tab = "products" | "prices";

export function ImportsAdminClient() {
  const [tab, setTab] = useState<Tab>("products");
  const [csv, setCsv] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  const runImport = async () => {
    setMessage(null);
    setDetail(null);
    const payload = file ?? (csv.trim() ? csv : null);
    if (!payload) {
      setMessage("Paste CSV content or choose a .csv file.");
      return;
    }
    setBusy(true);
    try {
      if (tab === "products") {
        const r = await importProductsCsv(payload);
        const totals = r.totals;
        const failed = totals?.failed ?? 0;
        const skipped = totals?.skipped ?? r.skipped ?? 0;
        setMessage(
          r.ok
            ? r.message || "Import finished"
            : r.message || "Import finished with errors",
        );
        setDetail(
          [
            `Received ${totals?.received ?? "?"}, processed ${r.processed}, created ${r.created}, updated ${r.updated}.`,
            skipped ? `Skipped ${skipped}.` : null,
            failed ? `Failed ${failed}.` : null,
            r.errors?.length
              ? `First errors: ${r.errors
                  .slice(0, 3)
                  .map((e) => `row ${e.row} (${e.code})`)
                  .join("; ")}`
              : null,
          ]
            .filter(Boolean)
            .join(" "),
        );
      } else {
        const r = await importPriceUpdatesCsv(payload);
        setMessage(r.message || "Price update finished");
        const extra =
          "updatedOffers" in r && r.updatedOffers != null
            ? ` Updated offers: ${r.updatedOffers}.`
            : "";
        setDetail(`Processed ${r.processed}.${extra}`);
      }
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        External scraper. Use this page to run CSV imports against the backend admin endpoints.
      </div>

      <div className="flex gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-1">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "products"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Product Imports CSV
        </button>
        <button
          type="button"
          onClick={() => setTab("prices")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "prices"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Price Updates CSV
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">
          Upload CSV file
        </label>
        <input
          type="file"
          accept=".csv,text/csv,text/plain"
          disabled={busy}
          onChange={(e) => {
            const picked = e.target.files?.[0] ?? null;
            setFile(picked);
            if (picked) {
              setCsv("");
            }
          }}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-800 hover:file:bg-zinc-200"
        />
        {file && (
          <p className="text-xs text-zinc-500">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">
          Or paste CSV
        </label>
        <textarea
          value={csv}
          disabled={Boolean(file)}
          onChange={(e) => {
            setCsv(e.target.value);
            if (e.target.value.trim()) {
              setFile(null);
            }
          }}
          rows={14}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-4 font-mono text-xs text-zinc-900 shadow-sm outline-none focus:border-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-400"
          placeholder={
            tab === "products"
              ? "Paste scraper CSV: name, brand, category, labels, skinType, country, capacity, price, instructions, ingredients, imageUrls, averageRating, url, status"
              : "Paste columns: name, brand, merchant, price…"
          }
        />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => void runImport()}
        className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? "Running…" : tab === "products" ? "Import products" : "Update prices"}
      </button>

      {message && (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm">
          <p className="font-medium">{message}</p>
          {detail && <p className="mt-1 text-zinc-500">{detail}</p>}
        </div>
      )}
    </div>
  );
}
