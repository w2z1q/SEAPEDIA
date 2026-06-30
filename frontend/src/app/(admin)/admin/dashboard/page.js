'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import SidebarLayout from '../../../../components/SidebarLayout';
import { formatPrice } from '../../../../lib/utils';
import { Shield, RefreshCw, Tag, Percent, Users, Store, Package, ShoppingBag, Truck, Clock, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('vouchers_promos'); // 'vouchers_promos', 'overdue_simulation', 'users_stores', 'products', 'orders_jobs'
  
  // Monitoring Data State
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [driverJobs, setDriverJobs] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [promos, setPromos] = useState([]);
  const [overdueOrders, setOverdueOrders] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Form States
  const [newVoucher, setNewVoucher] = useState({ code: '', discount: '', usageLimit: '', expiry: '' });
  const [newPromo, setNewPromo] = useState({ storeId: '', name: '', discount: '', expiry: '' });
  const [creatingVoucher, setCreatingVoucher] = useState(false);
  const [creatingPromo, setCreatingPromo] = useState(false);

  // Overdue Simulation State
  const [simulatedDays, setSimulatedDays] = useState(0);
  const [checkingOverdue, setCheckingOverdue] = useState(false);
  const [overdueResult, setOverdueResult] = useState(null);

  // Detail Modal State
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        usersRes,
        storesRes,
        productsRes,
        ordersRes,
        driverJobsRes,
        vouchersRes,
        promosRes,
        overdueRes
      ] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/stores'),
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/driver-jobs'),
        api.get('/admin/vouchers'),
        api.get('/admin/promos'),
        api.get('/admin/overdue-orders'),
      ]);

      setStats(statsRes.data?.data || null);
      setUsers(usersRes.data?.data || []);
      setStores(storesRes.data?.data || []);
      setProducts(productsRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
      setDriverJobs(driverJobsRes.data?.data || []);
      setVouchers(vouchersRes.data?.data || []);
      setPromos(promosRes.data?.data || []);
      setOverdueOrders(overdueRes.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    try {
      setCreatingVoucher(true);
      const payload = {
        code: newVoucher.code.toUpperCase(),
        discount: parseFloat(newVoucher.discount),
        usageLimit: parseInt(newVoucher.usageLimit, 10),
        expiry: newVoucher.expiry ? new Date(newVoucher.expiry).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await api.post('/admin/vouchers', payload);
      alert('Voucher baru berhasil diterbitkan!');
      setNewVoucher({ code: '', discount: '', usageLimit: '', expiry: '' });
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membuat voucher');
    } finally {
      setCreatingVoucher(false);
    }
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    try {
      setCreatingPromo(true);
      const payload = {
        storeId: newPromo.storeId,
        name: newPromo.name,
        discount: parseFloat(newPromo.discount),
        expiry: newPromo.expiry ? new Date(newPromo.expiry).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      await api.post('/admin/promos', payload);
      alert('Promo toko berhasil diterbitkan!');
      setNewPromo({ storeId: '', name: '', discount: '', expiry: '' });
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membuat promo toko');
    } finally {
      setCreatingPromo(false);
    }
  };

  const handleTriggerOverdue = async () => {
    try {
      setCheckingOverdue(true);
      const res = await api.post('/admin/overdue/check', { simulatedDays });
      setOverdueResult(res.data?.data || null);
      alert(`Pengecekan Overdue Selesai! (Simulasi Maju ${simulatedDays} Hari). ${res.data?.data?.totalProcessed || 0} pesanan overdue berhasil di-handle.`);
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal memicu pengecekan overdue');
    } finally {
      setCheckingOverdue(false);
    }
  };

  const handleDeleteVoucher = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher ini?')) return;
    try {
      await api.delete(`/admin/vouchers/${id}`);
      alert('Voucher berhasil dihapus');
      fetchAdminData();
      if (selectedVoucher?.id === id) setSelectedVoucher(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus voucher');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus promo ini?')) return;
    try {
      await api.delete(`/admin/promos/${id}`);
      alert('Promo berhasil dihapus');
      fetchAdminData();
      if (selectedPromo?.id === id) setSelectedPromo(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus promo');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <SidebarLayout role="ADMIN">
      {loading && !stats ? (
        <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12 max-w-7xl mx-auto" />
      ) : (
        <div className="flex flex-col flex-1 gap-10 w-full max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
          {/* Header & Master Stats Banner */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] pb-6 gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Portal Pemantauan & Manajemen Platform</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchAdminData} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Master Data</span>
            </Button>
          </div>

          {/* Master Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center">
              <span className="text-xs font-medium text-[#475569] block">Users</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.users?.total || users.length}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center">
              <span className="text-xs font-medium text-[#475569] block">Stores</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.stores?.total || stores.length}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center">
              <span className="text-xs font-medium text-[#475569] block">Products</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.products?.total || products.length}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center">
              <span className="text-xs font-medium text-[#475569] block">Orders</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.orders?.total || orders.length}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center">
              <span className="text-xs font-medium text-[#475569] block">Vouchers</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.vouchers?.total || vouchers.length}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center">
              <span className="text-xs font-medium text-[#475569] block">Promos</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.promos?.total || promos.length}</span>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm text-center col-span-2 sm:col-span-1">
              <span className="text-xs font-medium text-[#475569] block">Driver Jobs</span>
              <span className="text-2xl font-semibold text-[#0F172A] block mt-1">{stats?.driverJobs?.total || driverJobs.length}</span>
            </div>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="flex flex-wrap items-center gap-3 border-b border-[#E2E8F0] pb-4">
            <button
              onClick={() => setActiveTab('vouchers_promos')}
              className={`px-5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all flex items-center gap-2 ${
                activeTab === 'vouchers_promos' ? 'bg-[#0369A1] text-white shadow-sm' : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Voucher & Promo</span>
            </button>
            <button
              onClick={() => setActiveTab('overdue_simulation')}
              className={`px-5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all flex items-center gap-2 ${
                activeTab === 'overdue_simulation' ? 'bg-[#0369A1] text-white shadow-sm' : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>SLA & Overdue Simulation</span>
            </button>
            <button
              onClick={() => setActiveTab('users_stores')}
              className={`px-5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all flex items-center gap-2 ${
                activeTab === 'users_stores' ? 'bg-[#0369A1] text-white shadow-sm' : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Monitor Users & Stores</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all flex items-center gap-2 ${
                activeTab === 'products' ? 'bg-[#0369A1] text-white shadow-sm' : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Monitor Products</span>
            </button>
            <button
              onClick={() => setActiveTab('orders_jobs')}
              className={`px-5 py-2.5 rounded-lg font-medium text-xs tracking-tight transition-all flex items-center gap-2 ${
                activeTab === 'orders_jobs' ? 'bg-[#0369A1] text-white shadow-sm' : 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Monitor Orders & Driver Jobs</span>
            </button>
          </div>

          {/* TAB 1: VOUCHERS & PROMOS */}
          {activeTab === 'vouchers_promos' && (
            <div className="space-y-12">
              {/* Forms Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Buat Voucher */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
                    <Tag className="w-5 h-5 text-[#0369A1]" />
                    <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                      Buat Voucher Platform
                    </h3>
                  </div>
                  <form onSubmit={handleCreateVoucher} className="space-y-5">
                    <Input label="Kode Voucher (Unik)" value={newVoucher.code} onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })} required placeholder="Contoh: DISKONBESAR" />
                    <Input label="Potongan Diskon (Rp)" type="number" value={newVoucher.discount} onChange={(e) => setNewVoucher({ ...newVoucher, discount: e.target.value })} required placeholder="50000" />
                    <Input label="Batas Kuota Penggunaan (Usage Limit)" type="number" value={newVoucher.usageLimit} onChange={(e) => setNewVoucher({ ...newVoucher, usageLimit: e.target.value })} required placeholder="100" />
                    <Input label="Tanggal Kedaluwarsa (Expiry Date)" type="date" value={newVoucher.expiry} onChange={(e) => setNewVoucher({ ...newVoucher, expiry: e.target.value })} required />
                    <Button variant="primary" isLoading={creatingVoucher} className="w-full py-3">Terbitkan Voucher</Button>
                  </form>
                </div>

                {/* Buat Promo */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
                    <Percent className="w-5 h-5 text-[#0369A1]" />
                    <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                      Buat Promo Toko
                    </h3>
                  </div>
                  <form onSubmit={handleCreatePromo} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-[#0F172A] uppercase tracking-tight">Pilih Toko Mitra</label>
                      <select
                        value={newPromo.storeId}
                        onChange={(e) => setNewPromo({ ...newPromo, storeId: e.target.value })}
                        required
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#0369A1] transition-colors"
                      >
                        <option value="">-- Pilih Toko --</option>
                        {stores.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} (Seller: {s.seller?.name})</option>
                        ))}
                      </select>
                    </div>
                    <Input label="Nama Promo" value={newPromo.name} onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })} required placeholder="Contoh: Promo Spesial Tangkap Segar" />
                    <Input label="Potongan Diskon (Rp)" type="number" value={newPromo.discount} onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })} required placeholder="25000" />
                    <Input label="Tanggal Kedaluwarsa (Expiry Date)" type="date" value={newPromo.expiry} onChange={(e) => setNewPromo({ ...newPromo, expiry: e.target.value })} required />
                    <Button variant="primary" isLoading={creatingPromo} className="w-full py-3">Terbitkan Promo Toko</Button>
                  </form>
                </div>
              </div>

              {/* Monitor Vouchers & Promos List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Voucher List */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight border-b border-[#E2E8F0] pb-4">
                    Monitor Vouchers (Platform)
                  </h3>
                  {vouchers.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {vouchers.map((v) => (
                        <div key={v.id} className="flex flex-wrap items-center justify-between p-5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] gap-4 hover:border-[#CBD5E1] transition-all">
                          <div className="space-y-1">
                            <span className="text-base font-semibold tracking-tight text-[#0369A1]">{v.code}</span>
                            <div className="text-xs font-semibold text-[#0F172A]">Diskon: {formatPrice(v.discount)}</div>
                            <div className="text-xs text-[#475569]">Expiry: {new Date(v.expiry).toLocaleDateString('id-ID')}</div>
                            <div className="text-xs text-[#475569]">Usage: {v.usedCount} / {v.usageLimit} terpakai</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedVoucher(v)}>Lihat Detail</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#94A3B8] text-center py-12">Belum ada voucher yang diterbitkan.</p>
                  )}
                </div>

                {/* Promo List */}
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight border-b border-[#E2E8F0] pb-4">
                    Monitor Promos (Store)
                  </h3>
                  {promos.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {promos.map((p) => (
                        <div key={p.id} className="flex flex-wrap items-center justify-between p-5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] gap-4 hover:border-[#CBD5E1] transition-all">
                          <div className="space-y-1">
                            <span className="text-base font-semibold tracking-tight text-[#0369A1]">{p.name}</span>
                            <div className="text-xs font-semibold text-[#0F172A]">Toko: {p.store?.name}</div>
                            <div className="text-xs text-[#475569]">Diskon: {formatPrice(p.discount)}</div>
                            <div className="text-xs text-[#475569]">Expiry: {new Date(p.expiry).toLocaleDateString('id-ID')}</div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPromo(p)}>Lihat Detail</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#94A3B8] text-center py-12">Belum ada promo toko yang diterbitkan.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SLA & OVERDUE SIMULATION */}
          {activeTab === 'overdue_simulation' && (
            <div className="space-y-10">
              {/* Definisi SLA Card */}
              <div className="bg-[#EFF6FF] border border-[#0369A1]/20 rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-[#0369A1] uppercase tracking-tight flex items-center gap-2">
                  <span>Definisi SLA (Service Level Agreement) Pengiriman</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] space-y-1">
                    <span className="font-semibold text-[#0369A1] block text-base">Instant</span>
                    <p className="text-xs text-[#475569] leading-relaxed">Batas waktu pengiriman maksimal <strong className="text-[#0369A1]">1 Hari (24 Jam)</strong> sejak pesanan dibuat.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] space-y-1">
                    <span className="font-semibold text-[#0369A1] block text-base">Next Day</span>
                    <p className="text-xs text-[#475569] leading-relaxed">Batas waktu pengiriman maksimal <strong className="text-[#0369A1]">2 Hari (48 Jam)</strong> sejak pesanan dibuat.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] space-y-1">
                    <span className="font-semibold text-[#0369A1] block text-base">Regular</span>
                    <p className="text-xs text-[#475569] leading-relaxed">Batas waktu pengiriman maksimal <strong className="text-[#0369A1]">3 Hari (72 Jam)</strong> sejak pesanan dibuat.</p>
                  </div>
                </div>
                <p className="text-xs text-[#475569] pt-2 border-t border-[#0369A1]/20">
                  Jika status pesanan masih <strong>SEDANG DIKIRIM</strong> melewati batas waktu di atas, sistem akan mengklasifikasikannya sebagai pesanan <strong>Overdue</strong>. Stok akan dipulihkan ke toko (Stock Restore), dana dikembalikan ke pembeli, dan status pesanan menjadi <strong>DIKEMBALIKAN</strong>.
                </p>
              </div>

              {/* UI Simulasi Next Day / Maju Waktu & Trigger Overdue */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">UI Simulasi Maju Waktu & Trigger Overdue Handling</h3>
                  <p className="text-xs text-[#475569]">Anda dapat menyimulasikan laju waktu ke masa depan (misal: maju 3 hari) untuk memicu pemrosesan otomatis pesanan-pesanan yang melewati batas SLA.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center pt-4">
                  <div className="w-full sm:w-64 space-y-2">
                    <label className="block text-xs font-medium text-[#0F172A] uppercase tracking-tight text-center sm:text-left">Simulasi Maju Waktu (Hari)</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={simulatedDays}
                      onChange={(e) => setSimulatedDays(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3 text-center text-xl font-semibold text-[#0F172A] focus:outline-none focus:border-[#0369A1]"
                    />
                  </div>
                  <div className="w-full sm:w-auto pt-0 sm:pt-6">
                    <Button
                      variant="primary"
                      isLoading={checkingOverdue}
                      onClick={handleTriggerOverdue}
                      className="w-full sm:w-auto px-8 py-3 text-sm font-medium shadow-sm"
                    >
                      Trigger Overdue Handling (Manual Admin Trigger)
                    </Button>
                  </div>
                </div>

                {overdueResult && (
                  <div className="bg-[#DCFCE7] border border-[#bbf7d0] rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#bbf7d0] pb-3">
                      <span className="font-semibold text-[#166534] text-sm uppercase tracking-tight">Hasil Pengecekan Overdue (Simulasi +{overdueResult.simulatedDays} Hari)</span>
                      <span className="bg-[#16A34A] text-white font-semibold text-xs px-3 py-1 rounded-full">{overdueResult.totalProcessed} Pesanan Diproses</span>
                    </div>
                    {overdueResult.processedOrders?.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {overdueResult.processedOrders.map((po) => (
                          <div key={po.orderId} className="bg-white p-3 rounded-lg border border-[#bbf7d0] text-xs space-y-1 text-[#0F172A]">
                            <div><strong>Order ID:</strong> {po.orderId} | <strong>Status Baru:</strong> {po.status}</div>
                            <div><strong>Catatan:</strong> {po.message}</div>
                            <div className="text-[#166534] font-semibold">Refund & Stock Restore Berhasil Dieksekusi</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#166534] text-center py-4">Tidak ada pesanan yang melampaui batas SLA pada hari simulasi ini.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Monitor Overdue Orders List */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">Monitor Overdue Orders (DIKEMBALIKAN / DIBATALKAN)</h3>
                    <p className="text-xs text-[#475569] mt-1">Daftar riwayat pesanan yang telah dibatalkan atau dikembalikan akibat melampaui SLA pengiriman.</p>
                  </div>
                  <span className="bg-[#FEF9C3] text-[#854D0E] border border-[#fef08a] px-4 py-1.5 rounded-full text-xs font-semibold">
                    {overdueOrders.length} Pesanan Overdue
                  </span>
                </div>

                {overdueOrders.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {overdueOrders.map((order) => (
                      <div key={order.id} className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm flex flex-wrap items-center justify-between gap-6 hover:border-[#CBD5E1] transition-all">
                        <div className="space-y-1 min-w-[240px]">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#94A3B8]">Order ID: {order.id.substr(0, 14)}...</span>
                            <span className="bg-[#FEE2E2] text-[#991B1B] border border-[#fca5a5] px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-[#0F172A]">Pembeli: {order.user?.name} ({order.user?.email})</div>
                          <div className="text-xs text-[#475569]">Toko Mitra: {order.store?.name}</div>
                        </div>
                        <div className="text-xs text-[#475569] space-y-1 min-w-[200px]">
                          <div><strong className="text-[#0F172A]">Metode Pengiriman:</strong> {order.deliveryMethod}</div>
                          <div><strong className="text-[#0F172A]">Waktu Pesanan:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}</div>
                          <div><strong className="text-[#0F172A]">Waktu Overdue:</strong> {new Date(order.updatedAt).toLocaleString('id-ID')}</div>
                        </div>
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg text-right">
                          <span className="text-[10px] text-[#475569] font-medium block uppercase tracking-tight">Total Transaksi</span>
                          <span className="text-base font-semibold text-[#0F172A]">{formatPrice(order.totalAmount || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] text-center py-12">Belum ada pesanan dengan status overdue di database.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MONITOR USERS & STORES */}
          {activeTab === 'users_stores' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Users List */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">Monitor Users ({users.length})</h3>
                  <span className="bg-[#0369A1] text-white text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {users.map((u) => (
                    <div key={u.id} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-semibold text-[#0F172A] text-sm block">{u.name}</span>
                        <span className="text-xs text-[#475569] block">{u.email}</span>
                        <div className="text-[10px] text-[#94A3B8] pt-1">ID: {u.id}</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(u.roles || []).map((r) => (
                          <span key={r.role} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase ${r.role === 'ADMIN' ? 'bg-[#0369A1] text-white' : r.role === 'SELLER' ? 'bg-[#EAB308] text-white' : r.role === 'DRIVER' ? 'bg-[#16A34A] text-white' : 'bg-white text-[#475569] border border-[#E2E8F0]'}`}>
                            {r.role}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stores List */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">Monitor Stores ({stores.length})</h3>
                  <span className="bg-[#0369A1] text-white text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {stores.map((s) => (
                    <div key={s.id} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0F172A] text-sm">{s.name}</span>
                        <span className="text-xs bg-[#0369A1] text-white font-semibold px-2.5 py-0.5 rounded-full">Verified</span>
                      </div>
                      <div className="text-xs text-[#475569] space-y-0.5 border-t border-[#E2E8F0] pt-2">
                        <div><strong>Pemilik (Seller):</strong> {s.seller?.name} ({s.seller?.email})</div>
                        <div><strong>Terdaftar Pada:</strong> {new Date(s.createdAt).toLocaleDateString('id-ID')}</div>
                        <div className="text-[10px] text-[#94A3B8] pt-1">Store ID: {s.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MONITOR PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">Monitor Master Products ({products.length})</h3>
                  <p className="text-xs text-[#475569] mt-1">Daftar seluruh inventaris produk dari seluruh toko mitra di platform Seapedia.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto pr-2">
                {products.map((p) => (
                  <div key={p.id} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight block">Toko: {p.store?.name}</span>
                      <h4 className="font-semibold text-[#0F172A] text-base tracking-tight">{p.name}</h4>
                      <p className="text-xs text-[#475569] line-clamp-2 pt-1">{p.description}</p>
                    </div>
                    <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#0F172A] text-sm">{formatPrice(p.price)}</span>
                      <span className={`px-2.5 py-1 rounded-full ${p.stock > 0 ? 'bg-white text-[#475569] border border-[#E2E8F0]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                        Stok: {p.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MONITOR ORDERS & DRIVER JOBS */}
          {activeTab === 'orders_jobs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Orders List */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">Monitor Orders ({orders.length})</h3>
                  <span className="bg-[#0369A1] text-white text-xs font-semibold px-3 py-1 rounded-full">All Status</span>
                </div>
                <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94A3B8]">Order: {o.id.substr(0, 12)}...</span>
                        <span className="bg-[#0369A1] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
                          {o.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#475569] space-y-1 border-t border-[#E2E8F0] pt-2">
                        <div><strong className="text-[#0F172A]">Pembeli:</strong> {o.user?.name}</div>
                        <div><strong className="text-[#0F172A]">Toko:</strong> {o.store?.name}</div>
                        <div><strong className="text-[#0F172A]">Metode Pengiriman:</strong> {o.deliveryMethod || 'REGULAR'}</div>
                        <div><strong className="text-[#0F172A]">Waktu Pesanan:</strong> {new Date(o.createdAt).toLocaleString('id-ID')}</div>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2 text-xs font-semibold text-[#0F172A]">
                        <span>Total: {formatPrice(o.totalAmount || 0)}</span>
                        <span>Ongkir: {formatPrice(o.shippingCost || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver Jobs List */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">Monitor Delivery Jobs ({driverJobs.length})</h3>
                  <span className="bg-[#0369A1] text-white text-xs font-semibold px-3 py-1 rounded-full">Logistics</span>
                </div>
                <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2">
                  {driverJobs.map((j) => (
                    <div key={j.id} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#94A3B8]">Job ID: {j.id.substr(0, 12)}...</span>
                        <span className="bg-[#16A34A] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase">
                          {j.order?.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#475569] space-y-1 border-t border-[#E2E8F0] pt-2">
                        <div><strong className="text-[#0F172A]">Kurir (Driver):</strong> {j.driver?.name} ({j.driver?.email})</div>
                        <div><strong className="text-[#0F172A]">Toko Pengambilan:</strong> {j.order?.store?.name}</div>
                        <div><strong className="text-[#0F172A]">Kota Tujuan:</strong> {j.order?.address?.city}</div>
                        <div><strong className="text-[#0F172A]">Waktu Diambil:</strong> {new Date(j.createdAt).toLocaleString('id-ID')}</div>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2 text-xs font-semibold text-[#0F172A]">
                        <span>Potensi Upah: {formatPrice(j.order?.shippingCost || 0)}</span>
                        <span>Order ID: {j.orderId.substr(0, 8)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VOUCHER DETAIL MODAL */}
          {selectedVoucher && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="bg-[#0369A1] p-6 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-tight text-white/80">Rincian Master Voucher</span>
                    <h3 className="text-xl font-semibold tracking-tight mt-1">{selectedVoucher.code}</h3>
                  </div>
                  <button onClick={() => setSelectedVoucher(null)} className="text-white/80 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-6 text-sm">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#475569] block">Potongan Diskon:</span>
                      <span className="text-xl font-semibold text-[#0F172A]">{formatPrice(selectedVoucher.discount)}</span>
                    </div>
                    <span className="bg-[#0369A1] text-white font-medium text-xs px-3 py-1 rounded-full">PLATFORM VOUCHER</span>
                  </div>
                  <div className="space-y-3 border border-[#E2E8F0] p-4 rounded-lg text-xs text-[#475569]">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Voucher ID:</strong> <span>{selectedVoucher.id}</span></div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Tanggal Kedaluwarsa (Expiry):</strong> <span className="font-semibold text-[#0369A1]">{new Date(selectedVoucher.expiry).toLocaleDateString('id-ID')}</span></div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Batas Kuota Penggunaan:</strong> <span>{selectedVoucher.usageLimit} Transaksi</span></div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Telah Digunakan (Usage Info):</strong> <span className="font-semibold text-[#0369A1]">{selectedVoucher.usedCount} Kali</span></div>
                    <div className="flex justify-between"><strong className="text-[#0F172A]">Waktu Diterbitkan:</strong> <span>{new Date(selectedVoucher.createdAt).toLocaleString('id-ID')}</span></div>
                  </div>
                </div>
                <div className="bg-[#F8FAFC] p-4 border-t border-[#E2E8F0] flex justify-between items-center">
                  <button onClick={() => handleDeleteVoucher(selectedVoucher.id)} className="text-sm font-medium text-[#DC2626] hover:text-[#991B1B] transition-colors">
                    Hapus Voucher
                  </button>
                  <Button variant="primary" size="sm" onClick={() => setSelectedVoucher(null)}>Tutup Rincian</Button>
                </div>
              </div>
            </div>
          )}

          {/* PROMO DETAIL MODAL */}
          {selectedPromo && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="bg-[#0369A1] p-6 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-tight text-white/80">Rincian Promo Toko</span>
                    <h3 className="text-xl font-semibold tracking-tight mt-1">{selectedPromo.name}</h3>
                  </div>
                  <button onClick={() => setSelectedPromo(null)} className="text-white/80 hover:text-white bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-6 text-sm">
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#475569] block">Potongan Diskon:</span>
                      <span className="text-xl font-semibold text-[#0F172A]">{formatPrice(selectedPromo.discount)}</span>
                    </div>
                    <span className="bg-[#0369A1] text-white font-medium text-xs px-3 py-1 rounded-full">STORE PROMO</span>
                  </div>
                  <div className="space-y-3 border border-[#E2E8F0] p-4 rounded-lg text-xs text-[#475569]">
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Promo ID:</strong> <span>{selectedPromo.id}</span></div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Toko Mitra:</strong> <span className="font-semibold text-[#0369A1]">{selectedPromo.store?.name}</span></div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Store ID:</strong> <span>{selectedPromo.storeId}</span></div>
                    <div className="flex justify-between border-b border-[#E2E8F0] pb-2"><strong className="text-[#0F172A]">Tanggal Kedaluwarsa (Expiry):</strong> <span className="font-semibold text-[#0369A1]">{new Date(selectedPromo.expiry).toLocaleDateString('id-ID')}</span></div>
                    <div className="flex justify-between"><strong className="text-[#0F172A]">Waktu Diterbitkan:</strong> <span>{new Date(selectedPromo.createdAt).toLocaleString('id-ID')}</span></div>
                  </div>
                </div>
                <div className="bg-[#F8FAFC] p-4 border-t border-[#E2E8F0] flex justify-between items-center">
                  <button onClick={() => handleDeletePromo(selectedPromo.id)} className="text-sm font-medium text-[#DC2626] hover:text-[#991B1B] transition-colors">
                    Hapus Promo
                  </button>
                  <Button variant="primary" size="sm" onClick={() => setSelectedPromo(null)}>Tutup Rincian</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </SidebarLayout>
    </ProtectedRoute>
  );
}
