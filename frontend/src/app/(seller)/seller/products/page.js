'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { useAuth } from '../../../../lib/AuthContext';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { formatPrice } from '../../../../lib/utils';
import { Plus, X, Package, Edit, Trash2 } from 'lucide-react';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', description: '', image: '' });
  const [creating, setCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/store');
      if (res.data && res.data.data && res.data.data.products) {
        setProducts(res.data.data.products);
      } else {
        const allRes = await api.get('/products/me');
        setProducts(allRes.data?.data || allRes.data || []);
      }
    } catch (error) {
      try {
        const allRes = await api.get('/products/me');
        setProducts(allRes.data?.data || allRes.data || []);
      } catch (err) {
        console.error('Failed to fetch store products:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const payload = {
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        description: newProduct.description,
        image: newProduct.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
      };
      await api.post('/products', payload);
      alert('Produk baru berhasil ditambahkan ke toko Anda!');
      setShowModal(false);
      setNewProduct({ name: '', price: '', stock: '', description: '', image: '' });
      fetchMyProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menambahkan produk');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const payload = {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        description: editingProduct.description,
        image: editingProduct.image || editingProduct.imageUrl,
      };
      await api.put(`/products/${editingProduct.id}`, payload);
      alert('Detail produk berhasil diperbarui!');
      setEditingProduct(null);
      fetchMyProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal memperbarui produk');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Produk berhasil dihapus');
      fetchMyProducts();
    } catch (error) {
      alert('Gagal menghapus produk');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SELLER']}>
      {loading ? (
        <div className="w-full animate-pulse h-96 bg-white border border-[#E2E8F0] rounded-xl my-12" />
      ) : (
        <div className="flex flex-col flex-1 gap-8 w-full">
          <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
            <div>
              <span className="text-xs font-medium text-[#0369A1] uppercase tracking-tight">Manajemen Produk Toko</span>
              <h1 className="text-2xl font-semibold text-[#0F172A] mt-1 tracking-tight">Katalog Produk Toko Saya</h1>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" /> Tambah Produk Baru
            </Button>
          </div>

          {/* Modal Tambah Produk */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-lg font-semibold text-[#0F172A] tracking-tight">Tambah Produk Baru</h3>
                  <button onClick={() => setShowModal(false)} className="text-[#475569] hover:text-[#0F172A]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-5">
                  <Input label="Nama Produk" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required placeholder="Contoh: Jaring Nelayan Premium" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Harga (Rp)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required placeholder="150000" />
                    <Input label="Stok Awal" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required placeholder="50" />
                  </div>
                  <Input label="URL Gambar (Opsional)" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} placeholder="https://..." />
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Deskripsi Produk</label>
                    <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required rows={4} className="w-full rounded-lg bg-white border border-[#E2E8F0] p-3.5 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0369A1] shadow-sm" placeholder="Jelaskan spesifikasi dan keunggulan produk..." />
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setShowModal(false)}>Batal</Button>
                    <Button variant="primary" size="sm" type="submit" isLoading={creating}>Simpan Produk</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Edit Produk */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <h3 className="text-lg font-semibold text-[#0F172A] tracking-tight">Edit Detail Produk</h3>
                  <button onClick={() => setEditingProduct(null)} className="text-[#475569] hover:text-[#0F172A]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="space-y-5">
                  <Input label="Nama Produk" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required placeholder="Contoh: Jaring Nelayan Premium" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Harga (Rp)" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required placeholder="150000" />
                    <Input label="Stok Tersedia" type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} required placeholder="50" />
                  </div>
                  <Input label="URL Gambar" value={editingProduct.image || editingProduct.imageUrl || ''} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="https://..." />
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Deskripsi Produk</label>
                    <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} required rows={4} className="w-full rounded-lg bg-white border border-[#E2E8F0] p-3.5 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0369A1] shadow-sm" placeholder="Jelaskan spesifikasi dan keunggulan produk..." />
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setEditingProduct(null)}>Batal</Button>
                    <Button variant="primary" size="sm" type="submit" isLoading={updating}>Simpan Perubahan</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          {products.length > 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#475569] uppercase tracking-tight">
                      <th className="p-5">Produk</th>
                      <th className="p-5">Harga</th>
                      <th className="p-5">Stok</th>
                      <th className="p-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                        <td className="p-5 flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#F8FAFC] rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0]">
                            {p.image || p.imageUrl ? <img src={(p.image || p.imageUrl).startsWith('http') ? (p.image || p.imageUrl) : `http://localhost:5000${p.image || p.imageUrl}`} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#94A3B8]"><Package className="w-5 h-5" /></div>}
                          </div>
                          <div>
                            <h4 className="font-medium text-[#0F172A] text-sm">{p.name}</h4>
                            <p className="text-xs text-[#475569] line-clamp-1 mt-0.5">{p.description}</p>
                          </div>
                        </td>
                        <td className="p-5 font-semibold text-[#0F172A] text-sm">{formatPrice(p.price)}</td>
                        <td className="p-5">
                          <span className="bg-[#F1F5F9] py-1 px-3 rounded-full border border-[#E2E8F0] font-medium text-xs text-[#475569]">
                            {p.stock}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                          <button onClick={() => setEditingProduct(p)} className="bg-[#0369A1] text-white hover:bg-[#075985] font-medium py-1.5 px-3 rounded-lg text-xs transition-all shadow-sm">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="bg-white border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] font-medium py-1.5 px-3 rounded-lg text-xs transition-all">
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-16 text-center shadow-sm space-y-4 my-12 max-w-2xl mx-auto">
              <Package className="w-12 h-12 text-[#94A3B8] mx-auto" />
              <p className="text-[#475569] font-medium text-sm">Belum ada produk di toko Anda. Tambahkan produk pertama Anda sekarang!</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4" /> Tambah Produk
              </Button>
            </div>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
