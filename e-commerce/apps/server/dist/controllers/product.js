"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByIdController = exports.getAllProductsController = exports.deleteProductController = exports.updateProductController = exports.createProductController = void 0;
const product_1 = require("../services/product");
const createProductController = async (req, res) => {
    const productData = req.body;
    if (!productData)
        return res.status(400).json({ error: "Product data is required" });
    if (!productData.name)
        return res.status(400).json({ error: "Product name is required" });
    if (!productData.price)
        return res.status(400).json({ error: "Product price is required" });
    if (!productData.description)
        return res.status(400).json({ error: "Product description is required" });
    if (!productData.image)
        return res.status(400).json({ error: "Product image is required" });
    const product = await (0, product_1.createProduct)(productData);
    res.json({ product, message: "Product created successfully" });
};
exports.createProductController = createProductController;
const updateProductController = async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;
    const updatedProduct = await (0, product_1.updateProduct)(productId, productData);
    if (!updatedProduct)
        return res.status(404).json({ error: "Product not found" });
    res.json({
        product: updatedProduct,
        message: "Product updated successfully",
    });
};
exports.updateProductController = updateProductController;
const deleteProductController = async (req, res) => {
    const productId = req.params.id;
    const deletedProduct = await (0, product_1.deleteProduct)(productId);
    if (!deletedProduct)
        return res.status(404).json({ error: "Product not found" });
    res.json({
        product: deletedProduct,
        message: "Product deleted successfully",
    });
};
exports.deleteProductController = deleteProductController;
const getAllProductsController = async (req, res) => {
    const products = await (0, product_1.getAllProducts)();
    res.json({ products });
};
exports.getAllProductsController = getAllProductsController;
const getProductByIdController = async (req, res) => {
    const productId = req.params.id;
    const product = await (0, product_1.getProductById)(productId);
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    res.json({ product });
};
exports.getProductByIdController = getProductByIdController;
