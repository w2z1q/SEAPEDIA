'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Link from 'next/link';
import Button from '../../../../components/Button';
import { formatPrice, translateRole } from '../../../../lib/utils';
import { Wallet, CreditCard, ShoppingBag, ChevronRight, ArrowUpRight } from 'lucide-react';

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, walletRes, ordersRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/wallet'),
        api.get('/orders')
      ]);

      if (profRes.data?.data) setProfile(profRes.data.data);
      else setProfile(profRes.data);

      if (walletRes.data?.data) setWallet(walletRes.data.data);
      else setWallet(walletRes.data);

      if (ordersRes.data?.data) setOrders(ordersRes.data.data);
      else if (Array.isArray(ordersRes.data)) setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch buyer dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-4">
        <h2 className="text-xl font-semibold text-[#0F172A]">Anda belum masuk</h2>
        <Link href="/login" className="inline-block">
          <Button variant="primary">Masuk</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="w-full animate-pulse space-y-6 py-12">
      <div className="h-40 bg-white border border-[#E2E8F0] rounded-xl" />
      <div className="h-56 bg-white border border-[#E2E8F0] rounded-xl" />
    </div>;
  }

  const validOrders = orders.filter(o => o.status !== 'DIBATALKAN' && o.status !== 'DIKEMBALIKAN');
  const totalSpending = validOrders.reduce((acc, order) => acc + (order.total || order.subtotal || 0), 0);
  const totalOrdersCount = validOrders.length;
  const topupHistory = (wallet?.transactions || []).filter(t => t.type === 'TOPUP');
  const rolesList = user?.roles || [user?.activeRole || 'BUYER'];

  return (
    <div className="flex flex-col flex-1 gap-6 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A]">Dashboard</h1>
          <p className="text-sm text-[#475569] mt-0.5">Selamat datang kembali, {profile?.name || user?.name}.</p>
        </div>
        <Link href="/">
          <Button variant="secondary" size="sm">Katalog</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Profil</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-[#94A3B8]">Nama</span>
              <div className="text-sm font-medium text-[#0F172A]">{profile?.name || user?.name}</div>
            </div>
            <div>
              <span className="text-xs text-[#94A3B8]">Email</span>
              <div className="text-sm font-medium text-[#0F172A]">{profile?.email || user?.email}</div>
            </div>
            <div>
              <span className="text-xs text-[#94A3B8]">Peran</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {rolesList.map((r) => (
                  <span key={r} className={`px-2.5 py-1 rounded-md text-xs font-medium ${r === user?.activeRole ? 'bg-[#0369A1] text-white' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                    {translateRole(r)} {r === user?.activeRole && '(aktif)'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-[#0369A1] rounded-xl p-5 shadow-sm text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <Wallet className="w-4 h-4" />
              <span>Saldo Dompet</span>
            </div>
            <div className="text-2xl font-semibold mt-2 tracking-tight">
              {formatPrice(wallet?.balance || 0)}
            </div>
          </div>
          <Link href="/wallet" className="block mt-5">
            <span className="w-full text-center bg-white text-[#0369A1] hover:bg-[#F8FAFC] font-medium py-2.5 rounded-lg text-sm transition-colors block">
              Top-up Saldo
            </span>
          </Link>
        </div>

        {/* Spending */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Pengeluaran</h3>
          <div>
            <span className="text-xs text-[#94A3B8]">Total belanja</span>
            <div className="text-xl font-semibold text-[#0F172A] mt-0.5">{formatPrice(totalSpending)}</div>
          </div>
          <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
            <div className="flex items-center justify-between text-xs text-[#475569]">
              <span>Transaksi berhasil</span>
              <span className="font-medium text-[#0F172A]">{totalOrdersCount} pesanan</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#475569]">
              <span>Rata-rata per transaksi</span>
              <span className="font-medium text-[#0F172A]">{formatPrice(totalOrdersCount > 0 ? totalSpending / totalOrdersCount : 0)}</span>
            </div>
          </div>
          <Link href="/orders" className="block pt-2 border-t border-[#E2E8F0]">
            <span className="text-xs font-medium text-[#0369A1] hover:underline flex items-center gap-1">
              Lihat riwayat pesanan
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Top-up History */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#0F172A]">Riwayat Top-up</h3>
          <Link href="/wallet" className="text-xs font-medium text-[#0369A1] hover:underline">Lihat semua</Link>
        </div>

        {topupHistory.length > 0 ? (
          <div className="space-y-3">
            {topupHistory.slice(0, 5).map((trx) => (
              <div key={trx.id} className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#DCFCE7] text-[#166534]">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0F172A] text-sm">Top-up Saldo</h4>
                    <span className="text-xs text-[#94A3B8]">{new Date(trx.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#166534]">+{formatPrice(trx.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-[#94A3B8]">Belum ada riwayat top-up.</p>
            <Link href="/wallet" className="inline-block mt-3">
              <Button variant="secondary" size="sm">Top-up Sekarang</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
