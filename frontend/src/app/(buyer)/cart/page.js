'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Button from '../../../components/Button';
import Link from 'next/link';
import { formatPrice } from '../../../lib/utils';
import { Package, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user) { fetchCart(); } else { setLoading(false); }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data?.data || res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) { handleRemoveItem(itemId); return; }
    try {
      setUpdatingId(itemId);
      await api.put(`/cart/${itemId}`, { quantity: newQty });
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah kuantitas');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingId(itemId);
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus item');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-4">
        <h2 className="text-xl font-semibold text-[#0F172A]">Anda belum masuk</h2>
        <p className="text-sm text-[#475569]">Masuk untuk melihat keranjang belanja.</p>
        <Link href="/login" className="inline-block"><Button variant="primary">Masuk</Button></Link>
      </div>
    );
  }

  if (loading) {
    return <div className="w-full animate-pulse space-y-4 py-12">
      <div className="h-8 bg-white border border-[#E2E8F0] rounded-lg max-w-xs" />
      <div className="h-32 bg-white border border-[#E2E8F0] rounded-xl" />
      <div className="h-32 bg-white border border-[#E2E8F0] rounded-xl" />
    </div>;
  }

  const cartItems = cart?.items || cart?.cartItems || [];
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  return (
    <div className="flex flex-col flex-1 gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#0F172A]">Keranjang</h1>
        <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] py-1.5 px-3 rounded-full">
          {cartItems.length} item
        </span>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm flex items-center gap-4 relative hover:border-[#CBD5E1] transition-colors">
                {updatingId === item.id && (
                  <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center z-10">
                    <span className="text-sm text-[#475569] animate-pulse">Mengupdate...</span>
                  </div>
                )}

                <div className="w-20 h-20 bg-[#F8FAFC] rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-[#E2E8F0]">
                  {item.product?.image || item.product?.imageUrl ? (
                    <img src={(item.product.image || item.product.imageUrl).startsWith('http') ? (item.product.image || item.product.imageUrl) : `http://localhost:5000${item.product.image || item.product.imageUrl}`} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-[#94A3B8]" />
                  )}
                </div>

                <div className="flex flex-col flex-1 gap-1.5">
                  <Link href={`/products/${item.product?.id}`} className="font-medium text-sm text-[#0F172A] hover:text-[#0369A1] transition-colors line-clamp-1">
                    {item.product?.name}
                  </Link>
                  <span className="text-sm font-semibold text-[#0F172A]">{formatPrice(item.product?.price)}</span>

                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-0.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm text-[#0F172A]">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-[#DC2626] hover:bg-[#FEF2F2] p-1.5 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A]">Ringkasan</h3>
            <div className="flex items-center justify-between text-sm text-[#475569] border-b border-[#E2E8F0] pb-3">
              <span>Total item</span>
              <span className="font-medium text-[#0F172A]">{cartItems.length} barang</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-[#0F172A]">Subtotal</span>
              <span className="text-lg font-semibold text-[#0F172A]">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" className="block w-full">
              <Button variant="primary" size="lg" className="w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-14 text-center shadow-sm max-w-md mx-auto my-8 space-y-3">
          <Package className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">Keranjang masih kosong</h3>
          <p className="text-sm text-[#475569]">Jelajahi katalog dan temukan produk yang Anda butuhkan.</p>
          <Link href="/" className="inline-block mt-2"><Button variant="primary" size="sm">Jelajahi Katalog</Button></Link>
        </div>
      )}
    </div>
  );
}
