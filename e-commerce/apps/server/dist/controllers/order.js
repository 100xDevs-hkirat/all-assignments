"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderController = exports.createOrderController = void 0;
const order_1 = require("../services/order");
const createOrderController = async (req, res) => {
    const { items } = req.body;
    const userId = req.user?.id;
    const order = await (0, order_1.createOrder)(userId, items);
    res.json({ order });
};
exports.createOrderController = createOrderController;
const getOrderController = async (req, res) => {
    const userId = req.user?.id;
    const orders = await (0, order_1.getOrders)(userId);
    res.json({ orders });
};
exports.getOrderController = getOrderController;
