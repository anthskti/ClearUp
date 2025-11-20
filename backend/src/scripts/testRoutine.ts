import sequelize from "../db";
import Routine from "../models/Routine";
import Product from "../models/Product";
import RoutineProduct from "../models/RoutineProduct";
import defineAssociations from "../associations";

(async () => {
    await sequelize.sync({ force: true });
    defineAssociations(); // Define associations between models

    // Create test products first
    const product1 = await Product.create({
        name: "Centella Ampoule",
        brand: "SKIN 1004",
        category: "Serum",
        skinTypes: ["combination", "sensitive"],
        benefits: "Soothes and repairs skin",
        ingredients: "Centella Asiatica extract",
        country: "South Korea",
        imageUrls: ["centella.jpg"],
        averageRating: 0,
        reviewCount: 0,
        tags: ["glass skin"],
    });

    const product2 = await Product.create({
        name: "Gentle Cleanser",
        brand: "Test Brand",
        category: "Cleanser",
        skinTypes: ["sensitive", "dry"],
        benefits: "Gentle cleansing",
        ingredients: "Gentle ingredients",
        country: "USA",
        imageUrls: ["cleanser.jpg"],
        averageRating: 0,
        reviewCount: 0,
        tags: [],
    });

    console.log("Created products:", product1.toJSON(), product2.toJSON());

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
        category: "Serum",
        timeOfDay: "morning",
        notes: "Apply after toner",
    });

    const routineProduct2 = await RoutineProduct.create({
        routineId: routine.id,
        productId: product2.id,
        category: "Cleanser",
        timeOfDay: "morning",
        notes: "First step",
    });

    console.log("Added products to routine:", routineProduct1.toJSON(), routineProduct2.toJSON());

    // Fetch routine with products using associations
    const routineWithProducts = await Routine.findByPk(routine.id, {
        include: [
            {
                model: RoutineProduct,
                as: "routineProducts",
            },
        ],
    });
    
    console.log("Routine with products:", JSON.stringify(routineWithProducts?.toJSON(), null, 2));

     // Fetch all routines
    const allRoutines = await Routine.findAll();
    console.log("All routines:", allRoutines.map((r) => r.toJSON()));

    process.exit(0);

})();