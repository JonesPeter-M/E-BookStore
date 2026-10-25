import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  isbn?: string;
  coverImage?: string;
  rating?: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Book author is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Book price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Book category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Book description is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Available stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isbn: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for title and author keyword searching
BookSchema.index({ title: 'text', author: 'text', category: 'text' });

export const Book = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
