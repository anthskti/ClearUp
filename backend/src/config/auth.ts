import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";
import { sendSesEmail } from "../lib/sesEmail";
import fs from "fs";
import path from "path";

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean) ?? ["http://localhost:3000"];

/** Public origin where `/api/auth/*` is served (required for OAuth redirect + state cookies in production). */
function normalizePublicOrigin(raw: string | undefined): string | undefined {
  const s = raw?.trim().replace(/\/$/, "");
  return s || undefined;
}

const authBaseURL =
  normalizePublicOrigin(process.env.BETTER_AUTH_URL) ||
  normalizePublicOrigin(process.env.RENDER_EXTERNAL_URL);

// Always log once (Render may not set NODE_ENV=production; see deploy docs).
console.info(
  "[auth] bootstrap",
  JSON.stringify({
    nodeEnv: process.env.NODE_ENV ?? "(unset)",
    baseURL: authBaseURL ?? null,
    crossSiteCookies: process.env.BETTER_AUTH_CROSS_SITE_COOKIES === "1",
  }),
);

const certPath = path.join(process.cwd(), "certs", "prod-ca-2021.crt");
let caCert;
try {
  caCert = fs.readFileSync(certPath).toString();
} catch (err) {
  console.error("[auth] Failed to read Supabase SSL certificate:", err);
}

/**
 * OAuth uses a short-lived signed cookie + DB verification. If the browser loads
 * the app on origin A but `authClient` talks to the API on origin B, `SameSite=Lax`
 * can block that cookie on the cross-site fetch → `state_security_mismatch`.
 * Set BETTER_AUTH_CROSS_SITE_COOKIES=1 on the API when frontend and API hosts differ (HTTPS only).
 *
 * Last resort (weakens CSRF layer): BETTER_AUTH_SKIP_STATE_COOKIE_CHECK=1
 * @see https://www.better-auth.com/docs/reference/errors/state_mismatch
 */
const crossSiteCookies = process.env.BETTER_AUTH_CROSS_SITE_COOKIES === "1";
const skipStateCookieCheck =
  process.env.BETTER_AUTH_SKIP_STATE_COOKIE_CHECK === "1";

export const auth = betterAuth({
  ...(authBaseURL ? { baseURL: authBaseURL } : {}),
  ...(crossSiteCookies
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
  ...(skipStateCookieCheck
    ? {
        account: {
          skipStateCookieCheck: true,
        },
      }
    : {}),
  // Connect directly to your existing PostgreSQL database
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: true, //
            ca: caCert,
          }
        : false,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // enable after SES + sendVerificationEmail are stable
    sendResetPassword: async ({ user, url }) => {
      // Fire-and-forget avoids timing side-channels; still log failures.
      void sendSesEmail({
        to: user.email,
        subject: "Reset your ClearUp password",
        text: `You requested a password reset.\n\nOpen this link (valid for a limited time):\n${url}\n\nIf you did not request this, ignore this email.`,
        html: `<p>You requested a password reset.</p><p><a href="${url}">Reset your password</a></p><p>If you did not request this, ignore this email.</p>`,
      }).catch((err) =>
        console.error("[auth] sendResetPassword email failed:", err),
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendSesEmail({
        to: user.email,
        subject: "Verify your ClearUp email",
        text: `Verify your email address:\n${url}\n\nIf you did not create an account, ignore this email.`,
        html: `<p>Verify your email address:</p><p><a href="${url}">Confirm email</a></p><p>If you did not create an account, ignore this email.</p>`,
      }).catch((err) =>
        console.error("[auth] sendVerificationEmail failed:", err),
      );
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins,
  plugin: [admin()],
});
