import axios, { AxiosError } from 'axios';
import { Book, Cart, Order, CustomerDetails, User } from '../types';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookstore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API
export const authApi = {
  async register(data: { name: string; email: string; password: string; phone?: string; address?: string; city?: string; postalCode?: string }) {
    const res = await apiClient.post<{ success: boolean; token: string; user: User }>('/auth/register', data);
    return res.data;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post<{ success: boolean; token: string; user: User }>('/auth/login', credentials);
    return res.data;
  },

  async getMe() {
    const res = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
};

// Books API
export const booksApi = {
  async getBooks(params?: { search?: string; category?: string; sort?: string; inStockOnly?: boolean }) {
    const res = await apiClient.get<{ success: boolean; count: number; categories: string[]; books: Book[] }>('/books', {
      params,
    });
    return res.data;
  },

  async getBookById(id: string) {
    const res = await apiClient.get<{ success: boolean; book: Book }>(`/books/${id}`);
    return res.data;
  },

  async resetSeed() {
    const res = await apiClient.post<{ success: boolean; message: string }>('/books/reset-seed');
    return res.data;
  },
};

// Cart API
export const cartApi = {
  async getCart() {
    const res = await apiClient.get<{ success: boolean; cart: Cart }>('/cart');
    return res.data;
  },

  async addToCart(bookId: string, quantity = 1) {
    const res = await apiClient.post<{ success: boolean; message: string; cart: Cart }>('/cart', {
      bookId,
      quantity,
    });
    return res.data;
  },

  async updateQuantity(bookId: string, quantity: number) {
    const res = await apiClient.put<{ success: boolean; message: string; cart: Cart }>(`/cart/${bookId}`, {
      quantity,
    });
    return res.data;
  },

  async removeFromCart(bookId: string) {
    const res = await apiClient.delete<{ success: boolean; message: string; cart: Cart }>(`/cart/${bookId}`);
    return res.data;
  },

  async clearCart() {
    const res = await apiClient.delete<{ success: boolean; message: string; cart: Cart }>('/cart');
    return res.data;
  },
};

// Orders API
export const ordersApi = {
  async createOrder(customer: CustomerDetails) {
    const res = await apiClient.post<{ success: boolean; message: string; order: Order }>('/orders', {
      customer,
    });
    return res.data;
  },

  async getMyOrders() {
    const res = await apiClient.get<{ success: boolean; count: number; orders: Order[] }>('/orders/me');
    return res.data;
  },
};
