import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";
import { sendSesEmail } from "../lib/sesEmail";

const trustedOrigins =
  process.env.TRUSTED_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? ["http://localhost:3000"];

export const auth = betterAuth({
  // Connect directly to your existing PostgreSQL database
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Bypasses strict certificate validation for cloud DBs
      // BUT can cause issues with MITM
      // Later implement cert.pem from supabase
    },
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
      }).catch((err) => console.error("[auth] sendResetPassword email failed:", err));
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
