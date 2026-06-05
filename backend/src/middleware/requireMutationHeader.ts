import { Request, Response, NextFunction } from "express";
import {
  CLEARUP_MUTATION_HEADER,
  CLEARUP_MUTATION_HEADER_VALUE,
} from "../lib/routineSecurity";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Simple CSRF mitigation: cross-origin form posts cannot set custom headers.
 * First-party frontend sends x-clearup-client: 1 on state-changing API calls.
 */
export function requireMutationHeader(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const header = req.headers[CLEARUP_MUTATION_HEADER];
  const value = Array.isArray(header) ? header[0] : header;

  if (value !== CLEARUP_MUTATION_HEADER_VALUE) {
    res.status(403).json({
      error: "Missing or invalid client mutation header.",
    });
    return;
  }

  next();
}
