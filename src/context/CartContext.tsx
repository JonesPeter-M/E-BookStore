import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart } from '../types';
import { cartApi } from '../api/client';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  isCartOpen: boolean;
  notification: string | null;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (bookId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (bookId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (bookId: string) => Promise<boolean>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearNotification: () => void;
}

const defaultCart: Cart = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(defaultCart);
      return;
    }

    try {
      setIsLoading(true);
      const res = await cartApi.getCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err: any) {
      console.error('[CartContext] Failed to load cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (bookId: string, quantity = 1): Promise<boolean> => {
    if (!isAuthenticated) {
      showNotification('Please sign in to add items to your cart.');
      openAuthModal('login');
      return false;
    }

    try {
      setIsLoading(true);
      const res = await cartApi.addToCart(bookId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        showNotification(res.message || 'Book added to cart!');
        return true;
      }
      return false;
    } catch (err: any) {
      showNotification(err.message || 'Failed to add book to cart');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (bookId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      const res = await cartApi.updateQuantity(bookId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
        return true;
      }
      return false;
    } catch (err: any) {
      showNotification(err.message || 'Failed to update quantity');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (bookId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      setIsLoading(true);
      const res = await cartApi.removeFromCart(bookId);
      if (res.success && res.cart) {
        setCart(res.cart);
        showNotification('Item removed from cart.');
        return true;
      }
      return false;
    } catch (err: any) {
      showNotification(err.message || 'Failed to remove item');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const res = await cartApi.clearCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err: any) {
      console.error('[CartContext] Clear cart error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        notification,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        clearNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
