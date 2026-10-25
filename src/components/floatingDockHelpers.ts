/**
 * Pure helper utilities for the FloatingDock component
 */

export interface DockActiveStateParams {
  itemName: string;
  url?: string;
  pathname: string;
  search: string;
  isWishlistOpen: boolean;
  isCartOpen: boolean;
}

/**
 * Determines whether a given dock item should be marked active
 * based on current router location and modal/drawer open states.
 */
export function isDockItemActive({
  itemName,
  pathname,
  search,
  isWishlistOpen,
  isCartOpen,
}: DockActiveStateParams): boolean {
  if (itemName === 'Cart') {
    return isCartOpen;
  }
  if (itemName === 'Saved') {
    return isWishlistOpen || search.includes('saved=1');
  }
  if (itemName === 'Orders') {
    return pathname === '/orders';
  }
  if (itemName === 'Home') {
    return pathname === '/' && !search.includes('saved=1') && !isWishlistOpen && !isCartOpen;
  }
  return false;
}

/**
 * Returns the contextual speech/reaction message for the anime mascot
 * when the user hovers over an item.
 */
export function getMascotHoverMessage(tabName: string): string {
  switch (tabName) {
    case 'Home':
      return 'Browse books 📚';
    case 'Saved':
      return 'Saved reads 💜';
    case 'Orders':
      return 'Track parcels 📦';
    case 'Cart':
      return 'Checkout bag 🛍️';
    default:
      return 'Happy reading! ✨';
  }
}
