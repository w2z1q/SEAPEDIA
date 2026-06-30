'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice, translateDelivery } from '../../../lib/utils';
import { MapPin, Truck, Tag } from 'lucide-react';

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState({ address: '', city: '', zipCode: '' });
  const [addingAddress, setAddingAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('REGULAR');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  useEffect(() => {
    if (user) { fetchData(); } else { setLoading(false); }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const cartRes = await api.get('/cart');
      setCart(cartRes.data?.data || cartRes.data);
      const profRes = await api.get('/auth/profile');
      const userAddresses = profRes.data?.data?.addresses || profRes.data?.user?.addresses || [];
      if (userAddresses.length > 0) {
        setAddresses(userAddresses);
        setSelectedAddressId(userAddresses[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch checkout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setAddingAddress(true);
      const res = await api.post('/auth/address', newAddress).catch(async () => {
        const dummyAddress = { id: `addr-${Date.now()}`, ...newAddress };
        setAddresses([...addresses, dummyAddress]);
        setSelectedAddressId(dummyAddress.id);
        return { data: dummyAddress };
      });
      if (res.data) {
        fetchData();
        setNewAddress({ address: '', city: '', zipCode: '' });
      }
    } catch (error) {
      alert('Gagal menambahkan alamat');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleApplyVoucher = async () => {
    try {
      setVoucherError('');
      const res = await api.post('/vouchers/validate', { code: voucherCode });
      setAppliedVoucher(res.data?.data || res.data);
      alert('Voucher berhasil diterapkan!');
    } catch (error) {
      setVoucherError(error.response?.data?.message || 'Voucher tidak valid');
    }
  };

  const handlePlaceOrder = async () => {
    const finalAddressId = selectedAddressId || (addresses[0]?.id) || 'addr-default';
    try {
      setPlacingOrder(true);
      const cartItemsList = cart?.items || cart?.cartItems || [];
      const payload = { addressId: finalAddressId, deliveryMethod };
      if (appliedVoucher) payload.voucherId = appliedVoucher.id;
      const storeId = cartItemsList[0]?.product?.storeId;
      if (storeId) payload.storeId = storeId;
      await api.post('/orders/checkout', payload);
      alert('Pesanan berhasil dibuat!');
      router.push('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membuat pesanan. Pastikan saldo mencukupi.');
    } finally {
      setPlacingOrder(false);
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

  const cartItems = cart?.items || cart?.cartItems || [];
  if (cartItems.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-4">
        <h2 className="text-xl font-semibold text-[#0F172A]">Keranjang kosong</h2>
        <p className="text-sm text-[#475569]">Tidak ada produk yang bisa di-checkout.</p>
        <Link href="/" className="inline-block"><Button variant="primary">Katalog</Button></Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.originalPrice * item.quantity), 0);
  const effectiveSubtotal = cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  const promoDiscount = subtotal - effectiveSubtotal;
  
  const shippingCost = deliveryMethod === 'INSTANT' ? 25000 : deliveryMethod === 'NEXT_DAY' ? 15000 : 10000;
  
  // Voucher is calculated on the effective subtotal to prevent double discount abuse
  const rawDiscount = appliedVoucher ? (appliedVoucher.discount <= 100 ? effectiveSubtotal * (appliedVoucher.discount / 100) : appliedVoucher.discount) : 0;
  const voucherDiscount = Math.min(effectiveSubtotal, rawDiscount);
  
  const discount = voucherDiscount + promoDiscount;
  const tax = (subtotal - discount + shippingCost) * 0.12;
  const total = subtotal - discount + shippingCost + tax;

  const deliveryOptions = [
    { key: 'REGULAR', price: 10000, desc: 'Estimasi 2-3 hari' },
    { key: 'NEXT_DAY', price: 15000, desc: 'Estimasi 1 hari' },
    { key: 'INSTANT', price: 25000, desc: 'Pengiriman hari ini' },
  ];

  return (
    <div className="flex flex-col flex-1 gap-6 w-full">
      <h1 className="text-xl font-semibold text-[#0F172A]">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Alamat */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <MapPin className="w-4 h-4 text-[#DC2626]" />
              <h3 className="text-sm font-semibold text-[#0F172A]">Alamat Pengiriman</h3>
            </div>

            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedAddressId === addr.id ? 'bg-[#FEF2F2] border-[#DC2626]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-[#0F172A] text-sm">{addr.city}</span>
                      {selectedAddressId === addr.id && (
                        <span className="bg-[#DC2626] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">Terpilih</span>
                      )}
                    </div>
                    <p className="text-[#475569] text-sm">{addr.address}</p>
                    <span className="text-xs text-[#94A3B8] mt-1 inline-block">Kode Pos: {addr.zipCode}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">Belum ada alamat tersimpan.</p>
            )}

            <form onSubmit={handleAddAddress} className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <h4 className="font-medium text-[#0F172A] text-sm">Tambah Alamat Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Kota" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required placeholder="Kota / Kabupaten" />
                <Input label="Kode Pos" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} required placeholder="12345" />
              </div>
              <Input label="Alamat Lengkap" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} required placeholder="Jalan, nomor rumah, kelurahan..." />
              <Button variant="secondary" isLoading={addingAddress} className="w-full">Simpan Alamat</Button>
            </form>
          </div>

          {/* Metode Pengiriman */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <Truck className="w-4 h-4 text-[#DC2626]" />
              <h3 className="text-sm font-semibold text-[#0F172A]">Metode Pengiriman</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {deliveryOptions.map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setDeliveryMethod(opt.key)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    deliveryMethod === opt.key ? 'bg-[#FEF2F2] border-[#DC2626]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[#0F172A] text-sm">{translateDelivery(opt.key)}</span>
                    <span className="text-[#0F172A] font-semibold text-sm">{formatPrice(opt.price)}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Rincian Pembayaran</h3>

          <div className="space-y-2.5 border-b border-[#E2E8F0] pb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-[#475569] line-clamp-1">{item.product?.name} <span className="text-[#0F172A] font-medium">x{item.quantity}</span></span>
                <div className="flex flex-col items-end">
                  {item.product?.originalPrice > item.product?.price && (
                    <span className="text-xs text-[#94A3B8] line-through font-medium -mb-0.5">
                      {formatPrice(item.product?.originalPrice * item.quantity)}
                    </span>
                  )}
                  <span className="font-medium text-[#0F172A]">{formatPrice(item.product?.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher */}
          <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium">
              <Tag className="w-3.5 h-3.5" />
              <span>Kode Voucher</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Masukkan kode" className="w-full rounded-lg bg-white border border-[#E2E8F0] py-2 px-3 text-sm text-[#0F172A] focus:border-[#DC2626] outline-none"
              />
              <Button variant="secondary" size="sm" onClick={handleApplyVoucher}>Pakai</Button>
            </div>
            {voucherError && <p className="text-xs text-[#DC2626]">{voucherError}</p>}
            {appliedVoucher && <p className="text-xs text-[#166534] font-medium">Voucher {appliedVoucher.code} aktif (-{formatPrice(discount)})</p>}
          </div>

          <div className="space-y-2 text-sm text-[#475569] pb-3 border-b border-[#E2E8F0]">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-[#0F172A]">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Ongkir ({translateDelivery(deliveryMethod)})</span><span className="font-medium text-[#0F172A]">{formatPrice(shippingCost)}</span></div>
            {promoDiscount > 0 && <div className="flex justify-between text-[#166534]"><span>Diskon Promo</span><span className="font-medium">-{formatPrice(promoDiscount)}</span></div>}
            {voucherDiscount > 0 && <div className="flex justify-between text-[#166534]"><span>Diskon Voucher {appliedVoucher ? (appliedVoucher.discount <= 100 ? `(${appliedVoucher.discount}%)` : `(${formatPrice(appliedVoucher.discount)})`) : ''}</span><span className="font-medium">-{formatPrice(voucherDiscount)}</span></div>}
            <div className="flex justify-between"><span>PPN (12%)</span><span className="font-medium text-[#0F172A]">{formatPrice(tax)}</span></div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-medium text-[#0F172A] text-sm">Total</span>
            <span className="text-lg font-semibold text-[#0F172A]">{formatPrice(total)}</span>
          </div>

          <Button variant="primary" size="lg" isLoading={placingOrder} onClick={handlePlaceOrder} className="w-full">
            Bayar Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
