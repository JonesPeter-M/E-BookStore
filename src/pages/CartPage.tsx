import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, calculateCartTotals } from '../utils/cartCalculations';
import { BookThumbnail } from '../components/BookThumbnail';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const totals = calculateCartTotals(
    cart.items.map((i) => ({ price: i.book.price, quantity: i.quantity }))
  );

  const freeShippingThreshold = 35.0;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - totals.subtotal);
  const freeShippingProgress = Math.min(100, (totals.subtotal / freeShippingThreshold) * 100);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8E8] text-[#2B211D]">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] text-[#6B352A] flex items-center justify-center mb-4 border border-[#E6D8C5] shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-editorial text-[#2B211D] mb-2">
          Sign In to Access Your Cart
        </h2>
        <p className="text-xs text-[#75665D] max-w-sm mb-6">
          Your course books and cart items are stored securely for your customer account.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-xl bg-[#6B352A] text-white font-bold text-xs hover:bg-[#4D251F] transition shadow-xs cursor-pointer"
        >
          Sign In or Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#2B211D] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75665D] hover:text-[#6B352A] transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </Link>

        <h1 className="text-3xl font-bold font-editorial text-[#2B211D] mb-8 flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-[#6B352A]" />
          <span>Your Shopping Cart</span>
          {cart.totalQuantity > 0 && (
            <span className="text-xs font-sans font-semibold px-3 py-1 rounded-full bg-[#6B352A]/10 text-[#6B352A] border border-[#6B352A]/20">
              {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}
            </span>
          )}
        </h1>

        {cart.items.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border border-[#E6D8C5] max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF8E8] text-[#75665D] flex items-center justify-center mx-auto mb-4 border border-[#E6D8C5]">
              <ShoppingBag className="w-10 h-10 opacity-40 text-[#6B352A]" />
            </div>
            <h2 className="text-xl font-bold font-editorial text-[#2B211D] mb-1">Your cart is empty</h2>
            <p className="text-xs text-[#75665D] mb-6 max-w-xs mx-auto">
              You don’t have any books in your cart yet. Explore our curated bestsellers and classic literature!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition shadow-xs"
            >
              <span>Browse Book Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping banner in Soft Butter accent */}
              <div className="bg-[#FFF1A6]/50 p-4 rounded-xl border border-[#E6D8C5] shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#2B211D] font-medium mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs text-[#2B211D] font-semibold">
                    <Truck className="w-4 h-4 text-[#6B352A]" />
                    {amountForFreeShipping > 0
                      ? `Add ${formatCurrency(amountForFreeShipping)} more to qualify for FREE student shipping!`
                      : '🎉 You have unlocked FREE shipping on this order!'}
                  </span>
                  <span className="font-bold text-[#6B352A]">
                    {amountForFreeShipping <= 0 ? 'Qualified' : `${Math.round(freeShippingProgress)}%`}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#E6D8C5]">
                  <div
                    className="h-full bg-[#6B352A] rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6D8C5] shadow-xs overflow-hidden divide-y divide-[#E6D8C5]">
                {cart.items.map((item) => {
                  const book = item.book;
                  const isAtMaxStock = item.quantity >= book.stock;
                  return (
                    <div key={book._id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <BookThumbnail
                        src={book.coverImage}
                        title={book.title}
                        category={book.category}
                        className="w-20 h-28 rounded-xl border border-[#E6D8C5] shadow-xs shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B352A]">
                          {book.category}
                        </span>
                        <h3 className="font-editorial font-bold text-[#2B211D] text-base leading-snug truncate">
                          {book.title}
                        </h3>
                        <p className="text-xs text-[#75665D] mb-2 font-medium">by {book.author}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-[#2B211D] font-editorial">
                            {formatCurrency(book.price)} each
                          </span>
                          <span className="text-[#E6D8C5]">•</span>
                          <span className="text-[#75665D]">
                            Available Stock: <strong className="text-[#2B211D]">{book.stock}</strong>
                          </span>
                        </div>
                        {isAtMaxStock && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B352A] bg-[#FFF1A6] px-2.5 py-0.5 rounded-md mt-2 border border-[#E6D8C5]">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Reached max available stock ({book.stock})</span>
                          </div>
                        )}
                      </div>

                      {/* Controls and subtotal */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E6D8C5]">
                        <div className="flex items-center border border-[#E6D8C5] rounded-xl bg-[#FFF8E8] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(book._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="px-2.5 py-1.5 text-[#2B211D] hover:bg-[#FFFFFF] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            aria-label={`Decrease ${book.title} quantity`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#2B211D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(book._id, item.quantity + 1)}
                            disabled={isAtMaxStock || isLoading}
                            className="px-2.5 py-1.5 text-[#2B211D] hover:bg-[#FFFFFF] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                            aria-label={`Increase ${book.title} quantity`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#75665D] block uppercase tracking-wider font-semibold">Item Subtotal</span>
                          <span className="text-base font-bold font-editorial text-[#2B211D]">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(book._id)}
                          disabled={isLoading}
                          className="text-[#75665D] hover:text-[#A52D2D] p-1.5 transition cursor-pointer"
                          aria-label={`Remove ${book.title} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs text-[#75665D] pt-2 px-2">
                <button
                  onClick={clearCart}
                  disabled={isLoading}
                  className="hover:text-[#A52D2D] transition underline cursor-pointer"
                >
                  Clear all items from cart
                </button>
                <Link to="/" className="text-[#6B352A] hover:text-[#4D251F] hover:underline font-semibold">
                  + Add more books from catalogue
                </Link>
              </div>
            </div>

            {/* Summary Column */}
            <div className="space-y-4">
              <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E6D8C5] shadow-xs space-y-4">
                <h2 className="text-lg font-bold font-editorial text-[#2B211D] border-b border-[#E6D8C5] pb-3">
                  Order Summary
                </h2>
                <div className="space-y-2 text-xs text-[#75665D]">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({totals.totalQuantity})</span>
                    <span className="font-semibold text-[#2B211D]">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Standard Shipping</span>
                    <span>
                      {totals.shipping === 0 ? (
                        <span className="text-[#286647] font-bold uppercase tracking-wider text-[10px] bg-[#286647]/10 px-2 py-0.5 rounded border border-[#286647]/20">
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
                  <div className="pt-3 border-t border-[#E6D8C5] flex justify-between items-baseline font-bold text-[#2B211D]">
                    <span className="text-sm">Estimated Total</span>
                    <span className="text-xl font-editorial text-[#2B211D]">
                      {formatCurrency(totals.orderTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 border-t border-[#E6D8C5] space-y-2 text-[11px] text-[#75665D]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#286647] shrink-0" />
                    <span>Database price verification on order submission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#6B352A] shrink-0" />
                    <span>Free shipping on all student orders over $35</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
