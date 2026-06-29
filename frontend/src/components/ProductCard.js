import React from 'react';
import Link from 'next/link';
import Button from './Button';
import { ShoppingCart, Package } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function ProductCard({ product, onAddToCart, isAdding = false }) {
  return (
    <div className="group relative flex flex-col bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200 flex-1">
      <Link href={`/products/${product.id}`} className="relative w-full h-48 bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
        {product.image || product.imageUrl ? (
          <img
            src={(product.image || product.imageUrl).startsWith('http') ? (product.image || product.imageUrl) : `http://localhost:5000${product.image || product.imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
            <Package className="w-10 h-10" />
            <span className="text-xs font-medium">Belum ada foto</span>
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-[#FEF9C3] text-[#854D0E] text-xs font-medium px-2.5 py-1 rounded-full">
            Sisa {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2.5 right-2.5 bg-[#FEE2E2] text-[#991B1B] text-xs font-medium px-2.5 py-1 rounded-full">
            Habis
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-[#0369A1] truncate">
            {product.store?.name || 'Seapedia'}
          </span>
          <span className="text-[#94A3B8] font-medium">Stok: {product.stock}</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-[#0F172A] line-clamp-2 leading-snug hover:text-[#0369A1] transition-colors">{product.name}</h3>
        </Link>

        <p className="text-xs text-[#475569] line-clamp-2 flex-1 leading-relaxed">{product.description}</p>

        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3 mt-auto">
          <span className="text-base font-semibold text-[#0F172A]">
            {formatPrice(product.price)}
          </span>

          <Button
            variant="primary"
            size="sm"
            isLoading={isAdding}
            disabled={product.stock === 0}
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Beli</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
