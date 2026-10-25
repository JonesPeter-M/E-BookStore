import test from 'node:test';
import assert from 'node:assert/strict';
import { isDockItemActive, getMascotHoverMessage } from './floatingDockHelpers';

test('isDockItemActive determines Home state correctly', () => {
  assert.equal(
    isDockItemActive({
      itemName: 'Home',
      pathname: '/',
      search: '',
      isWishlistOpen: false,
      isCartOpen: false,
    }),
    true
  );

  // Home is not active if on another route
  assert.equal(
    isDockItemActive({
      itemName: 'Home',
      pathname: '/orders',
      search: '',
      isWishlistOpen: false,
      isCartOpen: false,
    }),
    false
  );

  // Home is not active if wishlist query or drawer is open
  assert.equal(
    isDockItemActive({
      itemName: 'Home',
      pathname: '/',
      search: '?saved=1',
      isWishlistOpen: true,
      isCartOpen: false,
    }),
    false
  );
});

test('isDockItemActive determines Orders state correctly', () => {
  assert.equal(
    isDockItemActive({
      itemName: 'Orders',
      pathname: '/orders',
      search: '',
      isWishlistOpen: false,
      isCartOpen: false,
    }),
    true
  );

  assert.equal(
    isDockItemActive({
      itemName: 'Orders',
      pathname: '/',
      search: '',
      isWishlistOpen: false,
      isCartOpen: false,
    }),
    false
  );
});

test('isDockItemActive determines Saved and Cart drawer states correctly', () => {
  // Cart drawer open makes Cart active
  assert.equal(
    isDockItemActive({
      itemName: 'Cart',
      pathname: '/',
      search: '',
      isWishlistOpen: false,
      isCartOpen: true,
    }),
    true
  );

  // Wishlist open makes Saved active
  assert.equal(
    isDockItemActive({
      itemName: 'Saved',
      pathname: '/',
      search: '',
      isWishlistOpen: true,
      isCartOpen: false,
    }),
    true
  );

  // Saved query param makes Saved active
  assert.equal(
    isDockItemActive({
      itemName: 'Saved',
      pathname: '/',
      search: '?saved=1',
      isWishlistOpen: false,
      isCartOpen: false,
    }),
    true
  );
});

test('getMascotHoverMessage returns distinct bookstore messages', () => {
  assert.equal(getMascotHoverMessage('Home'), 'Browse books 📚');
  assert.equal(getMascotHoverMessage('Saved'), 'Saved reads 💜');
  assert.equal(getMascotHoverMessage('Orders'), 'Track parcels 📦');
  assert.equal(getMascotHoverMessage('Cart'), 'Checkout bag 🛍️');
  assert.equal(getMascotHoverMessage('Unknown'), 'Happy reading! ✨');
});
