import Product, { IProduct } from '../models/Product';

export const createProduct = async (product: IProduct): Promise<IProduct> => {
    return await Product.create(product);
}

export const updateProduct = async (productId: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
    return await Product.findOneAndUpdate({ _id: productId }, productData, { new: true });
}

export const deleteProduct = async (productId: string): Promise<IProduct | null> => {
    return await Product.findByIdAndDelete(productId);
}

export const getAllProducts = async (): Promise<IProduct[]> => {
    return await Product.find();
}

export async function getProductById(productId: string): Promise<IProduct | null> {
    return await Product.findById(productId);
}