import Cart, { ICartItem } from "../models/Cart";

export const getCart = async (userId: string): Promise<ICartItem[]> => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price"
  );
  return cart?.items || [];
};

export const addToCart = async (
  userId: string,
  product: string,
  quantity: number
): Promise<ICartItem[]> => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $push: {
        items: { product, quantity },
      },
    },
    { new: true, upsert: true }
  ).populate("items.product", "name price");

  return cart?.items || [];
};
