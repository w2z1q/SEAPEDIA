'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Button from '../../../components/Button';
import Link from 'next/link';
import { formatPrice, formatDateTime } from '../../../lib/utils';
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topupAmount, setTopupAmount] = useState(100000);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) { fetchWallet(); } else { setLoading(false); }
  }, [user]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wallet');
      setWallet(res.data?.data || res.data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      await api.post('/wallet/topup', { amount: Number(topupAmount) });
      alert('Top-up berhasil!');
      fetchWallet();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal melakukan top-up');
    } finally {
      setProcessing(false);
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

  if (loading) return <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12" />;

  const transactions = wallet?.transactions || [];

  return (
    <div className="flex flex-col flex-1 gap-6 w-full">
      <h1 className="text-xl font-semibold text-[#0F172A]">Dompet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-5">
          {/* Balance Card */}
          <div className="bg-[#DC2626] rounded-xl p-5 shadow-sm text-white">
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <Wallet className="w-4 h-4" />
              <span>Saldo Aktif</span>
            </div>
            <div className="text-2xl font-semibold mt-2 mb-4 tracking-tight">
              {formatPrice(wallet?.balance || 0)}
            </div>
            <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs text-white/70 font-medium">
              <span>ID: {user?.id?.substr(0, 8)}...</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-white text-[10px]">Aktif</span>
            </div>
          </div>

          {/* Top-up */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Top-up Saldo</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[50000, 100000, 250000, 500000].map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => setTopupAmount(nominal)}
                  className={`py-2 px-3 rounded-lg border font-medium text-sm transition-colors ${
                    topupAmount === nominal
                      ? 'bg-[#DC2626] border-[#DC2626] text-white'
                      : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {formatPrice(nominal)}
                </button>
              ))}
            </div>

            <form onSubmit={handleTopup} className="space-y-3 pt-3 border-t border-[#E2E8F0]">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Nominal lainnya</label>
                <input
                  type="number" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} min={10000} step={10000} required
                  className="w-full rounded-lg bg-white border border-[#E2E8F0] py-2.5 px-3.5 text-sm text-[#0F172A] font-medium focus:outline-none focus:border-[#DC2626]"
                />
              </div>
              <Button variant="primary" isLoading={processing} className="w-full">Top-up Sekarang</Button>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Riwayat Transaksi</h3>

          {transactions.length > 0 ? (
            <div className="space-y-2.5">
              {transactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${trx.type === 'TOPUP' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                      {trx.type === 'TOPUP' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0F172A] text-sm">{trx.type === 'TOPUP' ? 'Top-up Saldo' : 'Pembayaran'}</h4>
                      <span className="text-xs text-[#94A3B8]">{formatDateTime(trx.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${trx.type === 'TOPUP' ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                      {trx.type === 'TOPUP' ? '+' : '-'}{formatPrice(trx.amount)}
                    </span>
                    {trx.description && <span className="text-xs text-[#94A3B8] block mt-0.5">{trx.description}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <p className="text-sm text-[#94A3B8]">Belum ada riwayat transaksi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
