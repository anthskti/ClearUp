import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { getClientIp, logSecurityEvent } from "../lib/security";

export const authRouteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many auth requests from this IP. Please try again later.",
});

const BRUTE_FORCE_PATH_REGEX = /(sign-in|login|reset|forgot|verification|verify)/i;

export const authBruteForceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${getClientIp(req)}:${req.path}`,
  skip: (req) => !BRUTE_FORCE_PATH_REGEX.test(req.path),
  message: "Too many attempts. Please wait before trying again.",
});

export function authAuditLogger(req: Request, res: Response, next: NextFunction) {
  const startedAt = Date.now();
  const path = req.path;
  const shouldAudit = BRUTE_FORCE_PATH_REGEX.test(path) || /sign-out|revoke/i.test(path);

  if (!shouldAudit) {
    next();
    return;
  }

  res.on("finish", () => {
    logSecurityEvent("auth.route", {
      method: req.method,
      path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: getClientIp(req),
      userId: req.user?.id ?? null,
      body: req.body ?? null,
    });
  });

  next();
}
