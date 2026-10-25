import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { AssessmentDocsModal } from './components/AssessmentDocsModal';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { FloatingDock } from './components/FloatingDock';
import { BookOpen, CheckCircle, X, Shield, GraduationCap } from 'lucide-react';

function ToastNotification() {
  const { notification, clearNotification } = useCart();

  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 sm:bottom-8 right-5 sm:right-6 z-[1200] max-w-sm bg-[#FFFFFF] text-[#2B211D] px-4 py-3 rounded-xl shadow-xl border border-[#E6D8C5] flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center gap-2.5 text-xs font-medium">
        <CheckCircle className="w-4 h-4 text-[#286647] shrink-0" />
        <span className="font-semibold text-[#2B211D]">{notification}</span>
      </div>
      <button
        onClick={clearNotification}
        className="text-[#75665D] hover:text-[#2B211D] p-1 cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function MainLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bookstore-bg text-[#2B211D] selection:bg-[#FFF1A6] selection:text-[#2B211D]">
      {/* Global Navigation */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAssessmentDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Routed Views */}
      <div className="flex-1 pt-16 md:pt-[92px] pb-20 md:pb-0">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                key={refreshKey}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onOpenAssessmentDocs={() => setIsDocsOpen(true)}
              />
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Classic Bookstore Footer */}
      <footer className="bg-[#FFFFFF] text-[#75665D] pt-12 pb-28 sm:pb-32 px-4 sm:px-6 lg:px-8 border-t border-[#E6D8C5] text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#6B352A] text-white flex items-center justify-center font-bold shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-editorial font-bold text-[#2B211D] text-sm block">
                    PETER Online Book Store
                  </span>
                  <span className="text-[#75665D] text-[10px] uppercase tracking-wider font-semibold">
                    Curated Books for Readers
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#75665D] leading-relaxed">
                Empowering academic reading, software engineering mastery, and literary exploration with verified inventory and atomic checkout.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-bold text-[#2B211D] text-xs uppercase tracking-wider mb-3">
                Reader Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="hover:text-[#6B352A] transition">
                    Book Catalogue
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-[#6B352A] transition">
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-[#6B352A] transition">
                    Order History &amp; Receipts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Architecture & Stack */}
            <div>
              <h4 className="font-bold text-[#2B211D] text-xs uppercase tracking-wider mb-3">
                Full-Stack Architecture
              </h4>
              <ul className="space-y-1.5 text-[11px] text-[#75665D]">
                <li>• React 19 + TypeScript + Vite 8</li>
                <li>• Express.js REST API on Port 3000</li>
                <li>• MongoDB + Mongoose Schemas</li>
                <li>• Atomic Inventory Decrements &amp; Rollback</li>
                <li>• Stateless JWT + Bcryptjs Hashing</li>
              </ul>
            </div>

            {/* Evaluation & Credit */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#2B211D] text-xs uppercase tracking-wider">
                Evaluation &amp; Credits
              </h4>
              <button
                onClick={() => setIsDocsOpen(true)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFF8E8] hover:bg-[#FFF1A6]/50 text-[#6B352A] border border-[#E6D8C5] transition cursor-pointer font-semibold text-left flex items-center justify-between shadow-xs"
              >
                <span>Assessment Guide &amp; Demo</span>
                <span className="text-[10px] bg-[#6B352A]/10 text-[#6B352A] px-1.5 py-0.5 rounded font-bold">10-Min</span>
              </button>
              <div className="p-3 bg-[#FFF8E8] rounded-xl border border-[#E6D8C5] text-[11px]">
                <span className="text-[#75665D] block">Implementation credit:</span>
                <strong className="text-[#6B352A] block font-semibold">Last finish made by Jones JP</strong>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E6D8C5] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#75665D]">
            <p>© {currentYear} PETER Online Book Store. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[#286647] font-medium">
                <Shield className="w-3.5 h-3.5" />
                Atomic Concurrency Protected
              </span>
              <span className="flex items-center gap-1 text-[#6B352A] font-medium">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Edition
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Pill Navigation Dock */}
      <FloatingDock />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <AuthModal />
      <AssessmentDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        onRefreshCatalogue={() => setRefreshKey((k) => k + 1)}
      />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainLayout />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
