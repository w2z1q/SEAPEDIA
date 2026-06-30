import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Store } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function ProductCard({ product, onAddToCart, isAdding = false }) {
  const hasImage = product.image || product.imageUrl;
  const imageSrc = hasImage
    ? (hasImage.startsWith('http') ? hasImage : `http://localhost:5000${hasImage}`)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer"
      style={{ border: '1px solid #F3F4F6' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FECACA')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#F3F4F6')}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative block w-full h-48 bg-gray-50 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Package className="w-10 h-10" />
            <span className="text-xs font-medium">Belum ada foto</span>
          </div>
        )}

        {/* Badges */}
        {product.stock === 0 && (
          <span className="absolute top-2.5 right-2.5 bg-gray-800/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            Habis
          </span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full">
            Sisa {product.stock}
          </span>
        )}
        {product.promo && (
          <span className="absolute top-2.5 left-2.5 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow"
            style={{ background: '#DC2626' }}>
            PROMO
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        {/* Price */}
        <div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through block">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-700 line-clamp-2 leading-snug hover:text-red-600 transition-colors"
            style={{ '--tw-text-opacity': 1 }}>
            {product.name}
          </h3>
        </Link>

        {/* Store name */}
        <div className="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
          <Store className="w-3 h-3 shrink-0" style={{ color: '#DC2626' }} />
          <span className="text-xs font-medium truncate" style={{ color: '#DC2626' }}>
            {product.store?.name || 'Seapedia Store'}
          </span>
        </div>
      </div>

    </div>
  );
}
