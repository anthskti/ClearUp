import path from "path";
import { Umzug, SequelizeStorage } from "umzug";
import sequelize from "../db";

export function createMigrator() {
  return new Umzug({
    migrations: {
      glob: path.join(__dirname, "[0-9]*.{js,ts}"),
    },
    context: {
      sequelize,
      queryInterface: sequelize.getQueryInterface(),
    },
    storage: new SequelizeStorage({
      sequelize,
      tableName: "sequelize_meta",
    }),
    logger: console,
  });
}

export async function runMigrations(): Promise<void> {
  const migrator = createMigrator();
  const executed = await migrator.up();
  if (executed.length > 0) {
    console.log(
      `Applied migrations: ${executed.map((m) => m.name).join(", ")}`,
    );
  } else {
    console.log("No pending migrations.");
  }
}
