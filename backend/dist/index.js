"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const routineRoutes_1 = __importDefault(require("./routes/routineRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// For Middleware
app.use(express_1.default.json()); // parsing JSON bodies
// Routes
app.use("/api/products", productRoutes_1.default);
app.use("/api/routines", routineRoutes_1.default);
// Health
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running!" });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
});
//# sourceMappingURL=index.js.map