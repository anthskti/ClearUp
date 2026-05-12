import { Request } from "express";

const SENSITIVE_KEYS = new Set([
  "password",
  "newPassword",
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "cookie",
  "set-cookie",
  "secret",
]);

type JsonLike = Record<string, unknown> | unknown[] | unknown;

export function redactSensitiveFields(value: JsonLike): JsonLike {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveFields(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((acc, [key, nestedValue]) => {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      acc[key] = "[REDACTED]";
      return acc;
    }

    acc[key] = redactSensitiveFields(nestedValue);
    return acc;
  }, {});
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

export function logSecurityEvent(
  event: string,
  metadata: Record<string, unknown>,
): void {
  const safeMetadata = redactSensitiveFields(metadata) as Record<string, unknown>;
  const payload = {
    event,
    ts: new Date().toISOString(),
    ...safeMetadata,
  };
  console.info("[security]", JSON.stringify(payload));
}

export function validateSecurityConfig(): void {
  const nodeEnv = process.env.NODE_ENV || "development";
  const trustedOrigins =
    process.env.TRUSTED_ORIGINS?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? ["http://localhost:3000"];

  if (nodeEnv === "production") {
    const authUrl =
      process.env.BETTER_AUTH_URL?.trim().replace(/\/$/, "") ||
      process.env.RENDER_EXTERNAL_URL?.trim().replace(/\/$/, "") ||
      "";
    if (!authUrl) {
      console.warn(
        "[security] Production: set BETTER_AUTH_URL (e.g. https://your-app.onrender.com) so OAuth state and redirects match the public host. RENDER_EXTERNAL_URL is used as a fallback on Render.",
      );
    }

    const hasWildcardOrigin = trustedOrigins.some((origin) => origin === "*");
    if (hasWildcardOrigin) {
      console.warn(
        "[security] TRUSTED_ORIGINS includes '*' in production. Restrict to explicit origins.",
      );
    }
  }
}
