'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import SidebarLayout from '../../../../components/SidebarLayout';
import { formatPrice, translateStatus, statusBadgeClass, formatDateTime } from '../../../../lib/utils';
import { Package, TrendingUp, CheckCircle2, RotateCcw } from 'lucide-react';

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchStoreOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStoreOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/store');
      if (res.data && res.data.data) {
        setOrders(res.data.data.orders || []);
        setIncomes(res.data.data.incomes || []);
      } else {
        const allRes = await api.get('/orders/seller');
        setOrders(allRes.data?.data || allRes.data || []);
      }
    } catch (error) {
      try {
        const allRes = await api.get('/orders/seller');
        setOrders(allRes.data?.data || allRes.data || []);
      } catch (err) {
        console.error('Failed to fetch store orders:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      alert(`Status pesanan berhasil diupdate menjadi ${nextStatus}`);
      fetchStoreOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah status pesanan');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalIncome = incomes.reduce((acc, inc) => acc + inc.amount, 0);
  const incomingCount = orders.filter(o => o.status === 'SEDANG_DIKEMAS').length;
  const processedCount = orders.filter(o => o.status !== 'SEDANG_DIKEMAS' && o.status !== 'DIBATALKAN' && o.status !== 'REFUND' && o.status !== 'DIKEMBALIKAN').length;

  return (
    <ProtectedRoute allowedRoles={['SELLER']}>
      <SidebarLayout role="SELLER">
      {loading ? (
        <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12 max-w-6xl mx-auto" />
      ) : (
        <div className="flex flex-col flex-1 gap-10 w-full max-w-6xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight">Pesanan & Keuangan Toko</span>
              <h1 className="text-2xl font-semibold text-[#0F172A] mt-1 tracking-tight">Daftar Pesanan & Laporan Pendapatan</h1>
            </div>
            <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] py-1.5 px-4 rounded-full border border-[#E2E8F0]">
              {orders.length} Total Pesanan
            </span>
          </div>

          {/* Seller Income Report / Revenue Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="bg-[#0369A1] rounded-xl p-6 shadow-sm text-white flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-tight text-white/80">Laporan Pendapatan Bersih</span>
                <div className="text-3xl font-semibold mt-2 mb-1 tracking-tight">
                  {formatPrice(totalIncome)}
                </div>
                <p className="text-xs text-white/80">Akumulasi pendapatan dari pesanan yang diproses & selesai.</p>
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between items-center text-xs font-medium text-white/90">
                <span>Status Rekap Keuangan:</span>
                <span className="bg-white text-[#0369A1] px-2.5 py-1 rounded-full text-[10px] font-semibold">TERVERIFIKASI</span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-medium text-[#475569] uppercase tracking-tight">Status Pesanan Aktif</span>
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-2xl font-semibold text-[#0F172A] block">{incomingCount}</span>
                    <span className="text-xs text-[#475569]">Pesanan Baru (Dikemas)</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-2xl font-semibold text-[#0F172A] block">{processedCount}</span>
                    <span className="text-xs text-[#475569]">Sedang Diproses</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 text-xs text-[#475569]">Pantau dan proses pesanan baru secara berkala untuk menjaga kepuasan pembeli.</div>
            </div>

            {/* Riwayat Reversal & Tercatat */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-4 max-h-56 overflow-y-auto">
              <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight border-b border-[#E2E8F0] pb-2">
                Rincian Transaksi Pendapatan & Reversal
              </h3>
              {incomes.length > 0 ? (
                <div className="space-y-3">
                  {incomes.map((inc) => (
                    <div key={inc.id} className="flex items-center justify-between text-xs border-b border-[#E2E8F0] pb-2 last:border-0">
                      <div>
                        <span className={`font-medium ${inc.amount < 0 ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
                          {inc.amount < 0 ? 'Reversal (Overdue/Batal)' : 'Penjualan Diproses'}
                        </span>
                        <div className="text-[10px] text-[#94A3B8]">{formatDateTime(inc.createdAt)}</div>
                      </div>
                      <span className={`font-semibold ${inc.amount < 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                        {inc.amount < 0 ? '' : '+'}{formatPrice(inc.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8] py-4 text-center">Belum ada catatan pendapatan atau reversal.</p>
              )}
            </div>
          </div>

          {/* Incoming Order List untuk Seller */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">Daftar Pesanan Toko</h2>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => {
                  const updatedDate = new Date(order.updatedAt);
                  return (
                    <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col gap-6 relative hover:border-[#CBD5E1] transition-all">
                      {updatingId === order.id && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                          <span className="font-medium text-[#475569] animate-pulse">Mengupdate Status...</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                        <div>
                          <span className="text-xs text-[#94A3B8]">Order ID: {order.id}</span>
                          <div className="text-sm font-medium text-[#0F172A] mt-1">Pembeli: {order.user?.name || 'Customer'} ({order.user?.email || ''})</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full font-medium text-xs tracking-tight ${statusBadgeClass(order.status)}`}>
                            {translateStatus(order.status)}
                          </span>
                          {order.status === 'SEDANG_DIKEMAS' && (
                            <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(order.id, 'MENUNGGU_PENGIRIM')}>
                              Siap Kirim (Panggil Kurir)
                            </Button>
                          )}
                          {order.status !== 'DIBATALKAN' && order.status !== 'REFUND' && order.status !== 'DIKEMBALIKAN' && (
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(order.id, 'DIBATALKAN')}>
                              Batalkan / Overdue (Reverse Income)
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {(order.orderItems || []).map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                                {item.product?.imageUrl || item.product?.image ? (
                                  <img src={(item.product?.imageUrl || item.product?.image).startsWith('http') ? (item.product?.imageUrl || item.product?.image) : `http://localhost:5000${item.product?.imageUrl || item.product?.image}`} alt={item.product?.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#94A3B8]"><Package className="w-5 h-5" /></div>
                                )}
                              </div>
                              <div>
                                <span className="font-medium text-[#0F172A] block">{item.product?.name || 'Item'}</span>
                                <span className="text-xs text-[#475569]">Harga: {formatPrice(item.price || item.product?.price)} x {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-[#0F172A]">{formatPrice((item.price || item.product?.price) * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order timeline/status tracker di halaman Seller */}
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                        <span className="text-xs font-semibold text-[#0F172A] block mb-2">Pelacakan Status & Timestamp</span>
                        <div className="flex flex-wrap items-center gap-6 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0369A1]" />
                            <span className="text-[#475569]">Dibuat: {formatDateTime(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${order.status !== 'SEDANG_DIKEMAS' ? 'bg-[#0369A1]' : 'bg-[#CBD5E1]'}`} />
                            <span className="text-[#475569]">Update Terakhir: {formatDateTime(updatedDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'SELESAI' ? 'bg-[#16A34A]' : 'bg-[#CBD5E1]'}`} />
                            <span className="text-[#475569]">Status: {translateStatus(order.status)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Explicit breakdown: Discount, delivery fee, PPN 12%, total */}
                      <div className="border-t border-[#E2E8F0] pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#475569]">
                        <div className="flex flex-wrap items-center gap-4">
                          <span>Subtotal: {formatPrice(order.subtotal)}</span>
                          <span>Ongkir ({order.deliveryMethod}): {formatPrice(order.shippingCost)}</span>
                          {order.discount > 0 && <span className="text-[#16A34A] font-medium">Diskon: -{formatPrice(order.discount)}</span>}
                          <span>PPN (12%): {formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#0F172A] font-medium">Pendapatan Transaksi:</span>
                          <span className="text-xl font-semibold text-[#0F172A]">
                            {formatPrice(order.total || order.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-16 text-center shadow-sm max-w-2xl mx-auto my-12">
                <p className="text-[#475569] text-sm">Belum ada pesanan masuk ke toko Anda.</p>
              </div>
            )}
          </div>
        </div>
      )}
      </SidebarLayout>
    </ProtectedRoute>
  );
}
