import express from "express";
import productRoutes from "./routes/productRoutes";
import routineRoutes from "./routes/routineRoutes";
import merchantRoutes from "./routes/merchantRoutes";
import defineAssociations from "./associations";
import sequelize from "./db";
import rateLimit from "express-rate-limit";
import compression from "compression";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth";

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// Security and Handshakes First
app.use(cors());
app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use(globalLimiter);

// Optimization (Compress before parsing saving overhead)

const createStrictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "You are creating too many routines. Please wait a while.",
});

app.use(
  compression({
    level: 6, // Balance between speed and compression (1-9)
    threshold: 1024, // Only compress responses larger than 1kb
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  }),
);

app.all("/api/auth/*path", toNodeHandler(auth));

app.use(express.json()); // parsing JSON bodies

// Routes
app.use("/api/products", productRoutes);
app.use(
  "/api/routines",
  (req, res, next) => {
    if (req.method === "POST") {
      return createStrictLimiter(req, res, next);
    }
    next();
  },
  routineRoutes,
);
app.use(
  "/api/merchant",
  (req, res, next) => {
    if (req.method === "POST") {
      return createStrictLimiter(req, res, next);
    }
    next();
  },
  merchantRoutes,
);

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
