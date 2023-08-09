"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = async (userId, items) => {
    const totalPrice = 0; // gotta implement calToalPrice
    const order = new Order_1.default({ user: userId, items, totalPrice });
    return await order.save();
};
exports.createOrder = createOrder;
const getOrders = async (userId) => {
    return await Order_1.default.find({ user: userId })
        .populate("items.product", "name price")
        .sort({ createdAt: -1 });
};
exports.getOrders = getOrders;
