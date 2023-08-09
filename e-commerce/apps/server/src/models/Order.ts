import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: Number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: Number;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, dafault: Date.now },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
