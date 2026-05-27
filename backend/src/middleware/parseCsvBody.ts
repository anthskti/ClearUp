import express, { type RequestHandler } from "express";

/** Large CSV uploads — separate from global JSON (default 100kb). */
const CSV_BODY_LIMIT = "15mb";

const parseCsvText = express.text({
  type: (req) => {
    const ct = req.headers["content-type"] ?? "";
    return (
      ct.includes("text/csv") ||
      ct.includes("application/csv") ||
      ct.includes("text/plain") ||
      ct.includes("application/octet-stream")
    );
  },
  limit: CSV_BODY_LIMIT,
});

/** Legacy paste clients that still send `{ csv: "..." }`. */
const parseCsvJson = express.json({ limit: CSV_BODY_LIMIT });

/**
 * Admin CSV import: raw file bytes (text/csv) or JSON wrapper.
 * Mounted only on import routes so the global JSON limit stays small.
 */
export const parseImportCsvBody: RequestHandler = (req, res, next) => {
  const ct = req.headers["content-type"] ?? "";
  if (ct.includes("application/json")) {
    return parseCsvJson(req, res, next);
  }
  return parseCsvText(req, res, next);
};

export function csvFromRequestBody(body: unknown): string {
  if (typeof body === "string") {
    return body.trim();
  }
  if (body && typeof body === "object" && "csv" in body) {
    return String((body as { csv?: unknown }).csv ?? "").trim();
  }
  return "";
}
