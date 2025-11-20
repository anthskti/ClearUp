import express from "express";
import productRoutes from "./routes/productRoutes";
import routineRoutes from "./routes/routineRoutes";

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
