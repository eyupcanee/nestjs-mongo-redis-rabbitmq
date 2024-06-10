import { Date, Document, ObjectId, Schema } from 'mongoose';

export const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: Number,
  },
  {
    timestamps: true,
  },
);

export interface Product extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ProductResponseModel {
  message: string;
  products: Product | Product[];
}
