import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency, calculateCartTotals } from '../utils/cartCalculations';
import { BookThumbnail } from './BookThumbnail';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isCartOpen) {
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsCartOpen(false);
      };
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const totals = calculateCartTotals(
    cart.items.map((i) => ({ price: i.book.price, quantity: i.quantity }))
  );

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingThreshold = 35.0;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);
  const freeShippingProgress = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[1100] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-heading">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2B211D]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] text-[#2B211D] shadow-2xl flex flex-col border-l border-[#E6D8C5] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E6D8C5] flex items-center justify-between bg-[#FFF8E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6B352A]/10 text-[#6B352A] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 id="cart-drawer-heading" className="text-base font-bold font-editorial text-[#2B211D]">
                  Shopping Cart
                </h2>
                <span className="text-[11px] text-[#75665D]">
                  {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
            <button
              ref={closeBtnRef}
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-[#75665D] hover:text-[#2B211D] hover:bg-[#FFF8E8] transition cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cart.items.length > 0 && (
            <div className="px-5 py-3 bg-[#FFF1A6]/50 border-b border-[#E6D8C5] text-xs">
              <div className="flex items-center justify-between text-[#2B211D] font-medium mb-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <Truck className="w-3.5 h-3.5 text-[#6B352A]" />
                  {amountForFreeShipping > 0
                    ? `Add ${formatCurrency(amountForFreeShipping)} more for FREE student shipping!`
                    : '🎉 You unlocked FREE standard delivery!'}
                </span>
                <span className="font-bold text-[#6B352A] text-[11px]">
                  {amountForFreeShipping <= 0 ? 'Qualified' : `${Math.round(freeShippingProgress)}%`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#E6D8C5]">
                <div
                  className="h-full bg-[#6B352A] rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E6D8C5]">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#75665D]">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF8E8] text-[#6B352A] flex items-center justify-center mb-4 border border-[#E6D8C5]">
                  <ShoppingBag className="w-8 h-8 opacity-40 text-[#6B352A]" />
                </div>
                <h3 className="font-editorial text-lg text-[#2B211D] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#75665D] max-w-xs mb-6">
                  Explore curated textbooks, fiction, and philosophy for student courses.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition shadow-xs cursor-pointer"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              cart.items.map((item) => {
                const book = item.book;
                const isAtMaxStock = item.quantity >= book.stock;
                return (
                  <div key={book._id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0 items-start">
                    <BookThumbnail
                      src={book.coverImage}
                      title={book.title}
                      category={book.category}
                      className="w-16 h-22 rounded-lg shadow-2xs border border-[#E6D8C5] shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-editorial font-bold text-[#2B211D] text-sm line-clamp-1 leading-snug">
                            {book.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(book._id)}
                            disabled={isLoading}
                            className="text-[#75665D] hover:text-[#A52D2D] transition p-1 cursor-pointer"
                            aria-label={`Remove ${book.title} from cart`}
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#75665D]">{book.author}</p>
                        <span className="text-xs font-bold text-[#2B211D] font-editorial mt-0.5 block">
                          {formatCurrency(book.price)} each
                        </span>
                      </div>

                      {isAtMaxStock && (
                        <div className="flex items-center gap-1 text-[10px] text-[#6B352A] bg-[#FFF1A6] px-2 py-0.5 rounded-md mt-1 border border-[#E6D8C5]">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>Max available stock reached ({book.stock})</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 mt-2">
                        <div className="flex items-center border border-[#E6D8C5] rounded-lg bg-[#FFF8E8] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(book._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="px-2 py-1 text-[#2B211D] hover:bg-[#FFFFFF] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            aria-label={`Decrease quantity of ${book.title}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#2B211D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(book._id, item.quantity + 1)}
                            disabled={isAtMaxStock || isLoading}
                            className="px-2 py-1 text-[#2B211D] hover:bg-[#FFFFFF] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            aria-label={`Increase quantity of ${book.title}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-[#2B211D] text-sm font-editorial">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.items.length > 0 && (
            <div className="p-5 border-t border-[#E6D8C5] bg-[#FFF8E8] space-y-3">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-[#75665D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2B211D]">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? (
                      <span className="text-[#286647] font-bold uppercase tracking-wider text-[10px] bg-[#286647]/10 px-1.5 py-0.5 rounded border border-[#286647]/20">
                        FREE
                      </span>
                    ) : (
                      formatCurrency(totals.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>{formatCurrency(totals.estimatedTax)}</span>
                </div>
                <div className="pt-2 border-t border-[#E6D8C5] flex justify-between items-baseline font-bold text-sm text-[#2B211D]">
                  <span>Total</span>
                  <span className="text-lg text-[#2B211D] font-editorial">
                    {formatCurrency(totals.orderTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF8E8] text-[#2B211D] border border-[#E6D8C5] text-xs font-semibold flex items-center justify-center transition text-center shadow-2xs"
                >
                  View Full Cart Page
                </Link>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#75665D] pt-1">
                <button
                  onClick={clearCart}
                  disabled={isLoading}
                  className="hover:text-[#A52D2D] transition cursor-pointer underline text-[10px]"
                >
                  Clear cart
                </button>
                <span className="flex items-center gap-1 text-[10px] text-[#286647] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Prices validated on server
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
