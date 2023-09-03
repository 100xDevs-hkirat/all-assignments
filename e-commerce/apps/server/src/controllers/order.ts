import { Request, Response } from 'express';
import { createOrder, getOrders } from '../services/order';

export const createOrderController = async (req: Request, res: Response) => {
    const { items } = req.body;
    const userId = (req as any).user?.id;
    const order = await createOrder(userId, items);
    res.json({ order });
}

export const getOrderController = async (req: Request, res: Response) => {
    const userId =  (req as any).user?.id;
    const orders = await getOrders(userId);
    res.json({ orders });
}