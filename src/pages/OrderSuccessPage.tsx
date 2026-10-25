import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  MapPin,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';
import { ordersApi } from '../api/client';
import { formatCurrency } from '../utils/cartCalculations';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    async function fetchOrder() {
      if (!order && orderId) {
        try {
          setIsLoading(true);
          const res = await ordersApi.getMyOrders();
          if (res.success && res.orders) {
            const found = res.orders.find((o) => o._id === orderId);
            if (found) setOrder(found);
          }
        } catch (err) {
          console.error('Fetch order error:', err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchOrder();
  }, [order, orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FFF8E8] text-[#2B211D]">
        <div className="w-8 h-8 border-3 border-[#6B352A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#75665D]">Retrieving order confirmation details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#2B211D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Header Card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 border border-[#E6D8C5] shadow-xs text-center">
          <div className="w-16 h-16 rounded-full bg-[#286647]/15 text-[#286647] border border-[#286647]/30 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#286647]/10 text-[#286647] text-xs font-bold border border-[#286647]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed &amp; Inventory Decremented</span>
          </div>

          <h1 className="text-3xl font-bold font-editorial text-[#2B211D] mb-2">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-[#75665D] max-w-md mx-auto">
            Your purchase has been recorded in MongoDB. Inventory was atomically reserved and your cart has been cleared.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-[#FFF8E8] px-5 py-3 rounded-xl border border-[#E6D8C5] text-xs text-[#2B211D]">
            <div>
              <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">Order ID</span>
              <span className="font-mono font-bold text-[#6B352A]">{order?._id || orderId}</span>
            </div>
            <div className="h-6 w-px bg-[#E6D8C5] hidden sm:block" />
            <div>
              <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">Status</span>
              <span className="font-bold text-[#286647]">{order?.status || 'Confirmed'}</span>
            </div>
            <div className="h-6 w-px bg-[#E6D8C5] hidden sm:block" />
            <div>
              <span className="text-[#75665D] block text-[9px] uppercase font-bold tracking-wider">Date</span>
              <span>{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}</span>
            </div>
          </div>
        </div>

        {/* Order Details & Snapshot Items */}
        {order && (
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E6D8C5] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6D8C5] pb-4">
              <h2 className="text-lg font-bold font-editorial text-[#2B211D] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#6B352A]" />
                <span>Purchased Items Snapshot</span>
              </h2>
              <span className="text-xs text-[#75665D] font-medium">
                {order.items.length} {order.items.length === 1 ? 'title' : 'titles'}
              </span>
            </div>

            {/* Table of items */}
            <div className="divide-y divide-[#E6D8C5]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h3 className="font-editorial font-bold text-[#2B211D] text-sm">
                      {item.title}
                    </h3>
                    <p className="text-[#75665D] mt-0.5">
                      Quantity: <strong className="text-[#2B211D]">{item.quantity}</strong> • {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="font-editorial font-bold text-[#2B211D] text-sm">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-[#E6D8C5] space-y-2 text-xs text-[#75665D]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#2B211D]">
                  {formatCurrency(
                    order.items.reduce((acc, curr) => acc + curr.subtotal, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Standard Delivery</span>
                <span className="text-[#286647] font-bold uppercase tracking-wider text-[10px] bg-[#286647]/10 px-2 py-0.5 rounded border border-[#286647]/20">
                  {order.totalAmount >= 35 ? 'FREE' : '$4.99'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span>
                  {formatCurrency(
                    Number(
                      (
                        order.items.reduce((acc, curr) => acc + curr.subtotal, 0) *
                        0.08
                      ).toFixed(2)
                    )
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E6D8C5] flex justify-between items-baseline font-bold text-[#2B211D]">
                <span className="text-sm">Total Billed:</span>
                <span className="text-xl font-editorial text-[#2B211D]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Delivery Recipient Info */}
            <div className="p-4 bg-[#FFF8E8] rounded-xl border border-[#E6D8C5] text-xs space-y-1.5">
              <h3 className="font-bold text-[#2B211D] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#6B352A]" />
                <span>Shipping Recipient</span>
              </h3>
              <p className="font-medium text-[#2B211D]">{order.customer.name}</p>
              <p className="text-[#75665D]">{order.customer.address}</p>
              <p className="text-[#75665D]">
                {order.customer.city}, {order.customer.postalCode}
              </p>
              <p className="text-[#75665D]/80 pt-1">
                Contact: {order.customer.phone} • {order.customer.email}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#6B352A] text-white font-bold text-xs hover:bg-[#4D251F] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>View in Order History</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FFFFFF] border border-[#E6D8C5] text-[#2B211D] font-semibold text-xs hover:bg-[#FFF8E8] transition flex items-center justify-center gap-2 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#6B352A]" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
