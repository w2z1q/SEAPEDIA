'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import Link from 'next/link';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { formatPrice, translateStatus, statusBadgeClass, formatDateTime } from '../../../../lib/utils';
import { Truck, Wallet, CheckCircle, Package, AlertCircle } from 'lucide-react';

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState([]);
  const [historyJobs, setHistoryJobs] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDriverJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDriverJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver/jobs/my');
      const allJobs = res.data?.data || res.data || [];
      const active = allJobs.filter(j => j.order?.status === 'SEDANG_DIKIRIM');
      const history = allJobs.filter(j => j.order?.status === 'SELESAI' || j.order?.status === 'PESANAN_SELESAI' || j.order?.status === 'DIKEMBALIKAN' || j.order?.status === 'DIBATALKAN');
      setActiveJobs(active);
      setHistoryJobs(history);

      const calculatedEarnings = history
        .filter(j => j.order?.status === 'SELESAI' || j.order?.status === 'PESANAN_SELESAI')
        .reduce((acc, j) => acc + (j.order?.shippingCost || 10000), 0);
      setEarnings(calculatedEarnings);
    } catch (error) {
      console.error('Failed to fetch driver jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmComplete = async (jobId, orderId) => {
    try {
      setCompletingId(jobId);
      await api.put(`/driver/jobs/${jobId}/complete`, { orderId });
      alert('Pesanan berhasil diselesaikan! Pendapatan telah ditambahkan.');
      fetchDriverJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyelesaikan pesanan');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['DRIVER']}>
      {loading ? (
        <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12 max-w-6xl mx-auto" />
      ) : (
        <div className="flex flex-col flex-1 gap-10 w-full max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
            <div>
              <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight">Portal Kurir SEAPEDIA</span>
              <h1 className="text-2xl font-semibold text-[#0F172A] mt-1 tracking-tight">Dashboard Kurir & Rekap Penghasilan</h1>
            </div>
            <Link href="/driver/jobs">
              <Button variant="primary" size="sm">Cari Job Tersedia</Button>
            </Link>
          </div>

          {/* Earning Summary & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="bg-[#0369A1] rounded-xl p-6 shadow-sm text-white flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-tight">
                  <Wallet className="w-4 h-4" />
                  <span>Total Penghasilan Kurir</span>
                </div>
                <div className="text-3xl font-semibold mt-2 mb-1 tracking-tight">
                  {formatPrice(earnings)}
                </div>
                <p className="text-xs text-white/80">Diakumulasi dari ongkos kirim pesanan yang berstatus selesai.</p>
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between items-center text-xs font-medium text-white/90">
                <span>Perhitungan Ongkir:</span>
                <span className="bg-white text-[#0369A1] px-2.5 py-1 rounded-full text-[10px] font-semibold">100% KE KURIR</span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#475569] text-xs font-medium uppercase tracking-tight">
                  <Truck className="w-4 h-4 text-[#0369A1]" />
                  <span>Statistik Pengiriman</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-2xl font-semibold text-[#0F172A] block">{activeJobs.length}</span>
                    <span className="text-xs text-[#475569]">Sedang Dikirim</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-2xl font-semibold text-[#0F172A] block">{historyJobs.length}</span>
                    <span className="text-xs text-[#475569]">Riwayat Pekerjaan</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 text-xs text-[#475569]">Pastikan Anda mengirimkan pesanan tepat waktu sesuai dengan ketentuan SLA pengiriman.</div>
            </div>

            {/* SLA Overdue Policy Notice */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#854D0E] text-xs font-medium uppercase tracking-tight">
                  <AlertCircle className="w-4 h-4 text-[#EAB308]" />
                  <span>Informasi SLA & Overdue</span>
                </div>
                <h3 className="font-semibold text-[#854D0E] text-sm mt-2">Dampak Pesanan Overdue</h3>
                <p className="text-xs text-[#854D0E]/80 mt-1 leading-relaxed">
                  Jika pengiriman melewati batas SLA, pesanan berisiko di-reverse menjadi <strong>DIKEMBALIKAN</strong> oleh sistem. Stok produk akan dikembalikan ke toko (Stock Restore), dan potensi upah kurir dibatalkan.
                </p>
              </div>
              <div className="text-xs text-[#854D0E] font-medium pt-2 border-t border-[#FDE68A]">
                Harap utamakan pesanan Instant dan Next Day.
              </div>
            </div>
          </div>

          {/* Active Job Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">Pekerjaan Aktif Saya (Sedang Dikirim)</h2>
            {activeJobs.length > 0 ? (
              <div className="space-y-6">
                {activeJobs.map((job) => {
                  const updatedDate = new Date(job.updatedAt || job.createdAt);
                  return (
                    <div key={job.id} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col gap-6 relative hover:border-[#CBD5E1] transition-all">
                      {completingId === job.id && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                          <span className="font-medium text-[#475569] animate-pulse">Menyelesaikan Pesanan...</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                        <div>
                          <span className="text-xs text-[#94A3B8]">Job ID: {job.id} | Order ID: {job.orderId}</span>
                          <div className="text-sm font-medium text-[#0F172A] mt-1">
                            Pengirim: {job.order?.store?.name || 'Toko Mitra'} | Penerima: {job.order?.user?.name || 'Customer'}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full font-medium text-xs tracking-tight ${statusBadgeClass(job.order?.status)}`}>
                            {translateStatus(job.order?.status)}
                          </span>
                          <Button variant="primary" size="sm" onClick={() => handleConfirmComplete(job.id, job.orderId)}>
                            Konfirmasi Selesai (Confirm Completed)
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                        <div>
                          <span className="text-xs font-medium text-[#94A3B8]">Alamat Pengiriman Tujuan</span>
                          <p className="text-sm text-[#0F172A] mt-1 font-medium">{job.order?.address?.address || 'Alamat tujuan sistem'}</p>
                          <span className="text-xs text-[#475569] block mt-0.5">Kota: {job.order?.address?.city || 'Jakarta'} | Kode Pos: {job.order?.address?.zipCode || '12345'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-[#94A3B8]">Rincian & Kalkulasi Upah</span>
                          <p className="text-base text-[#0F172A] font-semibold mt-1">{formatPrice(job.order?.shippingCost || 10000)}</p>
                          <span className="text-xs text-[#475569] block mt-0.5">Metode Pengiriman: {job.order?.deliveryMethod || 'REGULAR'}</span>
                        </div>
                      </div>

                      <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between text-xs text-[#475569]">
                        <span>Waktu Diambil (Take Job): {formatDateTime(job.createdAt)}</span>
                        <span>Status Perubahan Terakhir: {formatDateTime(updatedDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-16 text-center shadow-sm max-w-2xl mx-auto my-6">
                <Truck className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                <p className="text-[#475569] text-sm">Tidak ada pesanan aktif yang sedang Anda kirim saat ini.</p>
                <Link href="/driver/jobs" className="inline-block mt-4">
                  <Button variant="primary" size="sm">Cari Job Available Sekarang</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Job History Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">Riwayat Pekerjaan Saya (History)</h2>
            {historyJobs.length > 0 ? (
              <div className="space-y-4">
                {historyJobs.map((job) => {
                  const updatedDate = new Date(job.updatedAt || job.createdAt);
                  const isOverdue = job.order?.status === 'DIKEMBALIKAN' || job.order?.status === 'DIBATALKAN';
                  return (
                    <div key={job.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex flex-col gap-4 hover:border-[#CBD5E1] transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-3">
                        <div>
                          <span className="text-xs text-[#94A3B8]">Job ID: {job.id} | Order ID: {job.orderId}</span>
                          <div className="text-sm font-medium text-[#0F172A] mt-0.5">Tujuan: {job.order?.address?.city || 'Kota Tujuan'} ({job.order?.address?.address || 'Alamat tujuan'})</div>
                        </div>
                        <span className={`px-4 py-1 rounded-full font-medium text-xs tracking-tight ${statusBadgeClass(job.order?.status)}`}>
                          {translateStatus(job.order?.status)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#475569]">
                        <div className="space-y-1">
                          <div>Waktu Diambil: {formatDateTime(job.createdAt)}</div>
                          <div>Waktu Diselesaikan / Overdue: {formatDateTime(updatedDate)}</div>
                          {isOverdue && <div className="text-[#DC2626] font-medium">Catatan: Pesanan overdue, stok dikembalikan (stock restore), upah dibatalkan.</div>}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#94A3B8]">Upah Diterima (Earning per completed job)</span>
                          <span className={`text-base font-semibold block ${isOverdue ? 'text-[#94A3B8] line-through' : 'text-[#16A34A]'}`}>
                            {formatPrice(job.order?.shippingCost || 10000)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-14 text-center shadow-sm max-w-2xl mx-auto my-6">
                <p className="text-[#475569] text-sm">Belum ada riwayat pekerjaan pengiriman yang diselesaikan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
