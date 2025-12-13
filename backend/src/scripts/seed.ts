import fs from "fs";
import path from "path";
import sequelize from "../db";
import { ProductService } from "../services/ProductService";
import { MerchantService } from "../services/MerchantService";
import defineAssociations from "../associations";

const csv = require("csv-parser");
const productService = new ProductService();
const merchantService = new MerchantService();

// CSV Reader Function
function readCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err: any) => reject(err));
  });
}

async function seedDatabase() {
  try {
    console.log("Seeding (importing data into database)");

    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    defineAssociations();

    // Loading CSV
    const productsPath = path.join(__dirname, "../data/product_table.csv");
    const merchantsPath = path.join(__dirname, "../data/merchant_table.csv");

    const rawProducts = await readCSV(productsPath);
    const rawMerchants = await readCSV(merchantsPath);

    console.log(
      `Found ${rawProducts.length} products and ${rawMerchants.length} merchant links.`
    );

    // Create Product Table
    console.log("\nCREATING PRODUCTS ");
    for (const row of rawProducts) {
      // Helper to split string by ";" and clean whitespace
      const split = (str: string) =>
        str ? str.split(";").map((s) => s.trim()) : [];

      await productService.createProduct({
        name: row.name,
        brand: row.brand,
        category: row.category as any,
        labels: split(row.labels),
        skinType: split(row.skinType) as any[],
        country: row.country,
        capacity: row.capacity,
        price: parseFloat(row.price),
        instructions: split(row.instructions),
        activeIngredient: split(row.activeIngredients),
        ingredients: row.ingredients,
        imageUrls: split(row.imageUrls),
        averageRating: row.averageRating ? parseFloat(row.averageRating) : 0,
        reviewCount: row.reviewCount ? parseInt(row.reviewCount) : 0,
        tags: split(row.tags),
      });
      process.stdout.write(".");
    }
    console.log("\nProducts Created.");

    console.log("\nCREATING MERCHANTS");
    for (const row of rawMerchants) {
      await merchantService.createMerchant({
        name: row.name,
        logo: row.logo || "/placeholder-logo.png",
      });
      process.stdout.write(".");
    }
    console.log("\nMerchants Created.");
    console.log(
      "\n Base Data Seeded Complete; manually link Products and Merchants via API."
    );
    process.exit(0);
  } catch (error) {
    console.error("\n Seeding Failed: ", error);
    process.exit(1);
  }
}

seedDatabase();
