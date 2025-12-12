import sequelize from "../db";
import Routine from "../models/Routine";
import Product from "../models/Product";
import RoutineProduct from "../models/RoutineProduct";
import Merchant from "../models/Merchant";
import ProductMerchant from "../models/ProductMerchant";
import defineAssociations from "../associations";

(async () => {
  await sequelize.sync({ force: true });
  await sequelize.sync({ force: true });
  defineAssociations(); // Define associations between models

  // Create test products first
  const product1 = await Product.create({
    name: "Centella Ampoule",
    brand: "Skin1004",

    category: "serum",
    labels: ["Watery"], // Textre
    skinType: ["combination", "oily", "dry"],
    country: "South Korea",
    capacity: "55ml",
    price: 15.99,

    instructions: [
      "After cleansing and toning, apply 2-3 drops on face.",
      "Pat gently for better absorption.",
    ],
    activeIngredient: [],
    ingredients: "Centella Asiatica extract",
    imageUrls: ["/placeholder-image.jpg"],
    averageRating: 4.3,
    reviewCount: 12,
    tags: ["glass skin"],
  });

  const product2 = await Product.create({
    name: "Snail Mucin Ampoule",
    brand: "COSRX",

    category: "essence",
    labels: ["Hydrating"],
    skinType: ["sensitive", "dry"],
    country: "South Korea",
    capacity: "80ml",
    price: 19.99,
    instructions: [
      "After cleansing and toner, pump product once on each side of the face.",
      "Deeply massage facial areas such as under eyes and let it rest for one minute before moving on.",
    ],
    activeIngredient: [],
    ingredients: "snail mucin, formaldahyde",
    imageUrls: ["/placeholder-image.jpg", "/placeholder-image.jpg"],
    averageRating: 4.5,
    reviewCount: 10,
    tags: ["dry skin, hydrating"],
  });

  console.log("Created products:", product1.toJSON(), product2.toJSON());

  // Create merchants
  const merchantOliveYoung = await Merchant.create({
    name: "Olive Young",
    logo: "/placeholder-image.jpg",
  });

  const merchantYesStyle = await Merchant.create({
    name: "YesStyle",
    logo: "/placeholder-image.jpg",
  });

  console.log(
    "Created merchants:",
    merchantOliveYoung.name,
    merchantYesStyle.name
  );

  // Link products to merchants
  const pm1 = await ProductMerchant.create({
    productId: product1.id,
    merchantId: merchantOliveYoung.id,
    website:
      "https://global.oliveyoung.com/product/detail?prdtNo=GA220113363&srsltid=AfmBOoqd21LaGp9VEnGmocOKXHmnacDQUbQHB3WGf68LvQAJ0S-LMEyE",
    price: 19.32,
    stock: true,
    shipping: "Free Shipping < US$60",
    // lastUpdated will be auto-set by Sequelize
  });

  const pm2 = await ProductMerchant.create({
    productId: product1.id,
    merchantId: merchantYesStyle.id,
    website:
      "https://www.yesstyle.com/en/skin1004-madagascar-centella-ampoule-55ml/info.html/pid.1121970671",
    price: 15.19, // Cheaper here!
    stock: true,
    shipping: "Free Shipping < CA$70",
  });

  console.log("Linked Centella Ampoule to Olive Young ($19.32)");
  console.log("Linked Centella Ampoule to YesStyle ($15.19)");

  // Verifying Merchant Data
  const listings = await ProductMerchant.findAll({
    where: { productId: product1.id },
  });
  console.log(`Found ${listings.length} listings for ${product1.name}:`);
  listings.forEach((listing) => {
    // Note: listing.lastUpdated should appear automatically now
    console.log(
      `- Price: $${listing.price} | Stock: ${listing.stock} | Updated: ${listing.lastUpdated}`
    );
  });

  // Insert a test routine
  const routine = await Routine.create({
    name: "My First Routine",
    description: "making my first routine",
    userId: 1, // Dummy value until user authentication is implemented.
  });

  console.log("Created routine:", routine.toJSON());

  // Add products to routine
  const routineProduct1 = await RoutineProduct.create({
    routineId: routine.id,
    productId: product1.id,
    category: product1.category,
    timeOfDay: "morning",
    notes: "Apply after toner",
  });

  const routineProduct2 = await RoutineProduct.create({
    routineId: routine.id,
    productId: product2.id,
    category: product2.category,
    timeOfDay: "morning",
    notes: "First step",
  });

  console.log(
    "Added products to routine:",
    routineProduct1.toJSON(),
    routineProduct2.toJSON()
  );

  // Fetch routine with products using associations
  const routineWithProducts = await Routine.findByPk(routine.id, {
    include: [
      {
        model: RoutineProduct,
        as: "routineProducts",
      },
    ],
  });

  console.log(
    "Routine with products:",
    JSON.stringify(routineWithProducts?.toJSON(), null, 2)
  );

  // Fetch all routines
  const allRoutines = await Routine.findAll();
  console.log(
    "All routines:",
    allRoutines.map((r) => r.toJSON())
  );

  process.exit(0);
})();
