import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  book: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  customer: IOrderCustomer;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Snapshot title is required'],
    },
    price: {
      type: Number,
      required: [true, 'Snapshot price is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customer: {
      name: { type: String, required: [true, 'Customer name is required'], trim: true },
      email: { type: String, required: [true, 'Customer email is required'], trim: true },
      phone: { type: String, required: [true, 'Phone number is required'], trim: true },
      address: { type: String, required: [true, 'Delivery address is required'], trim: true },
      city: { type: String, required: [true, 'City is required'], trim: true },
      postalCode: { type: String, required: [true, 'Postal code is required'], trim: true },
    },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: function (items: IOrderItem[]) {
          return items && items.length > 0;
        },
        message: 'An order must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Order total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
