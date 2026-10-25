import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, Package, ShoppingBag, LucideIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { isDockItemActive, getMascotHoverMessage } from './floatingDockHelpers';

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface DockItem {
  name: string;
  url?: string;
  icon: LucideIcon;
  badge?: number;
  onClick?: () => void;
  ariaLabel: string;
}

interface FloatingDockProps {
  className?: string;
  showMascot?: boolean;
}

export function FloatingDock({ className, showMascot = true }: FloatingDockProps) {
  const location = useLocation();
  const { cart, setIsCartOpen, isCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen, isWishlistOpen } = useWishlist();

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion media query and handle runtime changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Bottom navigation items: Home | Saved | Orders | Cart (4 items only)
  const items: DockItem[] = [
    {
      name: 'Home',
      url: '/',
      icon: Home,
      ariaLabel: 'Navigate to Book Store Home',
    },
    {
      name: 'Saved',
      url: '/?saved=1',
      icon: Heart,
      badge: wishlistCount,
      onClick: () => setIsWishlistOpen(true),
      ariaLabel: `Reading Wishlist (${wishlistCount} saved)`,
    },
    {
      name: 'Orders',
      url: '/orders',
      icon: Package,
      ariaLabel: 'Customer Order History & Receipts',
    },
    {
      name: 'Cart',
      icon: ShoppingBag,
      badge: cart.totalQuantity,
      onClick: () => setIsCartOpen(true),
      ariaLabel: `Shopping Cart (${cart.totalQuantity} items)`,
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[1000] md:hidden bg-[#FFFFFF]/98 backdrop-blur-xl border-t border-[#E6D8C5] shadow-[0_-4px_25px_rgba(43,33,29,0.08)]',
        className
      )}
      style={{
        paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="grid grid-cols-4 max-w-md mx-auto items-stretch h-15 relative">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isDockItemActive({
            itemName: item.name,
            url: item.url,
            pathname: location.pathname,
            search: location.search,
            isWishlistOpen,
            isCartOpen,
          });

          const buttonContent = (
            <div className="flex flex-col items-center justify-center gap-0.5 w-full h-full py-1 relative">
              {/* Active top indicator in Clay Brown */}
              {isActive && (
                <motion.div
                  layoutId="active-mobile-dock-indicator"
                  className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-[#6B352A] rounded-full shadow-[0_0_8px_rgba(107,53,42,0.4)]"
                  initial={false}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.05 }
                      : { type: 'spring', stiffness: 350, damping: 30 }
                  }
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={cn(
                    'transition-colors duration-150',
                    isActive ? 'text-[#6B352A]' : 'text-[#75665D]'
                  )}
                />

                {/* Badge for Saved or Cart */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] font-bold px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center shadow-xs leading-none bg-[#6B352A] text-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Item Label */}
              <span
                className={cn(
                  'text-[10px] tracking-tight transition-colors duration-150',
                  isActive ? 'text-[#2B211D] font-bold' : 'text-[#75665D]'
                )}
              >
                {item.name}
              </span>

              {/* Mascot perched above active tab on mobile */}
              {showMascot && isActive && (
                <motion.div
                  layoutId="mobile-mascot"
                  className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none"
                  initial={false}
                  aria-hidden="true"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.05 }
                      : { type: 'spring', stiffness: 320, damping: 28 }
                  }
                >
                  <div className="relative w-8 h-8 flex flex-col items-center">
                    {/* Speech Reaction Bubble when hovered/tapped */}
                    <AnimatePresence>
                      {hoveredTab && (
                        <motion.div
                          key={hoveredTab}
                          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 3, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 3, scale: 0.85 }}
                          transition={{ duration: 0.12 }}
                          className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFFFF] text-[#2B211D] border border-[#E6D8C5] shadow-lg pointer-events-none z-30"
                        >
                          {getMascotHoverMessage(hoveredTab)}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mascot Head Body (Warm Bookstore Mascot) */}
                    <div className="relative w-7 h-7 bg-[#FFF8E8] rounded-full shadow-md border border-[#6B352A]/40 flex items-center justify-center overflow-visible">
                      {/* Ears in Clay Brown */}
                      <div className="absolute -top-1 left-0.5 w-2 h-2 bg-[#6B352A] rounded-tl-full -rotate-12 border-t border-l border-[#4D251F]">
                        <div className="w-1 h-1 bg-[#FFF1A6] rounded-tl-full ml-0.5 mt-0.5" />
                      </div>
                      <div className="absolute -top-1 right-0.5 w-2 h-2 bg-[#6B352A] rounded-tr-full rotate-12 border-t border-r border-[#4D251F]">
                        <div className="w-1 h-1 bg-[#FFF1A6] rounded-tr-full mr-0.5 mt-0.5" />
                      </div>

                      {/* Eyes in Deep Espresso */}
                      <div className="absolute w-1 h-1 bg-[#2B211D] rounded-full left-[26%] top-[38%]" />
                      <div className="absolute w-1 h-1 bg-[#2B211D] rounded-full right-[26%] top-[38%]" />

                      {/* Cheeks in soft warm rose */}
                      <div className="absolute w-1 h-0.5 bg-[#9B3D32]/50 rounded-full left-[18%] top-[54%]" />
                      <div className="absolute w-1 h-0.5 bg-[#9B3D32]/50 rounded-full right-[18%] top-[54%]" />

                      {/* Smile */}
                      <div className="absolute w-2 h-0.5 border-b border-[#2B211D] rounded-full left-[36%] top-[56%]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          );

          const tabClasses = cn(
            'relative cursor-pointer transition-colors duration-150 select-none flex items-center justify-center min-h-[44px]',
            'focus-visible:outline-2 focus-visible:outline-[#6B352A] focus-visible:outline-offset-1',
            isActive ? 'text-[#2B211D]' : 'text-[#75665D] hover:text-[#2B211D]'
          );

          if (item.onClick && !item.url) {
            return (
              <button
                key={item.name}
                type="button"
                onClick={item.onClick}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={tabClasses}
              >
                {buttonContent}
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.url || '/'}
              onClick={item.onClick}
              onMouseEnter={() => setHoveredTab(item.name)}
              onMouseLeave={() => setHoveredTab(null)}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={tabClasses}
            >
              {buttonContent}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
