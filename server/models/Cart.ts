import mongoose, { Document, Schema, Types } from 'mongoose';
import { IBook } from './Book';

export interface ICartItem {
  book: Types.ObjectId | IBook;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
