import express from "express";
import productRoutes from "./routes/productRoutes";
import routineRoutes from "./routes/routineRoutes";
import defineAssociations from "./associations";
import sequelize from "./db";

const app = express();
const port = process.env.PORT || 3000;

// For Middleware
app.use(express.json()); // parsing JSON bodies

// Routes
app.use("/api/products", productRoutes);
app.use("/api/routines", routineRoutes);

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

    // Sync database models
    // In production, use migrations instead
    // For development: use force: true to drop and recreate tables (fixes enum casting issues)
    // Set FORCE_SYNC=false to use alter: true instead (may fail with enum arrays)
    const syncOptions = process.env.NODE_ENV === "production" 
      ? { alter: false } // Don't auto-sync in production
      : process.env.FORCE_SYNC === "false"
      ? { alter: true }  // Try to alter existing schema (may fail with enum arrays)
      : { force: true };  // Drop and recreate tables (default for development)

    console.log("Syncing database models...");
    if (syncOptions.force) {
      console.warn("WARNING: Using force sync - all existing data will be deleted!");
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
