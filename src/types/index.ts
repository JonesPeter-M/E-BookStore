export interface Book {
  _id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id?: string;
  book: {
    _id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    stock: number;
    coverImage?: string;
  };
  quantity: number;
  subtotal: number;
  exceedsStock?: boolean;
}

export interface Cart {
  cartId?: string;
  userId?: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface OrderItem {
  _id?: string;
  book: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  orderId?: string;
  customer: CustomerDetails;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt?: string;
}
