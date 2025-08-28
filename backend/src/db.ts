import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "postgres", // DB name
  process.env.DB_USER || "postgres", // DB user
  process.env.DB_PASSWORD || "", // DB password
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: true, // disable SQL logs in console
  }
);

export default sequelize;
