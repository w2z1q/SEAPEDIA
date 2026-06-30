# SEAPEDIA - Marketplace Terpercaya Indonesia

SEAPEDIA adalah platform *marketplace* terintegrasi yang mendukung multi-peran (Buyer, Seller, Driver, Admin) dalam satu ekosistem tunggal. Proyek ini dibangun untuk menyelesaikan *Technical Challenge COMPFEST 18* secara penuh (Mencapai Level 1 hingga 7).

## 🚀 Fitur Utama
1. **Multi-Role dalam 1 Akun**: Seorang user dapat menjadi Buyer, Seller, Driver, atau Admin.
2. **Dashboard Spesifik Peran**: Sidebar profesional khusus untuk manajemen Toko, Kurir, dan Admin.
3. **Sistem Belanja Lengkap**: Katalog Publik, Keranjang (Single-Store), Checkout dengan PPN 12%, dan Dompet/Wallet.
4. **Voucher & Promo**: Dukungan diskon yang dikelola secara sentral oleh Admin.
5. **Ekosistem Logistik Terpadu**: Seller mengemas barang, Driver mengambil pesanan.
6. **Auto-Overdue (SLA)**: Pengembalian dana & stok otomatis jika pengiriman terlambat.

---

## 🛠️ Stack Teknologi
- **Frontend**: Next.js 14 (App Router), TailwindCSS, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL.
- **Keamanan**: JWT (JSON Web Tokens), bcrypt (Password Hashing), Helmet, Express Rate Limit, DOMPurify (XSS Protection frontend), Parameterized Query (via Prisma).

---

## 💻 Panduan Instalasi Lokal (Setup)

Pastikan kamu sudah menginstal **Node.js** (v18+) dan **PostgreSQL**.

### 1. Setup Backend
1. Masuk ke folder backend: `cd backend`
2. Install dependensi: `npm install`
3. Buat file `.env` berdasarkan `env.example` dan sesuaikan koneksi database.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/seapedia"
   DIRECT_URL="postgresql://user:password@localhost:5432/seapedia"
   JWT_SECRET="rahasia_seapedia"
   PORT=5000
   ```
4. Jalankan migrasi database: `npx prisma db push` atau `npx prisma migrate dev`
5. Jalankan server: `npm run dev`

### 2. Setup Frontend
1. Masuk ke folder frontend: `cd frontend`
2. Install dependensi: `npm install`
3. Buat file `.env.local` jika perlu mengarahkan API. Default terhubung ke `http://localhost:5000/api`.
4. Jalankan server lokal: `npm run dev`
5. Buka `http://localhost:3000` di browser.

---

## 🔑 Demo Akun (Seed Data)
Kamu bisa menggunakan fungsi register pada web atau login dengan akun-akun berikut (Jika kamu melakukan seed data DB):
- **Admin**: `admin@seapedia.com` / `password123`
- **Seller Utama**: `seller@seapedia.com` / `password123` *(Memiliki Toko "Seapedia Beauty" dengan 10 produk Kosmetik/Perawatan)*
- **Driver**: `driver@seapedia.com` / `password123`
- Atau buat akun baru dan ubah rolenya sesuka hati menggunakan fitur *Multi-role switch*.

---

## 📜 Dokumentasi Aturan Bisnis Khusus (Rules Explained)

### 1. Aturan Single-Store Checkout
- **Penjelasan:** Satu keranjang belanja (Cart) **hanya boleh berisi produk dari satu toko yang sama**. 
- **Implementasi Backend:** API `POST /api/cart` secara ketat memvalidasi ID toko produk. Jika ada perbedaan ID toko (melempar kode error HTTP 409), *request* akan ditolak.
- **Implementasi UI:** Saat pembeli mengeklik "Tambah ke Keranjang" pada produk yang berasal dari toko yang berbeda dengan isi keranjangnya saat ini, sistem akan memunculkan *Pop-up Modal* interaktif. Peringatan ini mengharuskan pembeli untuk membersihkan keranjang lama terlebih dahulu sebelum dapat membeli produk baru tersebut.

### 2. Aturan Kombinasi Diskon & Perhitungan PPN 12%
- **PPN 12%:** Pajak Pertambahan Nilai (PPN) sebesar 12% dikenakan pada **Subtotal Harga Produk** *sebelum* ditambah ongkos kirim.
- **Penerapan Diskon:** 
  - Jika user menggunakan Promo/Voucher, diskon tersebut akan **mengurangi Subtotal Produk terlebih dahulu**, baru kemudian PPN 12% dihitung dari Subtotal *setelah diskon*.
  - *Rumus:* `Total = (Subtotal - Diskon) + PPN(12% dari (Subtotal - Diskon)) + Ongkir`.

### 3. Aturan Earning Driver (Upah Kurir)
- Driver bertugas mengambil order dengan status `Menunggu Pengirim` dan mengubahnya menjadi `Sedang Dikirim`, lalu `Pesanan Selesai`.
- Upah driver diambil **sebesar 100% dari biaya Ongkos Kirim (Shipping Cost)** pesanan tersebut.
- Uang akan dikreditkan otomatis ke pendapatan Driver di Dashboard Driver saat Driver mengonfirmasi bahwa pesanan *Selesai*.

### 4. SLA Overdue & Cara Simulasi Waktu
- **Service Level Agreement (SLA) Pengiriman:**
  - Instant: Maksimal 1 hari.
  - Next Day: Maksimal 2 hari.
  - Regular: Maksimal 3 hari.
- Jika order melewati batas waktu ini saat masih berstatus `SEDANG_DIKIRIM`, order dianggap **Overdue**.
- **Auto-Refund/Return:** Sistem akan mengubah status menjadi `DIKEMBALIKAN`. Uang (Subtotal+Ongkir+PPN) akan di-*refund* sepenuhnya ke Dompet (Wallet) Pembeli, Pendapatan tertahan Seller akan ditarik (Reverse Income), dan Stok Produk akan dikembalikan.
- **Cara Simulasi Waktu:** Di **Dashboard Admin**, terdapat fungsi "Simulasi Hari Berjalan". Admin dapat mempercepat waktu (misal: tambah +3 Hari) dan menekan tombol simulasi. Sistem akan memproses semua order yang *overdue*.

---

## 🛡️ Catatan Keamanan (Security Notes)

- **Cegah SQL Injection:** Aplikasi menggunakan **Prisma ORM** yang secara bawaan melakukan eksekusi *Parameterized Queries*, sehingga terhindar dari SQL Injection.
- **Cegah XSS (Cross-Site Scripting):** Input dari user seperti *Review Produk* ditangani dengan aman oleh React DOM (meng-*escape* HTML).
- **Autentikasi & RBAC:** Endpoint API diamankan dengan *middleware* `verifyToken` dan pemeriksaan otoritas (*Role-Based Access Control*). Memanipulasi *Local Storage* di frontend tidak akan bisa membobol izin akses ke backend.
- **Rate Limiting:** Terdapat Express Rate Limit pada endpoint `/register` dan `/login` untuk mencegah *Brute Force*.
