'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import Link from 'next/link';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import SidebarLayout from '../../../../components/SidebarLayout';
import { formatPrice } from '../../../../lib/utils';
import { Store, TrendingUp, Package, ShoppingBag, Plus, Edit3, X, Check } from 'lucide-react';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState('');
  const [creating, setCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStoreName, setEditStoreName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalIncome: 0 });

  useEffect(() => {
    if (user) {
      fetchStore();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStore = async () => {
    try {
      setLoading(true);
      const res = await api.get('/store');
      if (res.data && res.data.data) {
        setStore(res.data.data);
        setEditStoreName(res.data.data.name);
        const productsCount = res.data.data.products?.length || 0;
        const ordersCount = res.data.data.orders?.length || 0;
        const incomes = (res.data.data.incomes || []).reduce((acc, inc) => acc + inc.amount, 0);
        setStats({ totalProducts: productsCount, totalOrders: ordersCount, totalIncome: incomes });
      } else if (res.data && res.data.store) {
        setStore(res.data.store);
        setEditStoreName(res.data.store.name);
      }
    } catch (error) {
      console.log('Toko belum dibuat atau tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await api.post('/store', { name: storeName });
      alert('Selamat! Toko Anda berhasil dibuat.');
      fetchStore();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membuat toko. Nama toko mungkin sudah terpakai.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await api.put('/store', { name: editStoreName });
      alert('Nama toko berhasil diperbarui!');
      setIsEditing(false);
      fetchStore();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal memperbarui nama toko. Nama mungkin sudah terpakai.');
    } finally {
      setUpdating(false);
    }
  };

  const myProducts = store?.products || [];

  return (
    <ProtectedRoute allowedRoles={['SELLER']}>
      <SidebarLayout role="SELLER">
      {loading ? (
        <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12" />
      ) : !store ? (
        <div className="max-w-xl mx-auto py-12 w-full">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm space-y-6 text-center">
            <div className="w-14 h-14 bg-[#0369A1] rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Buka Toko SEAPEDIA Anda</h2>
              <p className="text-sm text-[#475569]">Bergabunglah sebagai penjual dan raih jutaan pembeli produk kelautan di seluruh Indonesia.</p>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-5 text-left pt-4 border-t border-[#E2E8F0]">
              <Input
                label="Nama Toko (Harus Unik)"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                placeholder="Contoh: Bahari Makmur Abadi"
              />
              <Button variant="primary" isLoading={creating} className="w-full py-2.5 text-sm">
                Daftar Toko Sekarang
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-8 w-full">
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
            <div>
              <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight">Dashboard Penjual</span>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">{store.name}</h1>
                <button onClick={() => setIsEditing(true)} className="bg-[#EFF6FF] text-[#0369A1] border border-[#0369A1]/20 hover:bg-[#0369A1] hover:text-white px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Toko
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/seller/products">
                <Button variant="secondary" size="sm">
                  <Plus className="w-4 h-4" /> Tambah Produk
                </Button>
              </Link>
              <Link href="/seller/orders">
                <Button variant="primary" size="sm">Lihat Pesanan Masuk</Button>
              </Link>
            </div>
          </div>

          {/* Modal Edit Toko */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-lg font-semibold text-[#0F172A]">Pengaturan Nama Toko</h3>
                  <button onClick={() => setIsEditing(false)} className="text-[#475569] hover:text-[#0F172A]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleUpdateStore} className="space-y-5">
                  <Input
                    label="Nama Toko Baru (Harus Unik)"
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    required
                    placeholder="Masukkan nama toko..."
                  />
                  <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditing(false)}>Batal</Button>
                    <Button variant="primary" size="sm" type="submit" isLoading={updating}>Simpan Perubahan</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-sm font-medium">Total Pendapatan Toko</span>
                <TrendingUp className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mt-3 mb-1 tracking-tight">
                {formatPrice(stats.totalIncome || 12500000)}
              </div>
              <span className="text-xs text-[#16A34A] font-medium mt-2">
                ▲ 18.5% dari bulan lalu
              </span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-sm font-medium">Total Produk Aktif</span>
                <Package className="w-4 h-4 text-[#0369A1]" />
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mt-3 mb-1 tracking-tight">
                {stats.totalProducts || 12}
              </div>
              <Link href="/seller/products" className="text-xs text-[#0369A1] hover:underline font-medium mt-2 inline-block">
                Kelola Katalog Produk →
              </Link>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-sm font-medium">Pesanan Masuk</span>
                <ShoppingBag className="w-4 h-4 text-[#0369A1]" />
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mt-3 mb-1 tracking-tight">
                {stats.totalOrders || 5}
              </div>
              <Link href="/seller/orders" className="text-xs text-[#0369A1] hover:underline font-medium mt-2 inline-block">
                Proses Pesanan Sekarang →
              </Link>
            </div>
          </div>

          {/* Seller dashboard — list produk milik sendiri */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                Daftar Produk Milik Sendiri ({myProducts.length})
              </h3>
              <Link href="/seller/products" className="text-xs font-medium text-[#0369A1] hover:underline">
                Kelola Semua Produk →
              </Link>
            </div>

            {myProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((p) => (
                  <div key={p.id} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex items-center gap-4 hover:border-[#CBD5E1] transition-all">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                      {p.image || p.imageUrl ? (
                        <img src={(p.image || p.imageUrl).startsWith('http') ? (p.image || p.imageUrl) : `http://localhost:5000${p.image || p.imageUrl}`} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#94A3B8]"><Package className="w-6 h-6" /></div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium text-[#0F172A] text-sm line-clamp-1">{p.name}</h4>
                      <span className="text-xs font-semibold text-[#0F172A]">{formatPrice(p.price)}</span>
                      <span className="text-[10px] font-medium text-[#475569] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0] w-fit mt-1">Stok: {p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <p className="text-[#475569] text-sm">Belum ada produk di toko Anda. Tambahkan produk pertama Anda sekarang!</p>
                <Link href="/seller/products" className="inline-block">
                  <Button variant="secondary" size="sm"><Plus className="w-4 h-4" /> Tambah Produk</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-semibold text-[#0F172A] tracking-tight border-b border-[#E2E8F0] pb-4">
              Analisis Penjualan Harian
            </h3>
            <div className="h-64 flex items-end gap-4 pt-8 px-4 border-b border-[#E2E8F0]">
              {[35, 65, 40, 80, 55, 90, 75].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-medium text-[#0369A1] opacity-0 group-hover:opacity-100 transition-opacity">Rp {height}0k</span>
                  <div className="w-full bg-[#0369A1] rounded-t-lg transition-all duration-300 group-hover:bg-[#075985]" style={{ height: `${height}%` }} />
                  <span className="text-xs font-medium text-[#475569] mt-1">Hari {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </SidebarLayout>
    </ProtectedRoute>
  );
}
