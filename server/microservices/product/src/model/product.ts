import mongoose, { Model } from 'mongoose';
import { ProductDocumentInterface } from '@veckovn/growvia-shared';
import { ProductSchema } from "@product/schema/product";

const ProductModel: Model<ProductDocumentInterface> =  mongoose.model<ProductDocumentInterface>("Product", ProductSchema, "Product");
export { ProductModel }

