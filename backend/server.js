const express = require("express");
const app = express();
const productController = require("./src/controllers/productController");

app.use(express.json());
app.use("/api/products", productController);

app.listen(3000, () => console.log("Server running on port 3000"));
