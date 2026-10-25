import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  validateQuantityChange,
  validateCustomerDetails,
  formatCurrency,
} from './cartCalculations';

test('calculateCartTotals calculates accurate subtotal and totalQuantity for empty cart', () => {
  const result = calculateCartTotals([]);
  assert.equal(result.subtotal, 0);
  assert.equal(result.totalQuantity, 0);
  assert.equal(result.shipping, 0);
  assert.equal(result.orderTotal, 0);
});

test('calculateCartTotals accurately computes prices with standard shipping below $35', () => {
  const items = [
    { price: 15.00, quantity: 2 }, // $30.00
  ];
  const result = calculateCartTotals(items);
  assert.equal(result.subtotal, 30.00);
  assert.equal(result.totalQuantity, 2);
  assert.equal(result.shipping, 4.99); // Under $35 threshold
  assert.equal(result.estimatedTax, 2.40); // 8% of 30
  assert.equal(result.orderTotal, 37.39);
});

test('calculateCartTotals applies free shipping for orders at or over $35', () => {
  const items = [
    { price: 38.99, quantity: 1 },
  ];
  const result = calculateCartTotals(items);
  assert.equal(result.subtotal, 38.99);
  assert.equal(result.totalQuantity, 1);
  assert.equal(result.shipping, 0);
  assert.equal(result.estimatedTax, 3.12);
  assert.equal(result.orderTotal, 42.11);
});

test('validateQuantityChange prevents setting quantity below 1', () => {
  const check = validateQuantityChange(1, -1, 10);
  assert.equal(check.valid, false);
  assert.equal(check.newQty, 1);
  assert.ok(check.error?.includes('less than 1'));
});

test('validateQuantityChange prevents exceeding available stock', () => {
  const check = validateQuantityChange(3, 1, 3);
  assert.equal(check.valid, false);
  assert.equal(check.newQty, 3);
  assert.ok(check.error?.includes('Maximum available stock'));
});

test('validateQuantityChange permits valid quantity increment within stock', () => {
  const check = validateQuantityChange(2, 1, 5);
  assert.equal(check.valid, true);
  assert.equal(check.newQty, 3);
  assert.equal(check.error, undefined);
});

test('validateCustomerDetails flags missing and invalid fields', () => {
  const invalid = validateCustomerDetails({
    name: '',
    email: 'not-an-email',
    phone: '123',
    address: '',
    city: '',
    postalCode: '',
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.address);
  assert.ok(invalid.errors.city);
  assert.ok(invalid.errors.postalCode);
});

test('validateCustomerDetails accepts complete and valid customer information', () => {
  const valid = validateCustomerDetails({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555-123-4567',
    address: '123 Market Street, Apt 4B',
    city: 'San Francisco',
    postalCode: '94105',
  });

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('formatCurrency formats numbers into USD currency string', () => {
  assert.equal(formatCurrency(24.99), '$24.99');
  assert.equal(formatCurrency(0), '$0.00');
});
