'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useAuth } from '../lib/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Car,
  Book,
  Gamepad2,
  Flower2,
  Baby,
  ArrowRight,
  Star,
  Send,
  AlertTriangle,
  X,
} from 'lucide-react';

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const FEATURED_CATEGORIES = [
  { id: 'elektronik', label: 'Elektronik', icon: Smartphone, color: '#EFF6FF', iconColor: '#2563EB' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, color: '#FDF4FF', iconColor: '#9333EA' },
  { id: 'rumah-tangga', label: 'Rumah Tangga', icon: HomeIcon, color: '#F0FDF4', iconColor: '#16A34A' },
  { id: 'kecantikan', label: 'Kecantikan', icon: Sparkles, color: '#FFF7ED', iconColor: '#EA580C' },
  { id: 'olahraga', label: 'Olahraga', icon: Dumbbell, color: '#FEF2F2', iconColor: '#DC2626' },
  { id: 'makanan', label: 'Makanan', icon: UtensilsCrossed, color: '#FFFBEB', iconColor: '#D97706' },
  { id: 'otomotif', label: 'Otomotif', icon: Car, color: '#F0F9FF', iconColor: '#0284C7' },
  { id: 'buku', label: 'Buku', icon: Book, color: '#F0FDF4', iconColor: '#059669' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#F5F3FF', iconColor: '#7C3AED' },
  { id: 'tanaman', label: 'Tanaman', icon: Flower2, color: '#F0FDF4', iconColor: '#15803D' },
  { id: 'bayi', label: 'Bayi & Anak', icon: Baby, color: '#FFF0F3', iconColor: '#E11D48' },
  { id: 'flash', label: 'Flash Sale', icon: Zap, color: '#FFFBEB', iconColor: '#CA8A04' },
];

const HERO_SLIDES = [
  {
    id: 1,
    image: '/banner1.png',
  },
  {
    id: 2,
    image: '/banner2.png',
  },
  {
    id: 3,
    image: '/banner3.png',
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse" style={{ border: '1px solid #F3F4F6' }}>
      <div className="h-48 bg-gray-200" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
        <div className="h-8 bg-gray-200 rounded-lg mt-3" />
      </div>
    </div>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = HERO_SLIDES.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => { timerRef.current = setInterval(next, 4000); };

  const slide = HERO_SLIDES[current];

  return (
    <div
      className="relative rounded-2xl overflow-hidden select-none group aspect-[2/1] sm:aspect-[16/5] w-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Sliding Track */}
      <div
        className="flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {HERO_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="relative flex-shrink-0 w-full h-full flex items-center"
          >
            {/* Pure Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all z-20" aria-label="Sebelumnya">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all z-20" aria-label="Berikutnya">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 20 : 8, height: 8, background: i === current ? '#fff' : 'rgba(255,255,255,0.45)' }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, linkLabel, href }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {linkLabel && href && (
        <Link href={href} className="text-sm font-semibold flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: '#DC2626' }}>
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function HomeContent() {
  const defaultReviews = [
    { id: 'd1', guestName: 'Ahmad Yunus', user: null, rating: 5, content: 'Marketplace yang sangat mudah digunakan. Pengirimannya cepat dan produknya berkualitas!', createdAt: '2026-06-28' },
    { id: 'd2', guestName: 'Susi Pratiwi', user: null, rating: 5, content: 'Belanja jadi lebih praktis. Penjual terverifikasi bikin saya lebih percaya.', createdAt: '2026-06-25' },
    { id: 'd3', guestName: 'Hendra Gunawan', user: null, rating: 4, content: 'Tampilan modern, tidak ribet, dan pilihan produknya beragam. Sangat direkomendasikan.', createdAt: '2026-06-20' },
  ];

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [reviews, setReviews] = useState(defaultReviews);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [storeWarning, setStoreWarning] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag to scroll logic for categories
  const categoryScrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    if (!categoryScrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - categoryScrollRef.current.offsetLeft;
    scrollLeft.current = categoryScrollRef.current.scrollLeft;
    categoryScrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeaveOrUp = () => {
    if (!categoryScrollRef.current) return;
    isDragging.current = false;
    categoryScrollRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    categoryScrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    setScrollProgress(scrollLeft / maxScroll);
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { user } = useAuth();

  // Fetch products — satu effect untuk handle page & search sekaligus
  const prevSearchRef = useRef(searchQuery);

  useEffect(() => {
    let page = currentPage;

    // Jika query berubah, reset ke page 1
    if (prevSearchRef.current !== searchQuery) {
      prevSearchRef.current = searchQuery;
      page = 1;
      setCurrentPage(1);
    }

    const timer = setTimeout(() => fetchProducts(page, searchQuery), 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (data.length > 0) {
          setReviews([...data, ...defaultReviews]);
        }
      } catch {
        // use defaults
      }
    };
    fetchReviews();
  }, []);

  const fetchProducts = async (page = 1, query = '') => {
    try {
      setLoadingProducts(true);
      const params = { page, limit: 8 };
      if (query) params.search = query;
      const res = await api.get('/products', { params });
      if (res.data?.data) {
        setProducts(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalProducts(res.data.pagination?.total || res.data.data.length);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
        setTotalPages(1);
        setTotalProducts(res.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) { router.push('/login'); return; }
    try {
      setAddingId(product.id);
      setStoreWarning(false);
      await api.post('/cart', { productId: product.id, quantity: 1 });
      setNotification(`${product.name} ditambahkan ke keranjang ✓`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setStoreWarning(true);
      } else {
        alert(err.response?.data?.message || 'Gagal menambahkan ke keranjang');
      }
    } finally {
      setAddingId(null);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewName.trim()) return;
    setSubmittingReview(true);
    const newReview = {
      id: `local-${Date.now()}`,
      guestName: reviewName,
      user: null,
      rating: reviewRating,
      content: reviewComment,
      createdAt: new Date().toISOString(),
    };
    try {
      await api.post('/reviews', { guestName: reviewName, rating: reviewRating, content: reviewComment });
    } catch { /* ignore */ }
    setReviews((prev) => [newReview, ...prev]);
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setSubmittingReview(false);
  };

  const formatDate = (str) => {
    try {
      return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return str; }
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-8">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 text-white font-medium px-5 py-3 rounded-xl shadow-xl text-sm" style={{ background: '#DC2626' }}>
          {notification}
        </div>
      )}

      {/* Store Warning Modal */}
      {storeWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xl relative">
            <button onClick={() => setStoreWarning(false)} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A]">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold text-[#0F172A]">Toko Berbeda</h3>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed mb-5">
              Keranjangmu sudah berisi produk dari toko lain. Untuk membeli produk ini, kamu harus membersihkan keranjangmu terlebih dahulu.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setStoreWarning(false)}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={() => { window.location.href = '/cart'; }}>Lihat Keranjang</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Hero Carousel ── */}
      <HeroCarousel />

      {/* ── 2. Kategori ── */}
      <section>
        <SectionHeader title="Kategori" />
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div 
            ref={categoryScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            onScroll={handleScroll}
            className="flex overflow-x-auto sm:grid sm:grid-cols-8 gap-y-6 gap-x-3 pb-3 hide-scrollbar select-none cursor-grab" 
            style={{ scrollbarWidth: 'none' }}
          >
            {FEATURED_CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const isHiddenOnDesktop = !showAllCategories && index >= 8;
              return (
                <button key={cat.id} className={`flex flex-col items-center gap-2.5 group shrink-0 w-[calc(25%-9px)] sm:w-auto ${isHiddenOnDesktop ? 'sm:hidden' : ''}`}>
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 shadow-sm border border-white group-hover:shadow-md"
                    style={{ background: cat.color }}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: cat.iconColor }} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-red-600 transition-colors">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Scroll Indicator (Dot) */}
          <div className="flex justify-center mt-3 sm:hidden">
            <div className="w-12 h-1.5 bg-gray-100 rounded-full relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full w-4 bg-red-500 rounded-full"
                style={{ transform: `translateX(${scrollProgress * (48 - 16)}px)` }}
              />
            </div>
          </div>

          {FEATURED_CATEGORIES.length > 8 && (
            <div className="hidden sm:flex justify-center mt-6 pt-5 border-t border-gray-50">
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex items-center gap-1.5 text-xs font-bold px-5 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                {showAllCategories ? (
                  <>Tutup <ChevronLeft className="w-3.5 h-3.5 rotate-90" /></>
                ) : (
                  <>Tampilkan Lainnya <ChevronRight className="w-3.5 h-3.5 rotate-90" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Produk Terbaru ── */}
      <section>
        <SectionHeader
          title={searchQuery ? `Hasil pencarian "${searchQuery}"` : 'Produk Terbaru'}
          linkLabel={`Lihat Semua`}
          href="/products"
        />

        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAdding={addingId === product.id}
                />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className="w-9 h-9 text-sm font-semibold rounded-lg transition-colors"
                    style={currentPage === p ? { background: '#DC2626', color: '#fff' } : { background: '#fff', color: '#374151', border: '1px solid #E5E7EB' }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center bg-white rounded-xl" style={{ border: '1px solid #F3F4F6' }}>
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada produk'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Coba kata kunci lain.' : 'Produk akan segera hadir!'}
            </p>
          </div>
        )}
      </section>

      {/* ── 4. Ulasan Pengguna ── */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm" style={{ border: '1px solid #F3F4F6' }}>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Ulasan Pengguna</h2>
          <p className="text-sm text-gray-500 mt-1">Bagikan pengalaman Anda berbelanja di SEAPEDIA.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="rounded-xl p-5 space-y-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <h3 className="text-sm font-bold text-gray-900">Tulis Ulasan</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  required
                  placeholder="Nama Anda"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((r) => (
                    <button key={r} type="button" onClick={() => setReviewRating(r)}>
                      <Star className={`w-6 h-6 transition-colors ${r <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Komentar</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={3}
                  placeholder="Tulis kesan Anda..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60"
                style={{ background: '#DC2626' }}
                onMouseEnter={(e) => { if (!submittingReview) e.currentTarget.style.background = '#B91C1C'; }}
                onMouseLeave={(e) => { if (!submittingReview) e.currentTarget.style.background = '#DC2626'; }}
              >
                <Send className="w-4 h-4" />
                {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-3 max-h-96 overflow-y-auto pr-1">
            {reviews.slice(0, 6).map((rev, idx) => {
              const name = rev.user?.name || rev.guestName || 'Anonim';
              return (
                <div key={rev.id || idx} className="p-4 bg-white rounded-xl flex flex-col gap-2 hover:shadow-sm transition-shadow" style={{ border: '1px solid #F3F4F6' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: '#DC2626' }}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{name}</p>
                        <p className="text-xs text-gray-400">{formatDate(rev.createdAt)}</p>
                      </div>
                    </div>
                    <Stars count={rev.rating} />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">"{rev.content}"</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-8 w-full pb-8">
        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
