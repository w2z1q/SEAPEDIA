'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '../../../../lib/utils';
import { ArrowLeft, ShoppingCart, Package, Star, Minus, Plus, Send, X, AlertTriangle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [storeWarning, setStoreWarning] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [notification, setNotification] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { if (id) fetchProductDetail(); }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      const data = res.data?.data || res.data;
      setProduct(data);
      if (data?.reviews) setReviews(data.reviews);
      try {
        const revRes = await api.get(`/reviews/product/${id}`);
        if (revRes.data?.data) setReviews(revRes.data.data);
      } catch (e) { /* use embedded */ }
    } catch (error) {
      console.error('Failed to fetch product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      setAdding(true);
      setStoreWarning(false);
      await api.post('/cart', { productId: product.id, quantity: Number(quantity) });
      setNotification(`${quantity} ${product.name} ditambahkan ke keranjang`);
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      if (error.response?.status === 409) {
        setStoreWarning(true);
      } else {
        alert(error.response?.data?.message || 'Gagal menambahkan ke keranjang');
      }
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      const payload = { productId: product.id, rating: Number(rating), content };
      if (!user) {
        if (!guestName) { alert('Masukkan nama Anda'); return; }
        payload.guestName = guestName;
      }
      await api.post('/reviews', payload);
      setContent(''); setGuestName('');
      alert('Ulasan berhasil dikirim!');
      fetchProductDetail();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengirim ulasan');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (count) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-3.5 h-3.5 ${i < count ? 'fill-[#EAB308] text-[#EAB308]' : 'text-[#E2E8F0]'}`} />
  ));

  if (loading) return (
    <div className="w-full animate-pulse space-y-6 py-12">
      <div className="h-6 bg-white border border-[#E2E8F0] rounded-lg max-w-xs" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-white border border-[#E2E8F0] rounded-xl" />
        <div className="h-80 bg-white border border-[#E2E8F0] rounded-xl" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center my-12 shadow-sm">
      <h2 className="text-xl font-semibold text-[#0F172A]">Produk tidak ditemukan</h2>
      <Link href="/" className="mt-3 inline-block text-sm text-[#0369A1] font-medium hover:underline">Kembali ke Katalog</Link>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 gap-8 w-full">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0F172A] text-white font-medium px-5 py-3 rounded-lg shadow-lg text-sm">
          <span>{notification}</span>
          <Link href="/cart" className="bg-white text-[#0F172A] px-3 py-1 rounded-md text-xs font-medium">Keranjang</Link>
        </div>
      )}

      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0369A1] hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Katalog
      </Link>

      {/* Product Top */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden h-[400px] flex items-center justify-center">
          {product.image || product.imageUrl ? (
            <img src={(product.image || product.imageUrl).startsWith('http') ? (product.image || product.imageUrl) : `http://localhost:5000${product.image || product.imageUrl}`} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
              <Package className="w-14 h-14" />
              <span className="text-sm font-medium">Belum ada foto</span>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 flex flex-col gap-5">
          <div className="border-b border-[#E2E8F0] pb-5">
            <span className="text-xs font-medium text-[#0369A1]">{product.store?.name || 'Seapedia'}</span>
            <h1 className="text-2xl font-semibold text-[#0F172A] mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-[#94A3B8]">Stok:</span>
              <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] py-0.5 px-2 rounded">{product.stock}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#94A3B8]">Harga</span>
            <span className="text-2xl font-semibold text-[#0F172A] block mt-0.5">{formatPrice(product.price)}</span>
          </div>

          <div>
            <h3 className="font-medium text-[#0F172A] text-sm mb-1">Deskripsi</h3>
            <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#0F172A]">Jumlah</span>
              <div className="flex items-center gap-0.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-[#475569] hover:text-[#0F172A]">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium text-sm text-[#0F172A]">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 flex items-center justify-center text-[#475569] hover:text-[#0F172A]">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {storeWarning && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2.5 relative mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="pr-6">
                  <h4 className="text-sm font-semibold text-red-900">Toko Berbeda</h4>
                  <p className="text-xs text-red-800 mt-0.5 leading-snug">Keranjangmu sudah berisi barang dari toko lain. Menyelesaikan ini akan mengganti isi keranjang dengan produk dari toko ini. Lanjutkan dengan hapus keranjang?</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs border-red-200 text-red-700 bg-white" onClick={async () => {
                    // Quick clear cart via backend if there was a direct endpoint, 
                    // else we can just show warning. The backend throws 409. The user actually needs to clear the cart or we can add a 'force: true' to the endpoint.
                    // For now, the user must clear it manually or we redirect to cart.
                    window.location.href = '/cart';
                  }}>Lihat Keranjang</Button>
                </div>
                <button onClick={() => setStoreWarning(false)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
              </div>
            )}

            <Button variant="primary" size="lg" isLoading={adding} disabled={product.stock === 0} onClick={handleAddToCart} className="w-full">
              <ShoppingCart className="w-5 h-5" />
              Tambah ke Keranjang ({quantity})
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A]">Tulis Ulasan</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            {!user && <Input label="Nama (Tamu)" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nama Anda" required />}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded-lg bg-white border border-[#E2E8F0] py-2.5 px-3.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#0369A1]">
                <option value={5}>5 - Sangat Bagus</option>
                <option value={4}>4 - Bagus</option>
                <option value={3}>3 - Cukup</option>
                <option value={2}>2 - Kurang</option>
                <option value={1}>1 - Sangat Kurang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Isi Ulasan</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={3} placeholder="Bagikan pengalaman Anda..." className="w-full rounded-lg bg-white border border-[#E2E8F0] py-2.5 px-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0369A1]" />
            </div>
            <Button variant="primary" isLoading={submittingReview} className="w-full">
              <Send className="w-4 h-4" /> Kirim Ulasan
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#0F172A] pb-3 border-b border-[#E2E8F0]">
            Ulasan ({reviews.length})
          </h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="border-b border-[#E2E8F0] last:border-0 pb-4 last:pb-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center font-semibold text-[#475569] text-sm">
                        {(rev.user?.name || rev.guestName || 'T')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F172A] text-sm">{rev.user?.name || rev.guestName || 'Tamu'}</h4>
                        <span className="text-xs text-[#94A3B8]">{new Date(rev.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">{renderStars(rev.rating)}</div>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed">{rev.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm text-[#94A3B8]">Belum ada ulasan. Jadilah yang pertama!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
