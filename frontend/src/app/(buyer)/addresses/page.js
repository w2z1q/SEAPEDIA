'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { MapPin, Plus, X } from 'lucide-react';

export default function AddressesPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Address states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', city: '', zipCode: '' });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (user) { 
      fetchProfile();
    } else { 
      setLoading(false); 
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/profile');
      setProfile(res.data?.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      await api.post('/auth/address', newAddress);
      alert('Alamat berhasil ditambahkan!');
      setShowAddressModal(false);
      setNewAddress({ address: '', city: '', zipCode: '' });
      fetchProfile(); // Refresh list of addresses
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menambahkan alamat');
    } finally {
      setSavingAddress(false);
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

  if (loading && !profile) return <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12" />;

  const addresses = profile?.addresses || [];

  return (
    <div className="flex flex-col flex-1 gap-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#0F172A]">Daftar Alamat</h1>
        <Button variant="primary" onClick={() => setShowAddressModal(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tambah Alamat Baru
        </Button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        {addresses.length > 0 ? (
          <div className="divide-y divide-[#E2E8F0]">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start gap-4 p-5 hover:bg-[#F8FAFC] transition-colors">
                <div className="mt-1 text-[#DC2626] bg-red-50 p-2 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-[#0F172A]">{addr.city}</h4>
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{addr.zipCode}</span>
                  </div>
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed">{addr.address}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-[#E2E8F0]">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A] mb-1">Belum ada alamat</h3>
            <p className="text-sm text-[#475569] max-w-sm">Kamu belum menambahkan alamat pengiriman. Tambahkan alamat sekarang untuk mempermudah saat checkout.</p>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h3 className="text-lg font-semibold text-[#0F172A]">Tambah Alamat Baru</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-[#475569] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <Input
                label="Kota"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder="Contoh: Jakarta Selatan"
              />
              <Input
                label="Kode Pos"
                required
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                placeholder="Contoh: 12345"
              />
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#334155]">Alamat Lengkap</label>
                <textarea
                  required
                  rows={3}
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] transition-colors resize-none"
                  placeholder="Nama jalan, gedung, no. rumah..."
                />
              </div>
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddressModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" className="flex-1" isLoading={savingAddress}>Simpan Alamat</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
