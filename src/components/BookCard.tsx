import React, { useState } from 'react';
import { ShoppingBag, Star, AlertCircle, CheckCircle2, Eye, Heart } from 'lucide-react';
import { Book } from '../types';
import { formatCurrency } from '../utils/cartCalculations';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const { cart, addToCart, isLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const cartItem = cart.items.find((item) => item.book._id === book._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = book.stock <= 0;
  const isStockExhaustedInCart = !isOutOfStock && qtyInCart >= book.stock;
  const isLowStock = book.stock > 0 && book.stock <= 3;
  const inWishlist = isInWishlist(book._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || isStockExhaustedInCart) return;
    await addToCart(book._id, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(book);
  };

  return (
    <div
      onClick={() => onSelect(book)}
      className="group relative bg-[#FFFFFF] rounded-xl border border-[#E6D8C5] hover:border-[#6B352A]/60 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 24px 60px rgba(30,15,10,0.45), inset 0 0 0 1px rgba(255,255,255,0.15)',
      }}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#FFF8E8] overflow-hidden">
        {!imgError && book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full p-6 flex flex-col justify-between text-white relative overflow-hidden bg-gradient-to-br from-[#4D251F] via-[#6B352A] to-[#2B211D] group-hover:scale-105 transition-transform duration-500">
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-white/10 border-r border-white/20" />
            <div className="pl-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFF1A6] block mb-1">
                {book.category}
              </span>
              <h4 className="font-editorial font-bold text-sm leading-snug line-clamp-3 text-white">
                {book.title}
              </h4>
            </div>
            <div className="pl-3 text-[11px] text-[#E6D8C5] font-medium">
              by {book.author}
            </div>
          </div>
        )}

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition backdrop-blur-md cursor-pointer ${
            inWishlist
              ? 'bg-[#6B352A] text-white shadow-xs'
              : 'bg-white/85 text-[#75665D] hover:bg-white hover:text-[#6B352A] border border-[#E6D8C5] shadow-xs'
          }`}
          aria-label={inWishlist ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
          title={inWishlist ? 'Remove from wishlist' : 'Add to reading wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#A52D2D]/15 text-[#A52D2D] border border-[#A52D2D]/30 backdrop-blur-md">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Out of stock</span>
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFF1A6] text-[#6B352A] border border-[#E6D8C5] shadow-2xs backdrop-blur-md">
              <AlertCircle className="w-3.5 h-3.5 text-[#6B352A]" />
              <span>Only {book.stock} left!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#286647]/15 text-[#286647] border border-[#286647]/30 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{book.stock} in stock</span>
            </span>
          )}
        </div>

        {/* Quick View Hover Tag */}
        <div className="absolute inset-0 bg-[#2B211D]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/95 text-[#2B211D] font-semibold text-xs shadow-lg border border-[#E6D8C5]">
            <Eye className="w-3.5 h-3.5 text-[#6B352A]" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Book Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B352A]">
              {book.category}
            </span>
            <div className="flex items-center gap-1 text-[#6B352A] font-semibold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[#2B211D]">{book.rating || 4.8}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-editorial font-bold text-[#2B211D] text-base line-clamp-2 group-hover:text-[#6B352A] transition-colors leading-snug">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-[#75665D] mt-1 mb-2 font-medium">
            by {book.author}
          </p>

          {/* Description preview */}
          <p className="text-xs text-[#75665D] line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3.5 mt-3 border-t border-[#E6D8C5] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#75665D] block font-medium">Price</span>
            <span className="text-lg font-bold text-[#2B211D] font-editorial">
              {formatCurrency(book.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isStockExhaustedInCart || isLoading}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-[#E6D8C5]/50 text-[#75665D]/60 cursor-not-allowed border border-[#E6D8C5]'
                : isStockExhaustedInCart
                ? 'bg-[#FFF1A6] text-[#6B352A] border border-[#E6D8C5] cursor-not-allowed font-bold'
                : 'bg-[#6B352A] text-white hover:bg-[#4D251F] font-bold shadow-xs hover:shadow-md'
            }`}
            title={
              isOutOfStock
                ? 'Out of stock'
                : isStockExhaustedInCart
                ? `Reached max available stock (${book.stock}) in your cart`
                : 'Add to shopping cart'
            }
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              {isOutOfStock
                ? 'Sold Out'
                : isStockExhaustedInCart
                ? `In Cart (${qtyInCart})`
                : qtyInCart > 0
                ? `Add More (${qtyInCart})`
                : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
