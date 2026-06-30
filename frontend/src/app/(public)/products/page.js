'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import ProductCard from '../../../components/ProductCard';
import Button from '../../../components/Button';
import { useAuth } from '../../../lib/AuthContext';
import { Package, Loader2, ChevronLeft, AlertTriangle, X } from 'lucide-react';

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

// ─── Main Content ─────────────────────────────────────────────────────────────

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);       // initial load
  const [loadingMore, setLoadingMore] = useState(false); // load more saat scroll
  const [storeWarning, setStoreWarning] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const searchQuery = searchParams.get('search') || '';

  // Ref untuk sentinel element (trigger infinite scroll)
  const sentinelRef = useRef(null);
  const prevSearchRef = useRef(searchQuery);

  const LIMIT = 12;

  // Reset saat searchQuery berubah
  useEffect(() => {
    if (prevSearchRef.current !== searchQuery) {
      prevSearchRef.current = searchQuery;
      setProducts([]);
      setPage(1);
      setHasMore(true);
    }
  }, [searchQuery]);

  // Fetch saat page berubah
  useEffect(() => {
    fetchProducts(page, searchQuery);
  }, [page, searchQuery]);

  const fetchProducts = async (pageNum, query) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pageNum, limit: LIMIT };
      if (query) params.search = query;

      const res = await api.get('/products', { params });

      let newProducts = [];
      let total = 0;
      let totalPages = 1;

      if (res.data?.data) {
        newProducts = res.data.data;
        total = res.data.pagination?.total || newProducts.length;
        totalPages = res.data.pagination?.totalPages || 1;
      } else if (Array.isArray(res.data)) {
        newProducts = res.data;
        total = newProducts.length;
      }

      setTotalProducts(total);

      if (pageNum === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => {
          const prevIds = new Set(prev.map(p => p.id));
          const uniqueNew = newProducts.filter(p => !prevIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
      }

      // Cek apakah masih ada halaman berikutnya
      setHasMore(pageNum < totalPages && newProducts.length === LIMIT);

    } catch (err) {
      console.error('Failed to fetch products:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // IntersectionObserver — trigger load more saat sentinel terlihat
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
        setPage((p) => p + 1);
      }
    },
    [hasMore, loadingMore, loading]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px', // mulai load 200px sebelum sentinel terlihat
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

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

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 text-white font-medium px-5 py-3 rounded-xl shadow-xl text-sm" style={{ background: '#DC2626' }}>
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

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-400 transition-colors shrink-0"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          {searchQuery ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">Hasil pencarian</h1>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  "{searchQuery}"
                </span>
              </div>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {totalProducts > 0
                    ? `${totalProducts} produk ditemukan`
                    : 'Tidak ada produk yang cocok'}
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">Semua Produk</h1>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {totalProducts} produk tersedia
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Grid produk */}
      {loading ? (
        // Skeleton initial load
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
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

            {/* Skeleton load more — muncul di akhir grid */}
            {loadingMore && Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={`more-${i}`} />
            ))}
          </div>

          {/* Sentinel — elemen kosong yang dipantau IntersectionObserver */}
          <div ref={sentinelRef} className="h-4" />

          {/* Indikator loading lebih */}
          {loadingMore && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#DC2626' }} />
              Memuat produk...
            </div>
          )}

          {/* Semua produk sudah ditampilkan */}
          {!hasMore && products.length > 0 && (
            <p className="text-center text-sm text-gray-400 py-4">
              Semua {products.length} produk sudah ditampilkan
            </p>
          )}
        </>
      ) : (
        // Empty state
        <div className="py-24 text-center bg-white rounded-2xl" style={{ border: '1px solid #F3F4F6' }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FEF2F2' }}>
              <Package className="w-8 h-8" style={{ color: '#DC2626' }} />
            </div>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">
            {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada produk'}
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Coba kata kunci lain.' : 'Produk akan segera hadir, pantau terus ya!'}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6 w-full pb-8">
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
