import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // For Cloud Database via Supabase
  console.log("Connected to database via Connection String (Cloud)");

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
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
    }
  );
}

export default sequelize;
