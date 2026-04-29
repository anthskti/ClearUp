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
import {
  authAuditLogger,
  authBruteForceLimiter,
  authRouteLimiter,
} from "./middleware/security";
import { requireAuth } from "./middleware/requireAuth";
import { validateSecurityConfig } from "./lib/security";

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const trustedOrigins =
  process.env.TRUSTED_ORIGINS?.split(",")
    .map((s: string) => s.trim())
    .filter(Boolean) ?? ["http://localhost:3000"];

// Security and Handshakes First
app.use(
  cors({
    origin: trustedOrigins,
    credentials: true,
  }),
);
app.set("trust proxy", 1);
app.use(express.json()); // parse JSON before auth/rate-limit middlewares

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
// Audits all auth routes (sign-in, sign-up, sign-out, etc.)
app.use("/api/auth", authRouteLimiter, authBruteForceLimiter, authAuditLogger);

// Authorizes user and returns their effective role (user or admin)
app.get("/api/auth/me", requireAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({
    id: req.user.id,
    email: req.user.email ?? null,
    role: req.user.role ?? "user",
  });
});
// Handles all auth routes (sign-in, sign-up, sign-out, etc.)
app.all("/api/auth/*path", toNodeHandler(auth));

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
    validateSecurityConfig();
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
