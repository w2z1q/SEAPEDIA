'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Link from 'next/link';
import Button from '../../../../components/Button';
import { useParams } from 'next/navigation';
import { formatPrice, translateStatus, translateDelivery, statusBadgeClass, formatDateTime } from '../../../../lib/utils';
import { ArrowLeft, Package, CheckCircle, Clock, Truck, RotateCcw } from 'lucide-react';

export default function OrderDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && params?.id) { fetchOrderDetail(); } else if (!user) { setLoading(false); }
  }, [user, params?.id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${params.id}`);
      setOrder(res.data?.data || res.data);
    } catch (error) {
      console.error('Failed to fetch order detail:', error);
    } finally {
      setLoading(false);
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

  if (loading) return <div className="w-full animate-pulse space-y-4 py-12"><div className="h-36 bg-white border border-[#E2E8F0] rounded-xl" /><div className="h-56 bg-white border border-[#E2E8F0] rounded-xl" /></div>;

  if (!order) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-14 text-center shadow-sm max-w-md mx-auto my-12 space-y-3">
        <h3 className="text-base font-semibold text-[#0F172A]">Pesanan tidak ditemukan</h3>
        <p className="text-sm text-[#475569]">Pesanan ini tidak ada atau bukan milik Anda.</p>
        <Link href="/orders" className="inline-block mt-2"><Button variant="primary">Kembali</Button></Link>
      </div>
    );
  }

  const isRefunded = order.status === 'DIBATALKAN' || order.status === 'REFUND';
  const createdDate = new Date(order.createdAt);
  const updatedDate = new Date(order.updatedAt);

  return (
    <div className="flex flex-col flex-1 gap-6 w-full max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/orders" className="text-xs font-medium text-[#0369A1] hover:underline flex items-center gap-1 mb-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </Link>
          <h1 className="text-xl font-semibold text-[#0F172A]">
            Detail Pesanan #{order.id.substr(0, 8)}
          </h1>
        </div>
        <span className={`px-4 py-1.5 rounded-full font-medium text-sm ${statusBadgeClass(order.status)}`}>
          {translateStatus(order.status)}
        </span>
      </div>

      {isRefunded && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 flex items-start gap-4">
          <RotateCcw className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#991B1B] text-sm">Dana telah dikembalikan</h3>
            <p className="text-sm text-[#991B1B]/80 mt-1">
              Sebesar {formatPrice(order.total || order.subtotal)} telah dikembalikan ke dompet Anda.
            </p>
            <Link href="/wallet" className="text-xs font-medium text-[#991B1B] hover:underline mt-1.5 inline-block">
              Lihat riwayat dompet
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">
              Produk ({order.orderItems?.length || 0})
            </h3>
            <div className="space-y-2.5">
              {(order.orderItems || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                      {item.product?.imageUrl || item.product?.image ? (
                        <img src={(item.product?.imageUrl || item.product?.image).startsWith('http') ? (item.product?.imageUrl || item.product?.image) : `http://localhost:5000${item.product?.imageUrl || item.product?.image}`} alt={item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-[#94A3B8]" /></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0F172A] text-sm">{item.product?.name || 'Produk'}</h4>
                      <span className="text-xs text-[#94A3B8]">{formatPrice(item.price || item.product?.price)} x {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-medium text-[#0F172A] text-sm">{formatPrice((item.price || item.product?.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">
              Riwayat Status
            </h3>
            <div className="relative border-l-2 border-[#E2E8F0] ml-3 space-y-6 py-1">
              <TimelineItem icon={<CheckCircle className="w-3.5 h-3.5" />} title="Pesanan dibuat" time={formatDateTime(createdDate)} desc="Stok produk telah diamankan." active />
              <TimelineItem icon={<Clock className="w-3.5 h-3.5" />} title="Pembayaran diverifikasi" time={formatDateTime(new Date(createdDate.getTime() + 2000))} desc="Saldo dompet berhasil dipotong." active />
              <TimelineItem icon={<Truck className="w-3.5 h-3.5" />} title={`Status: ${translateStatus(order.status)}`} time={formatDateTime(updatedDate)} desc={
                order.status === 'SEDANG_DIKEMAS' ? 'Toko sedang menyiapkan pesanan.' :
                order.status === 'SEDANG_DIKIRIM' ? 'Pesanan dalam perjalanan.' :
                order.status === 'SELESAI' || order.status === 'PESANAN_SELESAI' ? 'Pesanan selesai.' :
                isRefunded ? 'Pesanan dibatalkan dan dana dikembalikan.' : ''
              } active={order.status !== 'SEDANG_DIKEMAS'} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Rincian Transaksi</h3>
            <div className="space-y-2 text-sm text-[#475569] pb-3 border-b border-[#E2E8F0]">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-[#0F172A]">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Ongkir ({translateDelivery(order.deliveryMethod)})</span><span className="font-medium text-[#0F172A]">{formatPrice(order.shippingCost)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[#166534]"><span>Diskon</span><span className="font-medium">-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span>PPN (12%)</span><span className="font-medium text-[#0F172A]">{formatPrice(order.tax)}</span></div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-medium text-[#0F172A] text-sm">Total</span>
              <span className="text-lg font-semibold text-[#0F172A]">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">Info Pengiriman</h3>
            <div>
              <span className="text-xs text-[#94A3B8]">Metode</span>
              <div className="text-sm font-medium text-[#0F172A] mt-0.5">{translateDelivery(order.deliveryMethod)}</div>
            </div>
            {order.address ? (
              <div>
                <span className="text-xs text-[#94A3B8]">Alamat tujuan</span>
                <p className="text-sm text-[#475569] mt-0.5">{order.address.address}, {order.address.city}</p>
                <span className="text-xs text-[#94A3B8]">Kode Pos: {order.address.zipCode}</span>
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">Alamat default sistem.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ icon, title, time, desc, active }) {
  return (
    <div className="relative pl-6">
      <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${active ? 'bg-[#0369A1] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>
        {icon}
      </div>
      <h4 className="font-medium text-[#0F172A] text-sm">{title}</h4>
      <p className="text-xs text-[#94A3B8] mt-0.5">{time}</p>
      {desc && <p className="text-xs text-[#475569] mt-1">{desc}</p>}
    </div>
  );
}
