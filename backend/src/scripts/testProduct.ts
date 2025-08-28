import sequelize from "../db";
import Product from "../models/Product";

(async () => {
  await sequelize.sync({ force: true });

  // Insert a test product
  const p = await Product.create({
    name: "Test Product",
    brand: "Test Brand",
    category: "Cleanser",
    skinTypes: ["oily"],
    benefits: "Test benefits",
    ingredients: "Test ingredients",
    country: "Test Country",
    imageUrls: ["test.jpg"],
    averageRating: 0,
    reviewCount: 0,
    tags: [],
  });

  console.log("Created product:", p.toJSON());

  // Fetch
  const found = await Product.findAll();
  console.log(
    "All products:",
    found.map((f) => f.toJSON())
  );

  process.exit(0);
})();
