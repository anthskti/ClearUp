import fs from "fs";
import path from "path";
import csv from "csv-parser";
import sequelize from "../db";
import { MerchantService } from "../services/MerchantService";

type MerchantCsvRow = {
  name?: string;
  logo?: string;
  "name: string"?: string;
  "logo: string"?: string;
};

const merchantService = new MerchantService();

function readCSV(filePath: string): Promise<MerchantCsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: MerchantCsvRow[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

async function main() {
  try {
    await sequelize.authenticate();

    const merchantsPath = path.join(__dirname, "../../../data/merchant_table.csv");
    const rows = await readCSV(merchantsPath);

    let createdOrUpdated = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = (row.name ?? row["name: string"])?.trim();
      const logo =
        (row.logo ?? row["logo: string"])?.trim() || "/placeholder-logo.png";

      if (!name) {
        skipped += 1;
        continue;
      }

      await merchantService.upsertMerchant({ name, logo });
      createdOrUpdated += 1;
      process.stdout.write(".");
    }

    console.log(`\nMerchant seed complete. Upserted ${createdOrUpdated}, skipped ${skipped}.`);
    process.exit(0);
  } catch (error) {
    console.error("Merchant seed failed:", error);
    process.exit(1);
  }
}

main();