import React, { useState, useEffect, useRef } from 'react';
import { X, Star, ShoppingBag, AlertCircle, CheckCircle2, ShieldCheck, Truck, Heart } from 'lucide-react';
import { Book } from '../types';
import { formatCurrency } from '../utils/cartCalculations';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const { cart, addToCart, isLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedQty, setSelectedQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (book) {
      setSelectedQty(1);
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [book, onClose]);

  if (!book) return null;

  const cartItem = cart.items.find((item) => item.book._id === book._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const remainingAvailable = Math.max(0, book.stock - qtyInCart);
  const isOutOfStock = book.stock <= 0;
  const cannotAddMore = remainingAvailable <= 0;
  const inWishlist = isInWishlist(book._id);

  const handleQtyChange = (delta: number) => {
    const next = selectedQty + delta;
    if (next >= 1 && next <= remainingAvailable) {
      setSelectedQty(next);
    }
  };

  const handleAddToCart = async () => {
    if (cannotAddMore) return;
    const success = await addToCart(book._id, selectedQty);
    if (success) {
      setSelectedQty(1);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1100] overflow-y-auto bg-[#2B211D]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
    >
      <div className="relative bg-[#FFFFFF] text-[#2B211D] rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E6D8C5] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#FFF8E8] hover:bg-[#E6D8C5] text-[#2B211D] flex items-center justify-center transition cursor-pointer border border-[#E6D8C5] shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Cover Side */}
          <div className="relative bg-[#FFF8E8] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E6D8C5]">
            {!imgError && book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                onError={() => setImgError(true)}
                className="max-h-72 w-auto rounded-lg shadow-md object-cover border border-[#E6D8C5]"
              />
            ) : (
              <div className="w-48 h-64 rounded-lg bg-gradient-to-br from-[#4D251F] via-[#6B352A] to-[#2B211D] p-5 flex flex-col justify-between text-white shadow-xl relative border border-[#E6D8C5]">
                <div className="w-2 absolute top-0 bottom-0 left-0 bg-white/10 border-r border-white/20 rounded-l-lg" />
                <div className="pl-2.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFF1A6] block mb-2">
                    {book.category}
                  </span>
                  <h3 className="font-editorial font-bold text-base leading-snug text-white">
                    {book.title}
                  </h3>
                </div>
                <div className="pl-2.5 text-xs text-[#E6D8C5]">
                  by {book.author}
                </div>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[11px] text-[#75665D] bg-[#FFFFFF]/90 px-3 py-1.5 rounded-lg border border-[#E6D8C5] shadow-2xs font-medium">
              <span>Category: <strong className="text-[#2B211D]">{book.category}</strong></span>
              {book.isbn && <span>ISBN: <strong className="text-[#2B211D]">{book.isbn}</strong></span>}
            </div>
          </div>

          {/* Details & Actions Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[#6B352A] text-xs font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-[#2B211D]">{book.rating || 4.8}</span>
                  <span className="text-[#75665D]">/ 5.0</span>
                </div>
                <button
                  onClick={() => toggleWishlist(book)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    inWishlist
                      ? 'bg-[#6B352A]/10 text-[#6B352A] border border-[#6B352A]/30'
                      : 'text-[#75665D] hover:text-[#2B211D]'
                  }`}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  <span>{inWishlist ? 'Wishlisted' : 'Save'}</span>
                </button>
              </div>

              <h2 id="modal-book-title" className="text-xl sm:text-2xl font-bold font-editorial text-[#2B211D] leading-tight">
                {book.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B352A] mt-1 mb-4 font-semibold">
                by {book.author}
              </p>

              {/* Stock Status Badge */}
              <div className="mb-4">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#A52D2D]/15 text-[#A52D2D] border border-[#A52D2D]/30">
                    <AlertCircle className="w-4 h-4" />
                    <span>Currently out of stock</span>
                  </span>
                ) : remainingAvailable <= 2 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1A6] text-[#6B352A] border border-[#E6D8C5]">
                    <AlertCircle className="w-4 h-4 text-[#6B352A]" />
                    <span>Low stock: Only {book.stock} left in bookstore</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#286647]/15 text-[#286647] border border-[#286647]/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In stock: {book.stock} available ({qtyInCart > 0 ? `${qtyInCart} in cart` : 'ready to ship'})</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="text-xs text-[#75665D] leading-relaxed max-h-32 overflow-y-auto pr-1">
                {book.description}
              </div>
            </div>

            {/* Price & Cart Form */}
            <div className="pt-5 mt-4 border-t border-[#E6D8C5]">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#75665D] block font-medium">Price</span>
                  <span className="text-2xl font-bold font-editorial text-[#2B211D]">
                    {formatCurrency(book.price)}
                  </span>
                </div>
                {!isOutOfStock && remainingAvailable > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#75665D] block font-medium">Subtotal</span>
                    <span className="text-lg font-bold text-[#2B211D] font-editorial">
                      {formatCurrency(book.price * selectedQty)}
                    </span>
                  </div>
                )}
              </div>

              {!isOutOfStock && remainingAvailable > 0 && (
                <div className="flex items-center justify-between mb-4 bg-[#FFF8E8] p-2.5 rounded-xl border border-[#E6D8C5]">
                  <span className="text-xs font-semibold text-[#75665D]">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(-1)}
                      disabled={selectedQty <= 1}
                      className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E6D8C5] text-[#2B211D] font-bold hover:bg-[#FFF8E8] disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer shadow-2xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-[#2B211D]">
                      {selectedQty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      disabled={selectedQty >= remainingAvailable}
                      className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E6D8C5] text-[#2B211D] font-bold hover:bg-[#FFF8E8] disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer shadow-2xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || cannotAddMore || isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs bg-[#6B352A] text-white hover:bg-[#4D251F] disabled:bg-[#E6D8C5]/50 disabled:text-[#75665D]/50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isOutOfStock
                    ? 'Unavailable - Out of stock'
                    : cannotAddMore
                    ? `Max Stock in Cart (${qtyInCart})`
                    : `Add to Cart • ${formatCurrency(book.price * selectedQty)}`}
                </span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-[#75665D]">
                <span className="flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#6B352A]" />
                  Free shipping over $35
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#286647]" />
                  Atomic inventory lock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
