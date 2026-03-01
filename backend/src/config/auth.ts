import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";

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
    // requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  plugin: [admin()],
});
