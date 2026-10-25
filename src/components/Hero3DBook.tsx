import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ShoppingBag, Eye, Star } from 'lucide-react';
import { Book } from '../types';
import { formatCurrency } from '../utils/cartCalculations';

interface Hero3DBookProps {
  featuredBook?: Book | null;
  onQuickView?: (book: Book) => void;
  onAddToCart?: (bookId: string) => void;
}

export const Hero3DBook: React.FC<Hero3DBookProps> = ({
  featuredBook,
  onQuickView,
  onAddToCart,
}) => {
  const [rotateX, setRotateX] = useState(-8);
  const [rotateY, setRotateY] = useState(16);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 18;
    setRotateY((x / (rect.width / 2)) * maxTilt);
    setRotateX(-(y / (rect.height / 2)) * maxTilt);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(-8);
    setRotateY(16);
  };

  // Fallback book metadata if featuredBook isn't loaded yet
  const title = featuredBook?.title || 'The Pragmatic Programmer: Your Journey to Mastery';
  const author = featuredBook?.author || 'David Thomas, Andrew Hunt';
  const category = featuredBook?.category || 'Technology';
  const price = featuredBook?.price || 42.5;
  const rating = featuredBook?.rating || 4.9;

  return (
    <div
      className="relative flex flex-col items-center justify-center p-4 sm:p-8 select-none"
      aria-label="3D Featured Book Showcase"
    >
      {/* Ambient background pedestal glow and warm reading light */}
      <div className="absolute w-80 h-80 sm:w-110 sm:h-110 rounded-full night-library-pedestal blur-2xl pointer-events-none" />
      <div className="absolute w-64 sm:w-80 h-28 sm:h-36 -bottom-2 rounded-full border border-[#6B352A]/15 pointer-events-none opacity-60" style={{ transform: 'rotateX(75deg)' }} />
      <div className="absolute w-48 sm:w-60 h-20 sm:h-28 -bottom-1 rounded-full border border-[#E6D8C5] pointer-events-none opacity-70" style={{ transform: 'rotateX(75deg)' }} />

      {/* 3D Stage Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative perspective-1000 cursor-pointer py-6 group"
        onClick={() => featuredBook && onQuickView && onQuickView(featuredBook)}
      >
        {/* Book shadow on pedestal */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-12 bg-[#2B211D]/40 rounded-full blur-xl transition-all duration-300"
          style={{
            transform: `translateX(-50%) rotateX(75deg) scale(${isHovered ? 1.08 : 1})`,
            opacity: isHovered ? 0.95 : 0.75,
          }}
        />

        {/* 3D Rotatable Hardcover Book */}
        <div
          className="relative w-52 sm:w-64 h-72 sm:h-88 rounded-r-xl rounded-l-sm transition-transform duration-200 ease-out transform-style-3d shadow-2xl"
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.04 : 1})`,
            transformOrigin: 'left center',
          }}
        >
          {/* Front Cover Front-Face */}
          <div className="absolute inset-0 rounded-r-xl rounded-l-sm bg-gradient-to-br from-[#4D251F] via-[#6B352A] to-[#2B211D] border-t border-r border-b border-[#4D251F] p-5 sm:p-6 flex flex-col justify-between text-white overflow-hidden book-shadow">
            {/* Book Spine Hinge Highlight */}
            <div className="absolute top-0 bottom-0 left-0 w-4 book-spine-gradient border-r border-white/10" />

            {/* Subtle decorative gold-foil geometric stamping */}
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full border border-[#FFF1A6]/20 pointer-events-none" />
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full border border-[#FFF1A6]/20 pointer-events-none" />

            {/* Top metadata */}
            <div className="pl-3 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFF1A6] bg-[#FFF1A6]/15 px-2 py-0.5 rounded border border-[#FFF1A6]/30">
                  {category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#FFF1A6] font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rating}</span>
                </span>
              </div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold leading-tight text-white line-clamp-3">
                {title}
              </h3>
            </div>

            {/* Center editorial ornament */}
            <div className="pl-3 py-2 my-auto relative z-10">
              <div className="w-10 h-0.5 bg-gradient-to-r from-[#FFF1A6] to-transparent mb-2" />
              <p className="text-xs text-[#E6D8C5] font-medium italic">
                by {author}
              </p>
            </div>

            {/* Bottom price tag & stamp */}
            <div className="pl-3 pt-3 border-t border-white/20 flex items-center justify-between relative z-10">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#E6D8C5] block font-medium">Reader Edition</span>
                <span className="font-editorial text-lg font-bold text-white">
                  {formatCurrency(price)}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#FFF1A6]/20 border border-[#FFF1A6]/40 text-[#FFF1A6] flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* Right Page Edge (3D depth simulation) */}
          <div
            className="absolute top-1 bottom-1 right-0 w-5 rounded-r-xs book-pages-effect border-t border-b border-r border-[#E6D8C5] pointer-events-none"
            style={{
              transform: 'translateX(95%) rotateY(90deg)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>

      {/* Action buttons — same width as the card, aligned left/right edges */}
      {featuredBook && (
        <div
          className="mt-4 relative z-20 flex flex-col sm:flex-row gap-[12px] w-52 sm:w-64"
          aria-label="Featured book actions"
        >
          {onQuickView && (
            <button
              onClick={() => onQuickView(featuredBook)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF8E8] text-[#2B211D] text-xs font-semibold border border-[#E6D8C5] transition shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B352A]"
              style={{ minHeight: '44px' }}
              aria-label={`Quick view ${featuredBook.title}`}
            >
              <Eye className="w-3.5 h-3.5 text-[#6B352A]" aria-hidden="true" />
              <span>Quick View</span>
            </button>
          )}
          {onAddToCart && featuredBook.stock > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(featuredBook._id);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white text-xs font-bold transition shadow-xs cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF1A6]"
              style={{ minHeight: '44px' }}
              aria-label={`Add ${featuredBook.title} to cart — ${formatCurrency(price)}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Featured ({formatCurrency(price)})</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
