/**
 * SEAPEDIA — Shared Utilities
 * Dipakai di seluruh halaman untuk konsistensi format & translate.
 */

// ═══════════════════════════════
// FORMAT HARGA
// ═══════════════════════════════
export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);
}

// ═══════════════════════════════
// TRANSLATE STATUS ORDER
// ═══════════════════════════════
const STATUS_MAP = {
  SEDANG_DIKEMAS: 'Sedang Dikemas',
  MENUNGGU_PENGIRIM: 'Menunggu Pengirim',
  SEDANG_DIKIRIM: 'Sedang Dikirim',
  PESANAN_SELESAI: 'Pesanan Selesai',
  SELESAI: 'Pesanan Selesai',
  DIKEMBALIKAN: 'Dikembalikan',
  DIBATALKAN: 'Dibatalkan',
  REFUND: 'Refund',
};

export function translateStatus(status) {
  return STATUS_MAP[status] || status;
}

// ═══════════════════════════════
// TRANSLATE ROLE
// ═══════════════════════════════
const ROLE_MAP = {
  BUYER: 'Pembeli',
  SELLER: 'Penjual',
  DRIVER: 'Kurir',
  ADMIN: 'Admin',
};

export function translateRole(role) {
  return ROLE_MAP[role] || role;
}

// ═══════════════════════════════
// TRANSLATE METODE PENGIRIMAN
// ═══════════════════════════════
const DELIVERY_MAP = {
  REGULAR: 'Regular',
  NEXT_DAY: 'Next Day',
  INSTANT: 'Instant',
};

export function translateDelivery(method) {
  return DELIVERY_MAP[method] || method;
}

// ═══════════════════════════════
// STATUS BADGE STYLES
// ═══════════════════════════════
const STATUS_STYLE_MAP = {
  SEDANG_DIKEMAS: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
  MENUNGGU_PENGIRIM: { bg: 'bg-[#FEF9C3]', text: 'text-[#854D0E]' },
  SEDANG_DIKIRIM: { bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]' },
  PESANAN_SELESAI: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  SELESAI: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  DIKEMBALIKAN: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  DIBATALKAN: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  REFUND: { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
};

export function getStatusStyle(status) {
  return STATUS_STYLE_MAP[status] || { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]' };
}

// ═══════════════════════════════
// STATUS BADGE CLASS (shorthand)
// ═══════════════════════════════
export function statusBadgeClass(status) {
  const s = getStatusStyle(status);
  return `${s.bg} ${s.text}`;
}

// ═══════════════════════════════
// FORMAT TANGGAL
// ═══════════════════════════════
export function formatDate(date, options = {}) {
  const defaults = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', { ...defaults, ...options });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
