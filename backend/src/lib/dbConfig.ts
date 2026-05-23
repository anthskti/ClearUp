import fs from "fs";
import path from "path";

// Production: when connecting to hosted Postgres Supabase (string can't be empty)
export function usesCloudDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

// Connection string for Sequelize and Better Auth.
// Local dev: built from DB_* when DATABASE_URL is unset.
export function resolveDatabaseUrl(): string {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;

  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const database = process.env.DB_NAME || "skincare";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "password123";

  const encUser = encodeURIComponent(user);
  const encPass = encodeURIComponent(password);
  return `postgresql://${encUser}:${encPass}@${host}:${port}/${database}`;
}

function readSupabaseCa(): string | undefined {
  const certPath = path.join(process.cwd(), "certs", "prod-ca-2021.crt");
  try {
    return fs.readFileSync(certPath).toString();
  } catch {
    return undefined;
  }
}

/** SSL options for `pg` / Sequelize — keep auth and ORM aligned. */
export function getPgSslConfig():
  | false
  | { require?: boolean; rejectUnauthorized: boolean; ca?: string } {
  if (!usesCloudDatabase()) {
    return false;
  }

  const ca = readSupabaseCa();
  if (process.env.NODE_ENV === "production") {
    return {
      require: true,
      rejectUnauthorized: true,
      ...(ca ? { ca } : {}),
    };
  }

  // Dev against cloud DB (e.g. Supabase): still use SSL, relaxed verify
  return {
    require: true,
    rejectUnauthorized: false,
  };
}
