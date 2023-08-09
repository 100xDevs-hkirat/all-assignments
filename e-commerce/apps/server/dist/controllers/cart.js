"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCartController = exports.getCartController = void 0;
const cart_1 = require("../services/cart");
const getCartController = async (req, res) => {
    const userId = req.user?.id;
    const cart = await (0, cart_1.getCart)(userId);
    res.json({ cart });
};
exports.getCartController = getCartController;
const addToCartController = async (req, res) => {
    const userId = req.user?.id;
    const { product, quantity } = req.body;
    const cart = await (0, cart_1.addToCart)(userId, product, quantity);
    res.json({ cart });
};
exports.addToCartController = addToCartController;
