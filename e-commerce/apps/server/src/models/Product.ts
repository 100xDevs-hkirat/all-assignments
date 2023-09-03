import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    img: string;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, requried: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;