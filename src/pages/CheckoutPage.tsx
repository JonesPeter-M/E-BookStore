import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/client';
import { CustomerDetails } from '../types';
import {
  formatCurrency,
  calculateCartTotals,
  validateCustomerDetails,
} from '../utils/cartCalculations';
import { BookThumbnail } from '../components/BookThumbnail';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { cart, refreshCart } = useCart();

  const [formData, setFormData] = useState<CustomerDetails>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        postalCode: prev.postalCode || user.postalCode || '',
      }));
    }
  }, [user]);

  const totals = calculateCartTotals(
    cart.items.map((i) => ({ price: i.book.price, quantity: i.quantity }))
  );

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // 1. Client-side pure validation
    const validation = validateCustomerDetails(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    if (cart.items.length === 0) {
      setServerError('Your cart is empty. Please add books before placing an order.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await ordersApi.createOrder(formData);
      if (res.success && res.order) {
        // Refresh cart in context (server automatically emptied it upon order creation)
        await refreshCart();
        navigate(`/order-success/${res.order._id}`, {
          state: { order: res.order },
        });
      }
    } catch (err: any) {
      console.error('[Checkout Error]:', err);
      setServerError(
        err.message || 'Order placement failed. Inventory may have shifted. Please verify your cart.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8E8] text-[#2B211D]">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] text-[#6B352A] flex items-center justify-center mb-4 border border-[#E6D8C5] shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-editorial text-[#2B211D] mb-2">
          Customer Authentication Required
        </h2>
        <p className="text-xs text-[#75665D] max-w-sm mb-6">
          Please sign in or register to complete your order checkout securely.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-xl bg-[#6B352A] text-white font-bold text-xs hover:bg-[#4D251F] transition shadow-xs cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8E8] text-[#2B211D]">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] text-[#6B352A] flex items-center justify-center mb-4 border border-[#E6D8C5] shadow-xs">
          <AlertCircle className="w-8 h-8 text-[#6B352A]" />
        </div>
        <h2 className="text-2xl font-bold font-editorial text-[#2B211D] mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs text-[#75665D] max-w-sm mb-6">
          You need at least one book in your cart to proceed to checkout.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-[#6B352A] text-white font-bold text-xs hover:bg-[#4D251F] transition shadow-xs"
        >
          Browse Book Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#2B211D] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75665D] hover:text-[#6B352A] transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </Link>

        <h1 className="text-3xl font-bold font-editorial text-[#2B211D] mb-8">
          Order Checkout &amp; Delivery
        </h1>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-[#A52D2D]/10 border border-[#A52D2D]/30 text-[#A52D2D] text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
            <AlertCircle className="w-5 h-5 text-[#A52D2D] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Checkout Notice</p>
              <p className="mt-0.5 text-[#2B211D]">{serverError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Details Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E6D8C5] shadow-xs">
            <h2 className="text-lg font-bold font-editorial text-[#2B211D] mb-1">
              1. Delivery &amp; Contact Details
            </h2>
            <p className="text-xs text-[#75665D] mb-6">
              Enter shipping recipient details. Inputs are validated on both client and server before inventory holds are executed.
            </p>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#75665D] mb-1">
                  Recipient Full Name <span className="text-[#A52D2D]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden ${
                      fieldErrors.name ? 'border-[#A52D2D]' : 'border-[#E6D8C5]'
                    }`}
                  />
                  <User className="w-4 h-4 text-[#75665D] absolute left-3 top-3" />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-[#A52D2D] mt-1 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#75665D] mb-1">
                    Email Address (Order Confirmation) <span className="text-[#A52D2D]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="eleanor@university.edu"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden ${
                        fieldErrors.email ? 'border-[#A52D2D]' : 'border-[#E6D8C5]'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-[#75665D] absolute left-3 top-3" />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-[#A52D2D] mt-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#75665D] mb-1">
                    Phone Number <span className="text-[#A52D2D]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden ${
                        fieldErrors.phone ? 'border-[#A52D2D]' : 'border-[#E6D8C5]'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-[#75665D] absolute left-3 top-3" />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-[#A52D2D] mt-1 font-medium">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#75665D] mb-1">
                  Street Delivery Address <span className="text-[#A52D2D]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="742 University Ave, Room 2B"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden ${
                      fieldErrors.address ? 'border-[#A52D2D]' : 'border-[#E6D8C5]'
                    }`}
                  />
                  <MapPin className="w-4 h-4 text-[#75665D] absolute left-3 top-3" />
                </div>
                {fieldErrors.address && (
                  <p className="text-[11px] text-[#A52D2D] mt-1 font-medium">{fieldErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#75665D] mb-1">
                    City <span className="text-[#A52D2D]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Cambridge"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden ${
                        fieldErrors.city ? 'border-[#A52D2D]' : 'border-[#E6D8C5]'
                      }`}
                    />
                    <Building className="w-4 h-4 text-[#75665D] absolute left-3 top-3" />
                  </div>
                  {fieldErrors.city && (
                    <p className="text-[11px] text-[#A52D2D] mt-1 font-medium">{fieldErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#75665D] mb-1">
                    Postal / ZIP Code <span className="text-[#A52D2D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="02138"
                    className={`w-full px-3 py-2.5 rounded-xl border bg-[#FFF8E8] text-xs text-[#2B211D] focus:ring-2 focus:ring-[#6B352A] focus:outline-hidden ${
                      fieldErrors.postalCode ? 'border-[#A52D2D]' : 'border-[#E6D8C5]'
                    }`}
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-[11px] text-[#A52D2D] mt-1 font-medium">{fieldErrors.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Assessment simulated payment note */}
              <div className="pt-4 border-t border-[#E6D8C5]">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#75665D] mb-2">
                  2. Payment Simulation
                </h3>
                <div className="p-3 bg-[#FFF8E8] rounded-xl border border-[#E6D8C5] text-xs text-[#75665D] flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#286647] shrink-0" />
                  <span>
                    Simulated Assessment Checkout: No real card required. Order total is calculated from authoritative database records upon submission.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 px-6 rounded-xl bg-[#6B352A] hover:bg-[#4D251F] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Stock &amp; Placing Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order ({formatCurrency(totals.orderTotal)})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary with Snapshot Items */}
          <div className="lg:col-span-5 bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E6D8C5] shadow-xs space-y-4">
            <h2 className="text-lg font-bold font-editorial text-[#2B211D] border-b border-[#E6D8C5] pb-3">
              Order Snapshot Summary
            </h2>

            {/* Items list */}
            <div className="divide-y divide-[#E6D8C5] max-h-80 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.book._id} className="py-3 flex gap-3 items-center">
                  <BookThumbnail
                    src={item.book.coverImage}
                    title={item.book.title}
                    category={item.book.category}
                    className="w-12 h-16 rounded-lg border border-[#E6D8C5] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial font-bold text-xs text-[#2B211D] truncate">
                      {item.book.title}
                    </h4>
                    <p className="text-[11px] text-[#75665D]">
                      Qty: {item.quantity} • {formatCurrency(item.book.price)}
                    </p>
                  </div>
                  <span className="font-bold font-editorial text-xs text-[#2B211D] shrink-0">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#E6D8C5] space-y-2 text-xs text-[#75665D]">
              <div className="flex justify-between">
                <span>Subtotal ({totals.totalQuantity} items)</span>
                <span className="font-semibold text-[#2B211D]">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0 ? (
                    <span className="text-[#286647] font-bold uppercase tracking-wider text-[10px] bg-[#286647]/10 px-1.5 py-0.5 rounded border border-[#286647]/20">
                      FREE
                    </span>
                  ) : (
                    formatCurrency(totals.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span>{formatCurrency(totals.estimatedTax)}</span>
              </div>
              <div className="pt-3 border-t border-[#E6D8C5] flex justify-between items-baseline font-bold text-[#2B211D]">
                <span className="text-sm">Final Order Total</span>
                <span className="text-xl font-editorial text-[#2B211D]">
                  {formatCurrency(totals.orderTotal)}
                </span>
              </div>
            </div>

            {/* Safeguard highlights */}
            <div className="p-4 bg-[#FFF8E8] rounded-xl border border-[#E6D8C5] space-y-2 text-[11px] text-[#75665D]">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#286647] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#2B211D]">Atomic Inventory Lock:</strong> Book stock is decremented atomically in MongoDB with rollback protection.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#6B352A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#2B211D]">Permanent Receipt:</strong> Order history records an immutable snapshot of all titles and purchase prices.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
