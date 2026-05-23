import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import {
  getPgSslConfig,
  resolveDatabaseUrl,
  usesCloudDatabase,
} from "./lib/dbConfig";

dotenv.config();

const connectionString = resolveDatabaseUrl();
const ssl = getPgSslConfig();

if (usesCloudDatabase()) {
  console.log("Connected to database via Connection String (Cloud)");
} else {
  console.log("Connected to database via Local Variables (Docker)");
}

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
  ...(ssl ? { dialectOptions: { ssl } } : {}),
});

export default sequelize;
