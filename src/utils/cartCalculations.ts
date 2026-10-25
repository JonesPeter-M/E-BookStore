export interface CartCalculationItem {
  price: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  totalQuantity: number;
  shipping: number;
  estimatedTax: number;
  orderTotal: number;
}

export function calculateCartTotals(items: CartCalculationItem[]): CartTotals {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      totalQuantity: 0,
      shipping: 0,
      estimatedTax: 0,
      orderTotal: 0,
    };
  }

  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.quantity || 0));
    const price = Math.max(0, Number(item.price) || 0);
    subtotal += price * qty;
    totalQuantity += qty;
  }

  subtotal = Number(subtotal.toFixed(2));
  // Free shipping above $35 order threshold, or $4.99 standard
  const shipping = totalQuantity > 0 ? (subtotal >= 35 ? 0 : 4.99) : 0;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = Number((subtotal + shipping + estimatedTax).toFixed(2));

  return {
    subtotal,
    totalQuantity,
    shipping,
    estimatedTax,
    orderTotal,
  };
}

export function validateQuantityChange(
  currentQty: number,
  delta: number,
  maxStock: number
): { valid: boolean; newQty: number; error?: string } {
  const target = currentQty + delta;

  if (target < 1) {
    return {
      valid: false,
      newQty: currentQty,
      error: 'Quantity cannot be less than 1. To remove an item, click the trash icon.',
    };
  }

  if (target > maxStock) {
    return {
      valid: false,
      newQty: currentQty,
      error: `Cannot add more copies. Maximum available stock is ${maxStock}.`,
    };
  }

  return {
    valid: true,
    newQty: target,
  };
}

export interface CustomerValidationInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export function validateCustomerDetails(customer: CustomerValidationInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!customer.name || customer.name.trim().length < 2) {
    errors.name = 'Full name is required (minimum 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer.email || !emailRegex.test(customer.email.trim())) {
    errors.email = 'A valid email address is required (e.g., name@example.com).';
  }

  const phoneDigits = (customer.phone || '').replace(/\D/g, '');
  if (!customer.phone || phoneDigits.length < 7) {
    errors.phone = 'Valid phone number is required (minimum 7 digits).';
  }

  if (!customer.address || customer.address.trim().length < 4) {
    errors.address = 'Street delivery address is required.';
  }

  if (!customer.city || customer.city.trim().length < 2) {
    errors.city = 'City is required.';
  }

  if (!customer.postalCode || customer.postalCode.trim().length < 2) {
    errors.postalCode = 'Postal / ZIP code is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
