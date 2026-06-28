# SEAPEDIA Frontend

Ini adalah project frontend untuk SEAPEDIA, dikembangkan menggunakan Next.js dengan App Router, JavaScript, Tailwind CSS, dan Axios.

## Menjalankan Project

1. Copy `.env.example` menjadi `.env.local`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```

Aplikasi akan berjalan di `http://localhost:3000`.

## Struktur Direktori Utama

- `src/app`: Konfigurasi routing App Router Next.js
- `src/components`: Komponen UI yang re-usable
- `src/lib`: Utility functions dan setup (contoh: axios konfigurasi)
- `src/hooks`: Custom React hooks
- `src/services`: File untuk fetch API
- `src/utils`: Helper dan utilitas tambahan
- `src/constants`: Konstanta global project
- `src/styles`: Pengaturan global CSS/Tailwind
