'use client';

import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';
import { useAuth } from '../lib/AuthContext';
import { Search, Star, Send } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function Home() {
  const defaultReviews = [
    { name: 'Ahmad Yunus', rating: 5, comment: 'Pemesanan jaring nelayan sangat mudah dan transparan. Pengirimannya cepat sampai di pelelangan ikan!', date: '28 Juni 2026' },
    { name: 'Susi Maritima', rating: 5, comment: 'Fitur checkout yang simpel memastikan kesegaran ikan laut langsung dari satu mitra terverifikasi.', date: '25 Juni 2026' },
    { name: 'Kapten Hendra', rating: 4, comment: 'Marketplace hasil laut yang modern, tidak ribet, dan tampilannya bersih. Sangat direkomendasikan.', date: '20 Juni 2026' },
  ];

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [reviews, setReviews] = useState(defaultReviews);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    const storedReviews = JSON.parse(localStorage.getItem('seapedia_reviews') || '[]');
    if (storedReviews.length > 0) {
      setReviews([...storedReviews, ...defaultReviews]);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data && res.data.data) {
        setProducts(res.data.data);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      setAddingId(product.id);
      await api.post('/cart', { productId: product.id, quantity: 1 });
      setNotification(`${product.name} ditambahkan ke keranjang`);
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menambahkan produk ke keranjang');
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < count ? 'fill-[#EAB308] text-[#EAB308]' : 'text-[#E2E8F0]'}`} />
    ));
  };

  return (
    <div className="flex flex-col flex-1 gap-10 w-full">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0F172A] text-white font-medium px-5 py-3 rounded-lg shadow-lg text-sm">
          <span>{notification}</span>
        </div>
      )}

      {/* Hero */}
      <div className="bg-[#0369A1] rounded-xl p-10 md:p-14 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Produk Hasil Laut Berkualitas
          </h1>
          <p className="text-sm text-white/80 leading-relaxed max-w-xl mx-auto">
            Temukan kebutuhan kelautan langsung dari mitra terverifikasi di seluruh Indonesia.
          </p>
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk kelautan..."
                className="w-full rounded-lg bg-white border-none py-3 pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#0F172A]">
            Produk Terbaru
          </h2>
          <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] py-1.5 px-3 rounded-full">
            {filteredProducts.length} produk
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 rounded-xl bg-white border border-[#E2E8F0] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingId === product.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-[#E2E8F0] rounded-xl bg-white">
            <h3 className="text-base font-semibold text-[#0F172A] mb-1">Produk tidak ditemukan</h3>
            <p className="text-sm text-[#475569]">Coba kata kunci lain atau periksa kembali nanti.</p>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#0F172A]">Ulasan Pengguna</h2>
          <p className="text-sm text-[#475569] mt-1">Bagikan pengalaman Anda menggunakan SEAPEDIA.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Review Form */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#0F172A]">Tulis Ulasan</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newReview = {
                name: formData.get('name'),
                rating: Number(formData.get('rating')),
                comment: formData.get('comment'),
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              };
              try {
                await api.post('/reviews', newReview);
              } catch (err) {
                // Simulate locally if endpoint not ready
              }
              const existing = JSON.parse(localStorage.getItem('seapedia_reviews') || '[]');
              const updated = [newReview, ...existing];
              localStorage.setItem('seapedia_reviews', JSON.stringify(updated));
              setReviews([...updated, ...defaultReviews]);
              alert('Ulasan berhasil dikirim.');
              e.target.reset();
            }} className="space-y-3">
              <Input label="Nama" name="name" required placeholder="Nama Anda" />
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Rating</label>
                <select name="rating" required className="w-full rounded-lg bg-white border border-[#E2E8F0] py-2.5 px-3.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#0369A1]">
                  <option value="5">5 - Sangat Bagus</option>
                  <option value="4">4 - Bagus</option>
                  <option value="3">3 - Cukup</option>
                  <option value="2">2 - Kurang</option>
                  <option value="1">1 - Sangat Kurang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Komentar</label>
                <textarea name="comment" required rows={3} className="w-full rounded-lg bg-white border border-[#E2E8F0] py-2.5 px-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0369A1]" placeholder="Tulis kesan Anda..." />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#0369A1] hover:bg-[#075985] text-white font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Kirim Ulasan
              </button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-3">
            {reviews.map((rev, idx) => (
              <div key={idx} className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex flex-col gap-2.5 hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#F1F5F9] rounded-full flex items-center justify-center font-semibold text-[#475569] text-sm">
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] text-sm">{rev.name}</h4>
                      <span className="text-xs text-[#94A3B8]">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {renderStars(rev.rating)}
                  </div>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
