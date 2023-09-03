"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const getCart = async (userId) => {
    const cart = await Cart_1.default.findOne({ user: userId }).populate("items.product", "name price");
    return cart?.items || [];
};
exports.getCart = getCart;
const addToCart = async (userId, product, quantity) => {
    const cart = await Cart_1.default.findOneAndUpdate({ user: userId }, {
        $push: {
            items: { product, quantity },
        },
    }, { new: true, upsert: true }).populate("items.product", "name price");
    return cart?.items || [];
};
exports.addToCart = addToCart;
