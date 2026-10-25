import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string; city?: string; postalCode?: string }) => Promise<void>;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bookstore_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    async function loadCurrentUser() {
      const storedToken = localStorage.getItem('bookstore_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('bookstore_token');
            setToken(null);
          }
        } catch (err) {
          console.warn('[Auth] Session expired or invalid token:', err);
          localStorage.removeItem('bookstore_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    loadCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.token && res.user) {
        localStorage.setItem('bookstore_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.token && res.user) {
        localStorage.setItem('bookstore_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('bookstore_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
