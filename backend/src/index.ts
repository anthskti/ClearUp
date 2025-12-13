import express from "express";
import productRoutes from "./routes/productRoutes";
import routineRoutes from "./routes/routineRoutes";
import merchantRoutes from "./routes/merchantRoutes";
import defineAssociations from "./associations";
import sequelize from "./db";

const app = express();
const port = process.env.PORT;
const cors = require("cors");

// For Middleware
app.use(express.json()); // parsing JSON bodies
app.use(cors());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/merchant", merchantRoutes);

// Health
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running!" });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Define associations between models
    defineAssociations();

    // FIXED SYNC LOGIC
    // 1. If we are running the Seed Script, we use force: true (handled in seed.ts, not here).
    // 2. If we are running the Server, we generally just want to connect.
    // 3. We avoid 'alter: true' because it crashes on Enum Arrays in Postgres.

    const shouldForce = process.env.FORCE_SYNC === "true";

    // If NOT forcing, we use empty options {}.
    // This tells Sequelize: "Create tables if they don't exist, otherwise do nothing."
    const syncOptions = shouldForce ? { force: true } : { alter: false };

    console.log(`Syncing database models... (Force: ${shouldForce})`);

    if (shouldForce) {
      console.warn("WARNING: Using force sync - data will be wiped!");
    }

    await sequelize.sync(syncOptions);
    console.log("Database models synced successfully.");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
    });
  } catch (error: any) {
    console.error("Unable to start server:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
};

startServer();
