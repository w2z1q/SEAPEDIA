'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { formatPrice, translateStatus, statusBadgeClass, formatDateTime } from '../../../../lib/utils';
import { Truck, Search, MapPin, Package, Clock, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

export default function DriverJobsPage() {
  const { user } = useAuth();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takingId, setTakingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAvailableJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAvailableJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver/jobs/available');
      setAvailableJobs(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch available jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeJob = async (orderId) => {
    try {
      setTakingId(orderId);
      await api.post(`/driver/jobs/${orderId}/take`);
      alert('Pekerjaan berhasil diambil! Status pesanan kini menjadi Sedang Dikirim.');
      setSelectedJob(null);
      fetchAvailableJobs();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengambil job. Job mungkin sudah diambil oleh driver lain.');
    } finally {
      setTakingId(null);
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
              <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight">Endpoint & UI Cari Available Jobs</span>
              <h1 className="text-2xl font-semibold text-[#0F172A] mt-1 tracking-tight">Peluang Pengiriman Tersedia (Menunggu Pengirim)</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={fetchAvailableJobs}>
                Refresh Daftar Job
              </Button>
              <Link href="/driver/dashboard">
                <Button variant="secondary" size="sm">Kembali ke Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* SLA Info Banner */}
          <div className="bg-[#EFF6FF] border border-[#0369A1]/20 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-[#0369A1] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-[#0F172A] text-sm">Validasi & Verifikasi Kurir Server-Side</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Hanya pesanan berstatus <strong>Menunggu Pengirim</strong> yang ditampilkan. Setiap order dibatasi maksimal <strong>1 driver aktif</strong>.
                  Sistem mencegah pengambilan ganda (double take) untuk menjamin transparansi & konsistensi upah.
                </p>
              </div>
            </div>
            <span className="bg-[#0369A1] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shrink-0">
              {availableJobs.length} Job Siap Diambil
            </span>
          </div>

          {/* Available Jobs Grid */}
          <div className="space-y-6">
            {availableJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableJobs.map((order) => (
                  <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:border-[#CBD5E1] transition-all relative">
                    {takingId === order.id && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                        <span className="font-medium text-[#475569] animate-pulse">Mengambil Pekerjaan...</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                        <div>
                          <span className="text-xs text-[#94A3B8]">Order ID: {order.id.substr(0, 12)}...</span>
                          <h4 className="font-semibold text-[#0F172A] text-base mt-0.5">{order.store?.name || 'Toko Mitra'}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-medium text-xs tracking-tight ${statusBadgeClass(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs text-[#475569]">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#0369A1] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-[#0F172A]">Alamat Pengambilan:</strong> {order.store?.name || 'Gudang Utama'}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-[#0F172A]">Alamat Pengiriman:</strong> {order.address?.address || 'Alamat tujuan pembeli'}, {order.address?.city}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#EAB308] shrink-0" />
                          <div>
                            <strong className="text-[#0F172A]">Waktu Permintaan:</strong> {formatDateTime(order.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#94A3B8]">Potensi Pendapatan (Upah)</span>
                        <span className="text-lg font-semibold text-[#16A34A] block">
                          {formatPrice(order.shippingCost || 10000)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedJob(order)}>Detail Job</Button>
                        <Button variant="primary" size="sm" isLoading={takingId === order.id} onClick={() => handleTakeJob(order.id)}>
                          Ambil Job (Take Job)
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-16 text-center shadow-sm max-w-2xl mx-auto my-6 space-y-4">
                <Search className="w-12 h-12 text-[#94A3B8] mx-auto" />
                <h3 className="font-semibold text-[#0F172A] text-base">Belum Ada Pekerjaan Baru Tersedia</h3>
                <p className="text-[#475569] text-sm leading-relaxed">Semua pesanan saat ini telah diambil oleh kurir lain atau belum ada pesanan yang siap dikirim oleh toko mitra.</p>
                <Button variant="secondary" size="sm" onClick={fetchAvailableJobs}>Refresh Halaman</Button>
              </div>
            )}
          </div>

          {/* Modal Job Detail */}
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight">Endpoint & UI Lihat Job Detail</span>
                    <h3 className="text-lg font-semibold text-[#0F172A] mt-0.5">Rincian Pekerjaan Pengiriman</h3>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="text-[#475569] hover:text-[#0F172A]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-sm text-[#475569]">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#94A3B8]">Nilai Ongkos Kirim (Upah Kurir)</span>
                      <span className="text-xl font-semibold text-[#16A34A] block">{formatPrice(selectedJob.shippingCost || 10000)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-medium text-xs ${statusBadgeClass(selectedJob.status)}`}>
                      {translateStatus(selectedJob.status)}
                    </span>
                  </div>

                  <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
                    <h4 className="font-semibold text-[#0F172A] text-xs uppercase tracking-tight">Rincian Toko Pengirim</h4>
                    <p className="text-xs text-[#0F172A] font-medium">{selectedJob.store?.name || 'Toko Mitra Seapedia'}</p>
                    <p className="text-xs text-[#94A3B8]">Waktu Pesanan: {formatDateTime(selectedJob.createdAt)}</p>
                  </div>

                  <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
                    <h4 className="font-semibold text-[#0F172A] text-xs uppercase tracking-tight">Alamat Penerima Tujuan</h4>
                    <p className="text-xs text-[#0F172A] font-medium">{selectedJob.user?.name || 'Penerima Customer'}</p>
                    <p className="text-xs text-[#475569]">{selectedJob.address?.address || 'Alamat tujuan pembeli'}, {selectedJob.address?.city}</p>
                    <p className="text-xs text-[#94A3B8]">Kode Pos: {selectedJob.address?.zipCode}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#0F172A] text-xs uppercase tracking-tight">Daftar Barang Bawaan ({selectedJob.orderItems?.length || 0} item)</h4>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {(selectedJob.orderItems || []).map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] text-xs">
                          <span className="font-medium text-[#0F172A]">{item.product?.name || 'Produk'}</span>
                          <span className="text-[#475569] font-medium">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>Tutup Detail</Button>
                  <Button variant="primary" size="sm" isLoading={takingId === selectedJob.id} onClick={() => handleTakeJob(selectedJob.id)}>
                    Ambil Job Ini (Take Job Action)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
