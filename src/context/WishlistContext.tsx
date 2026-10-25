import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Book[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = `peter_bookstore_wishlist_${user?.id || 'guest'}`;

  const [wishlist, setWishlist] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Re-load when user signs in or out
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlist([]);
    }
  }, [storageKey]);

  // Persist whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist, storageKey]);

  const isInWishlist = (bookId: string) => {
    return wishlist.some((b) => b._id === bookId);
  };

  const toggleWishlist = (book: Book) => {
    setWishlist((prev) => {
      if (prev.some((b) => b._id === book._id)) {
        return prev.filter((b) => b._id !== book._id);
      } else {
        return [...prev, book];
      }
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist((prev) => prev.filter((b) => b._id !== bookId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
