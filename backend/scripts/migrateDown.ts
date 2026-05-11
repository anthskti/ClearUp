import { createMigrator } from "../src/migrations";

async function main() {
  const migrator = createMigrator();
  const reverted = await migrator.down({ step: 1 });
  console.log(
    reverted.length
      ? `Reverted migration: ${reverted.map((m) => m.name).join(", ")}`
      : "No migration to revert.",
  );
}

main().catch((err) => {
  console.error("Migration down failed:", err);
  process.exit(1);
});
