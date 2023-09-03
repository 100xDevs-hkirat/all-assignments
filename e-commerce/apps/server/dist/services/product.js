"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = async (product) => {
    return await Product_1.default.create(product);
};
exports.createProduct = createProduct;
const updateProduct = async (productId, productData) => {
    return await Product_1.default.findOneAndUpdate({ _id: productId }, productData, { new: true });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (productId) => {
    return await Product_1.default.findByIdAndDelete(productId);
};
exports.deleteProduct = deleteProduct;
const getAllProducts = async () => {
    return await Product_1.default.find();
};
exports.getAllProducts = getAllProducts;
async function getProductById(productId) {
    return await Product_1.default.findById(productId);
}
exports.getProductById = getProductById;
