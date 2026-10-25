import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Order } from '../types';
import { ordersApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/cartCalculations';
import { BookThumbnail } from '../components/BookThumbnail';

export const OrdersPage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await ordersApi.getMyOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setError(err.message || 'Failed to retrieve your order history from MongoDB.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8E8] text-[#2B211D]">
        <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] text-[#6B352A] flex items-center justify-center mb-4 border border-[#E6D8C5] shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-editorial text-[#2B211D] mb-2">
          Customer Authentication Required
        </h2>
        <p className="text-xs text-[#75665D] max-w-sm mb-6">
          Sign in to view your past bookstore orders and historical order receipts.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-xl bg-[#6B352A] text-white font-bold text-xs hover:bg-[#4D251F] transition shadow-xs cursor-pointer"
        >
          Sign In to Account
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] text-[#2B211D] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75665D] hover:text-[#6B352A] transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </Link>

        {/* Page Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6D8C5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B352A] text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-[#2B211D]">
                Order History &amp; Receipts
              </h1>
              <p className="text-xs text-[#75665D] mt-0.5">
                Permanent purchase records with immutable price snapshots and stock decrements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6B352A]/10 text-[#6B352A] border border-[#6B352A]/20">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
            </span>
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-[#FFF8E8] border border-[#E6D8C5] text-[#2B211D] text-xs font-semibold hover:bg-[#FFFFFF] transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#6B352A] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#75665D]">Retrieving order history from MongoDB...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="p-6 rounded-2xl bg-[#A52D2D]/10 border border-[#A52D2D]/30 text-[#A52D2D] text-xs text-center">
            <p className="font-bold mb-1">Failed to load orders</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border border-[#E6D8C5] shadow-xs max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#FFF8E8] text-[#75665D] flex items-center justify-center mx-auto mb-4 border border-[#E6D8C5]">
              <Package className="w-8 h-8 opacity-40 text-[#6B352A]" />
            </div>
            <h3 className="text-lg font-bold font-editorial text-[#2B211D] mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-[#75665D] mb-6">
              When you complete an order, your order receipt and snapshot items will appear here permanently.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B352A] text-white text-xs font-bold hover:bg-[#4D251F] transition shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Book Catalogue</span>
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E6D8C5] shadow-xs overflow-hidden transition hover:border-[#6B352A]/40"
              >
                {/* Order Top Header Bar */}
                <div className="p-5 bg-[#FFF8E8] border-b border-[#E6D8C5] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">
                        Order Placed
                      </span>
                      <span className="font-semibold text-[#2B211D] text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="h-7 w-px bg-[#E6D8C5] hidden sm:block" />
                    <div>
                      <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">
                        Order ID
                      </span>
                      <span className="font-mono font-bold text-[#6B352A] text-xs">
                        #{order._id}
                      </span>
                    </div>
                    <div className="h-7 w-px bg-[#E6D8C5] hidden sm:block" />
                    <div>
                      <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">
                        Total Amount
                      </span>
                      <span className="font-editorial font-bold text-[#2B211D] text-base">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <div className="h-7 w-px bg-[#E6D8C5] hidden sm:block" />
                    <div>
                      <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">
                        Ship To
                      </span>
                      <span className="text-[#2B211D] font-medium truncate max-w-[150px] block" title={order.customer.address}>
                        {order.customer.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#286647]/15 text-[#286647] border border-[#286647]/30 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{order.status || 'Confirmed'}</span>
                    </span>
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div className="p-6 divide-y divide-[#E6D8C5]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between gap-4 text-xs first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4 min-w-0">
                        <BookThumbnail
                          title={item.title}
                          className="w-12 h-16 rounded-lg border border-[#E6D8C5] shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-editorial font-bold text-[#2B211D] text-sm leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[#75665D] text-xs mt-1">
                            Quantity: <strong className="text-[#2B211D]">{item.quantity}</strong> • {formatCurrency(item.price)} unit price
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-editorial font-bold text-[#2B211D] text-sm">
                          {formatCurrency(item.subtotal)}
                        </span>
                        <span className="text-[10px] text-[#286647] block font-semibold">
                          Archived snapshot
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Address & Stock Verification */}
                <div className="px-6 py-3 bg-[#FFF8E8] border-t border-[#E6D8C5] text-xs text-[#75665D] flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#6B352A] shrink-0" />
                    <strong>Delivery:</strong> {order.customer.address}, {order.customer.city}, {order.customer.postalCode}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#286647] font-medium">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Inventory decremented atomically in MongoDB</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
