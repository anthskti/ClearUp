import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";

dotenv.config();

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // For Cloud Database via Supabase
  console.log("Connected to database via Connection String (Cloud)");

  const certPath = path.join(process.cwd(), "certs", "prod-ca-2021.crt");
  let caCert;
  try {
    caCert = fs.readFileSync(certPath).toString();
  } catch (err) {
    console.error("Failed to read Supabase SSL certificate:", err);
  }

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              rejectUnauthorized: true, // false before SSL Certificate, MITM protection
              ca: caCert, // Need SSL Certificate from Supabase dashboard
            }
          : {
              require: true,
              rejectUnauthorized: false, // DEV, issues arise from MITM
            },
    },
  });
} else {
  // Local via Docker
  console.log("Connected to database via Local Variables (Docker)");
  sequelize = new Sequelize(
    process.env.DB_NAME || "skincare",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "password123",
    {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      dialect: "postgres",
      logging: false,
    },
  );
}

export default sequelize;
