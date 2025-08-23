const productModel = require("./productModel");

exports.getAllProducts = async () => {
  return await productModel.findAll();
};

exports.getProductById = async (id) => {
  return await productModel.findById(id);
};

exports.createProduct = async (data) => {
  return await productModel.insert(data);
};