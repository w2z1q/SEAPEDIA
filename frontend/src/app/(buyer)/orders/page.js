'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Link from 'next/link';
import { formatPrice, translateStatus, statusBadgeClass, formatDate } from '../../../lib/utils';
import { Package, ShoppingBag } from 'lucide-react';
import Button from '../../../components/Button';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) { fetchOrders(); } else { setLoading(false); }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data?.data) setOrders(res.data.data);
      else if (Array.isArray(res.data)) setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-4">
        <h2 className="text-xl font-semibold text-[#0F172A]">Anda belum masuk</h2>
        <Link href="/login" className="inline-block"><Button variant="primary">Masuk</Button></Link>
      </div>
    );
  }

  if (loading) {
    return <div className="w-full animate-pulse space-y-4 py-12">
      {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-white border border-[#E2E8F0] rounded-xl" />)}
    </div>;
  }

  return (
    <div className="flex flex-col flex-1 gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#0F172A]">Pesanan Saya</h1>
        <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] py-1.5 px-3 rounded-full">{orders.length} pesanan</span>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col gap-4 hover:border-[#CBD5E1] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                <div>
                  <span className="text-xs text-[#94A3B8]">#{order.id.substring(0, 8)}</span>
                  <div className="text-sm font-medium text-[#0F172A] mt-0.5">{formatDate(order.createdAt)}</div>
                </div>
                <span className={`px-3 py-1 rounded-full font-medium text-xs ${statusBadgeClass(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </div>

              <div className="space-y-2.5">
                {(order.orderItems || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                        {item.product?.image || item.product?.imageUrl ? (
                          <img src={(item.product.image || item.product.imageUrl).startsWith('http') ? (item.product.image || item.product.imageUrl) : `http://localhost:5000${item.product.image || item.product.imageUrl}`} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-[#94A3B8]" /></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F172A] text-sm">{item.product?.name || 'Produk'}</h4>
                        <span className="text-xs text-[#94A3B8]">{formatPrice(item.price || item.product?.price)} x {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-medium text-[#0F172A] text-sm">{formatPrice((item.price || item.product?.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E2E8F0] pt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-[#475569]">
                  <span>Ongkir: {formatPrice(order.shippingCost || 15000)}</span>
                  {order.discount > 0 && <span className="text-[#166534] font-medium">Diskon: -{formatPrice(order.discount)}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-[#94A3B8]">Total</span>
                    <span className="text-base font-semibold text-[#0F172A] block">{formatPrice(order.total || order.subtotal)}</span>
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="secondary" size="sm">Detail</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-14 text-center shadow-sm max-w-md mx-auto my-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">Belum ada pesanan</h3>
          <p className="text-sm text-[#475569]">Pesanan Anda akan muncul di sini.</p>
          <Link href="/" className="inline-block mt-2"><Button variant="primary" size="sm">Jelajahi Katalog</Button></Link>
        </div>
      )}
    </div>
  );
}
