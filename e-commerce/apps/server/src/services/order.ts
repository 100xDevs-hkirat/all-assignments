import Order, { IOrderItem, IOrder } from "../models/Order";

export const createOrder = async (
  userId: string,
  items: IOrderItem[]
): Promise<IOrder> => {
  const totalPrice = 0; // gotta implement calToalPrice
  const order = new Order({ user: userId, items, totalPrice });
  return await order.save();
};

export const getOrders = async (userId: string): Promise<IOrder[]> => {
  return await Order.find({ user: userId })
    .populate("items.product", "name price")
    .sort({ createdAt: -1 });
};
