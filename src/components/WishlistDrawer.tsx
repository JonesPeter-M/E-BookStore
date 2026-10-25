import React, { useEffect, useRef } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/cartCalculations';
import { BookThumbnail } from './BookThumbnail';

export const WishlistDrawer: React.FC = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key
  useEffect(() => {
    if (isWishlistOpen) {
      closeBtnRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsWishlistOpen(false);
        }
      };
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isWishlistOpen, setIsWishlistOpen]);

  if (!isWishlistOpen) return null;

  const handleMoveToCart = async (bookId: string) => {
    const success = await addToCart(bookId, 1);
    if (success) {
      removeFromWishlist(bookId);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="wishlist-drawer-title">
      <div
        className="absolute inset-0 bg-[#2B211D]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] text-[#2B211D] shadow-2xl flex flex-col border-l border-[#E6D8C5] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E6D8C5] flex items-center justify-between bg-[#FFF8E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6B352A]/10 text-[#6B352A] flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 id="wishlist-drawer-title" className="text-base font-bold font-editorial text-[#2B211D] tracking-wide">
                  Reading Wishlist
                </h2>
                <p className="text-[11px] text-[#75665D]">
                  {wishlist.length} {wishlist.length === 1 ? 'saved book' : 'saved books'}
                </p>
              </div>
            </div>
            <button
              ref={closeBtnRef}
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-[#75665D] hover:text-[#2B211D] hover:bg-[#FFF8E8] transition cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Local storage advisory */}
          <div className="px-5 py-2.5 bg-[#FFF8E8] border-b border-[#E6D8C5] text-[11px] text-[#75665D] flex items-center justify-between">
            <span>📚 Saved locally on this browser session</span>
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-[#A52D2D] hover:underline text-[10px] font-semibold cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E6D8C5]">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#75665D]">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF8E8] text-[#6B352A] flex items-center justify-center mb-4 border border-[#E6D8C5]">
                  <Heart className="w-8 h-8 opacity-40 text-[#6B352A]" />
                </div>
                <h3 className="font-editorial text-lg text-[#2B211D] mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-[#75665D] max-w-xs mb-6">
                  Save textbooks and classic literature while browsing to plan your reading list.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition cursor-pointer"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              wishlist.map((book) => {
                const isOutOfStock = book.stock <= 0;
                return (
                  <div key={book._id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0 items-start">
                    <BookThumbnail
                      src={book.coverImage}
                      title={book.title}
                      category={book.category}
                      className="w-16 h-22 rounded-lg shadow-2xs border border-[#E6D8C5] shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B352A] block">
                          {book.category}
                        </span>
                        <h4 className="font-editorial text-[#2B211D] text-sm leading-snug truncate font-bold" title={book.title}>
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#75665D]">by {book.author}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-bold text-[#2B211D] font-editorial">
                            {formatCurrency(book.price)}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isOutOfStock ? 'bg-[#A52D2D]/10 text-[#A52D2D]' : 'bg-[#286647]/10 text-[#286647]'
                          }`}>
                            {isOutOfStock ? 'Out of stock' : `${book.stock} in stock`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-[#E6D8C5]">
                        <button
                          onClick={() => handleMoveToCart(book._id)}
                          disabled={isOutOfStock}
                          className="px-3 py-1.5 rounded-lg bg-[#6B352A] hover:bg-[#4D251F] disabled:bg-[#E6D8C5]/50 disabled:text-[#75665D]/60 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(book._id)}
                          className="text-[#75665D] hover:text-[#A52D2D] p-1.5 transition cursor-pointer"
                          aria-label={`Remove ${book.title} from wishlist`}
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-[#E6D8C5] bg-[#FFF8E8] flex items-center justify-between">
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="text-xs text-[#75665D] hover:text-[#2B211D] transition font-medium"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => {
                  wishlist.forEach((b) => {
                    if (b.stock > 0) addToCart(b._id, 1);
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Add Available to Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
