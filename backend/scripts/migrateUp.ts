import { createMigrator } from "../src/migrations";

async function main() {
  const migrator = createMigrator();
  const executed = await migrator.up();
  console.log(
    executed.length
      ? `Applied migrations: ${executed.map((m) => m.name).join(", ")}`
      : "No pending migrations.",
  );
}

main().catch((err) => {
  console.error("Migration up failed:", err);
  process.exit(1);
});
