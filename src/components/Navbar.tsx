import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Package,
  FileText,
  Search,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface NavbarProps {
  onOpenAssessmentDocs: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAssessmentDocs,
  searchTerm = '',
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal, login } = useAuth();
  const { cart, setIsCartOpen, isCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen, isWishlistOpen } = useWishlist();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 50);
    }
  }, [mobileSearchOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickDemoLogin = async () => {
    try {
      await login('demo@bookstore.test', 'password123');
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  // Active state calculations for highlighting
  const isHomeActive = location.pathname === '/' && !location.search.includes('saved=1') && !isWishlistOpen && !isCartOpen;
  const isSavedActive = isWishlistOpen || location.search.includes('saved=1');
  const isOrdersActive = location.pathname === '/orders';
  const isCartActive = isCartOpen || location.pathname === '/cart';

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[1000] bg-[#FFF8E8]/95 backdrop-blur-md border-b border-[#E6D8C5] shadow-xs transition-all">
      {/* Top micro-announcement banner (Desktop / Tablet only) */}
      <div className="hidden md:block bg-[#FFF1A6]/80 text-[#2B211D] text-xs py-1.5 px-4 font-medium border-b border-[#E6D8C5]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#6B352A] animate-pulse" />
            <strong className="text-[#2B211D]">PETER Online Book Store:</strong> Curated Academic &amp; Classic Literature for Readers
          </span>
          <button
            onClick={onOpenAssessmentDocs}
            className="text-[11px] text-[#6B352A] hover:text-[#4D251F] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assessment &amp; Demo Guide</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* 1. Logo (Always visible on Left) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#2B211D] hover:opacity-95 transition shrink-0 group"
          aria-label="PETER Online Book Store Home"
        >
          <div className="w-9 h-9 rounded-xl bg-[#6B352A] text-white flex items-center justify-center shadow-xs font-bold shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2B211D] block font-editorial group-hover:text-[#6B352A] transition leading-none">
              PETER
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#75665D] font-semibold block mt-0.5">
              Online Book Store
            </span>
          </div>
        </Link>

        {/* 2. Desktop Search Bar (Hidden on mobile <768px) */}
        {onSearchChange && (
          <div className="hidden md:flex flex-1 max-w-md mx-2 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFFFFF] text-xs text-[#2B211D] placeholder-[#75665D]/70 focus:outline-hidden focus:ring-2 focus:ring-[#6B352A] focus:border-[#6B352A] transition shadow-2xs"
              aria-label="Search books"
            />
            <Search className="w-4 h-4 text-[#75665D] absolute left-3.5 top-2.5" />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-[#75665D] hover:text-[#2B211D] text-xs px-1 cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Desktop Navigation Items: Catalogue | Saved | Orders | Cart | Guide | Sign In */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {/* 3. Catalogue */}
          <Link
            to="/"
            className={cn(
              'text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition select-none',
              isHomeActive
                ? 'text-[#6B352A] bg-[#FFF1A6]/60 border border-[#6B352A]/30 shadow-xs'
                : 'text-[#75665D] hover:text-[#2B211D] hover:bg-[#FFFFFF]'
            )}
            aria-current={isHomeActive ? 'page' : undefined}
          >
            <BookOpen className="w-4 h-4" />
            <span>Catalogue</span>
          </Link>

          {/* 4. Saved (heart) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className={cn(
              'relative text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer select-none',
              isSavedActive
                ? 'text-[#6B352A] bg-[#FFF1A6]/60 border border-[#6B352A]/30 shadow-xs'
                : 'text-[#75665D] hover:text-[#6B352A] hover:bg-[#FFFFFF]'
            )}
            aria-label={`View reading wishlist with ${wishlistCount} items`}
            title="Reading Wishlist"
          >
            <Heart className={cn('w-4 h-4', wishlistCount > 0 ? 'fill-[#6B352A]/20' : '')} />
            <span>Saved</span>
            {wishlistCount > 0 && (
              <span className="ml-0.5 bg-[#6B352A] text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 5. Orders */}
          <Link
            to="/orders"
            className={cn(
              'text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition select-none',
              isOrdersActive
                ? 'text-[#6B352A] bg-[#FFF1A6]/60 border border-[#6B352A]/30 shadow-xs'
                : 'text-[#75665D] hover:text-[#2B211D] hover:bg-[#FFFFFF]'
            )}
            aria-current={isOrdersActive ? 'page' : undefined}
          >
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </Link>

          {/* 6. Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
              'relative text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer select-none',
              isCartActive
                ? 'text-[#6B352A] bg-[#FFF1A6]/60 border border-[#6B352A]/30 shadow-xs'
                : 'text-[#75665D] hover:text-[#2B211D] hover:bg-[#FFFFFF]'
            )}
            aria-label={`View shopping cart with ${cart.totalQuantity} items`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cart.totalQuantity > 0 && (
              <span className="ml-0.5 bg-[#6B352A] text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs">
                {cart.totalQuantity}
              </span>
            )}
          </button>

          {/* 7. Guide */}
          <button
            onClick={onOpenAssessmentDocs}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-[#75665D] hover:text-[#6B352A] hover:bg-[#FFFFFF] transition flex items-center gap-1.5 cursor-pointer"
            title="Evaluation & Assessment Guide"
          >
            <FileText className="w-3.5 h-3.5 text-[#6B352A]" />
            <span>Guide</span>
          </button>

          {/* 8. Sign In / User Auth Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FFFFFF] transition cursor-pointer border border-[#E6D8C5] bg-[#FFFFFF]"
                aria-label="Customer profile menu"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-7 h-7 rounded-lg bg-[#6B352A] text-white font-bold flex items-center justify-center text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-[#2B211D] max-w-[100px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#75665D]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] text-[#2B211D] rounded-xl shadow-xl border border-[#E6D8C5] py-2 z-50 animate-in fade-in-50">
                  <div className="px-4 py-2 border-b border-[#E6D8C5] bg-[#FFF8E8]">
                    <p className="text-[10px] text-[#75665D] uppercase font-bold tracking-wider">Signed in as</p>
                    <p className="text-xs font-bold text-[#2B211D] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#75665D] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#2B211D] hover:bg-[#FFF8E8] hover:text-[#6B352A] transition"
                  >
                    <Package className="w-4 h-4 text-[#6B352A]" />
                    <span>Order History</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#2B211D] hover:bg-[#FFF8E8] hover:text-[#6B352A] transition cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[#6B352A]" />
                    <span>Saved Books ({wishlistCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#A52D2D] hover:bg-[#A52D2D]/10 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleQuickDemoLogin}
                className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#FFF8E8] text-[#75665D] hover:text-[#2B211D] border border-[#E6D8C5] transition cursor-pointer shadow-2xs"
                title="Sign in instantly with test account demo@bookstore.test"
              >
                Demo
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#6B352A] text-white hover:bg-[#4D251F] transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Top Bar Controls: Strictly Logo | Search icon | Cart icon (<768px) */}
        <div className="flex items-center gap-1 md:hidden">
          {/* Search Toggle Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={cn(
              'p-2 rounded-xl transition cursor-pointer',
              mobileSearchOpen ? 'text-[#6B352A] bg-[#FFF1A6]/50' : 'text-[#75665D] hover:text-[#2B211D]'
            )}
            aria-label="Toggle search bar"
            title="Search books"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
              'relative p-2 rounded-xl transition cursor-pointer',
              isCartActive ? 'text-[#6B352A] bg-[#FFF1A6]/50' : 'text-[#75665D] hover:text-[#2B211D]'
            )}
            aria-label={`View shopping cart with ${cart.totalQuantity} items`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6B352A] text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {cart.totalQuantity}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Expandable Search Bar (clean dropdown right beneath top bar) */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2.5 bg-[#FFFFFF] border-t border-[#E6D8C5] flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <div className="relative flex-1">
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search books by title, author..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#E6D8C5] bg-[#FFF8E8] text-xs text-[#2B211D] placeholder-[#75665D]/70 focus:outline-hidden focus:ring-1 focus:ring-[#6B352A]"
              aria-label="Search books on mobile"
            />
            <Search className="w-4 h-4 text-[#75665D] absolute left-3 top-2.5" />
            {searchTerm && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-2.5 top-2.5 text-[#75665D] hover:text-[#2B211D] text-xs px-1 cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="text-xs text-[#75665D] hover:text-[#2B211D] px-2 py-1.5 cursor-pointer font-semibold"
          >
            Done
          </button>
        </div>
      )}
    </header>
  );
};
