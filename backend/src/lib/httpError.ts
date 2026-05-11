import type { Response } from "express";

export function handleInternalError(
  res: Response,
  scope: string,
  error: unknown,
): void {
  console.error(`[${scope}]`, error);
  res.status(500).json({ error: "Internal Server Error" });
}
