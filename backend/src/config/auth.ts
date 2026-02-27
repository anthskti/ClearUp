import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  // Connect directly to your existing PostgreSQL database
  database: new Pool({
    connectionString: process.env.DATABASE_URL 
  }),
  emailAndPassword: {
    enabled: true, 
  },
  plugin: [
    admin()
  ]
});