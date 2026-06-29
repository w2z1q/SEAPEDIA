# 🌊 SEAPEDIA — B2B Marine & Fishery Marketplace

**SEAPEDIA** adalah platform B2B marketplace modern yang menghubungkan nelayan, petambak, dan pengusaha kelautan dengan pembeli di seluruh Indonesia. Sistem ini mengintegrasikan seluruh alur e-commerce kelautan, mulai dari manajemen toko, pengiriman terintegrasi oleh kurir, dompet digital (wallet), hingga pemantauan SLA pesanan secara real-time.

---

## 💻 Tech Stack

| Bagian | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Backend** | Express.js, Prisma ORM | RESTful API server dengan arsitektur modular & service pattern |
| **Database** | PostgreSQL (Supabase) | Database relasional dengan integritas skema yang kuat |
| **Frontend** | Next.js 16, TypeScript | App Router, Server/Client components, arsitektur berbasis grup rute |
| **Styling** | Tailwind CSS | Utility-first CSS dengan desain sistem bernuansa kelautan (Primary: `#0369A1`) |
| **State & API** | Zustand, Axios | Manajemen state lokal dan interceptor permintaan HTTP terintegrasi |
| **Auth** | JWT (JSON Web Tokens) | Token-based authentication & otorisasi berbasis Role-Based Access Control (RBAC) |

---

## 🔑 Demo Accounts (dari Seed)

Gunakan akun berikut untuk menguji coba masing-masing peran (Role) di dalam sistem:

| Peran | Email | Kata Sandi |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@seapedia.com` | `AdminSecure123!` |
| 🏪 **Seller** | `seller@seapedia.com` | `SellerSecure123!` |
| 🛒 **Buyer** | `buyer@seapedia.com` | `BuyerSecure123!` |
| 🚚 **Driver** | `driver@seapedia.com` | `DriverSecure123!` |

---

## ⚙️ Environment Variables

Sebelum menjalankan aplikasi, pastikan Anda telah mengonfigurasi variabel lingkungan di masing-masing direktori.

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://postgres.[YOUR_SUPABASE_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="super-secret-jwt-key-seapedia-2026"
FRONTEND_URL="http://localhost:3000"
PORT=5000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

---

## 🚀 Cara Menjalankan Aplikasi (How to Run)

### 1. Menjalankan Backend
Buka terminal baru, masuk ke direktori `backend`, instal dependensi, lalu lakukan migrasi dan seeding database:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```
> Server backend akan berjalan di: **`http://localhost:5000`**

### 2. Menjalankan Frontend
Buka terminal baru, masuk ke direktori `frontend`, instal dependensi, lalu nyalakan server pengembangan:
```bash
cd frontend
npm install
npm run dev
```
> Aplikasi frontend akan dapat diakses di: **`http://localhost:3000`**

---

## 📋 Aturan Bisnis (Business Rules)

### 🏪 1. Single-Store Checkout
Satu keranjang belanja (cart) **hanya boleh berisi produk dari satu toko yang sama**.  
Jika pembeli (Buyer) mencoba menambahkan produk dari toko yang berbeda, sistem secara tegas akan menolak atau meminta pembeli untuk mengosongkan keranjang terlebih dahulu sebelum memasukkan produk dari toko baru.

### 🎟️ 2. Voucher vs Promo
```
        ┌─────────────────────────┐           ┌─────────────────────────┐
        │         VOUCHER         │           │          PROMO          │
        ├─────────────────────────┤           ├─────────────────────────┤
        │ • Punya Expiry Date     │           │ • Punya Expiry Date     │
        │ • Punya Remaining Usage │           │ • Unlimited Usage       │
        │ • Dibuat oleh Admin     │           │ • Dibuat oleh Admin     │
        └─────────────────────────┘           └─────────────────────────┘
```
- **Voucher**: Memiliki batas tanggal kedaluwarsa (expiry date) dan memiliki batasan kuota pemakaian (remaining usage/bisa habis). Dibuat oleh Admin.
- **Promo**: Memiliki batas tanggal kedaluwarsa (expiry date) namun **tidak memiliki batasan kuota pemakaian** (unlimited usage). Dibuat oleh Admin.

### 🧮 3. Kalkulasi Checkout
Urutan kalkulasi biaya pada saat checkout dilakukan di sisi backend secara mutlak dengan tahapan berikut:
1. **Subtotal** = Total perkalian harga × kuantitas (quantity) seluruh item di dalam keranjang.
2. **Diskon** = Potongan harga yang diperoleh dari Voucher atau Promo yang tervalidasi (jika ada).
3. **Delivery Fee** = Biaya pengiriman berdasarkan metode pengiriman yang dipilih.
4. **PPN (12%)** = Pajak Pertambahan Nilai sebesar 12%, dihitung secara akurat dari nilai **`(Subtotal - Diskon + Delivery Fee)`**.
5. **Total Tagihan** = `Subtotal - Diskon + Delivery Fee + PPN`.

**Tarif Pengiriman (Delivery Fee):**
- ⚡ **Instant**: Rp 25.000
- 📅 **Next Day**: Rp 15.000
- 🚛 **Regular**: Rp 10.000

### 🚚 4. Driver Earning Rule
Setiap kali pesanan berhasil diantarkan dan diselesaikan, Kurir (Driver) berhak mendapatkan komisi penghasilan sebesar **100% dari total Delivery Fee** pesanan tersebut.

### ⏱️ 5. Overdue SLA (Service Level Agreement)
Sistem memantau durasi keterlambatan pengiriman pesanan sejak pertama kali dibuat berdasarkan batas SLA berikut:
- ⚡ **Instant**: Batas SLA **1 hari (24 jam)** sejak pesanan dibuat.
- 📅 **Next Day**: Batas SLA **2 hari (48 jam)** sejak pesanan dibuat.
- 🚛 **Regular**: Batas SLA **3 hari (72 jam)** sejak pesanan dibuat.

**Konsekuensi Pelanggaran SLA (Overdue):**
Jika pesanan belum diproses/diantar melewati batas SLA di atas, maka sistem memberlakukan aturan berikut:
1. Status pesanan diubah menjadi **`DIKEMBALIKAN`**.
2. Saldo pembayaran dikembalikan ke dalam dompet (Wallet) milik Pembeli (Buyer).
3. Stok produk yang sebelumnya dikurangi akan dipulihkan kembali ke dalam inventaris toko.
4. Pendapatan kotor toko (Seller Income) yang sempat tercatat akan dibatalkan/di-reverse.

> 💡 **Cara Simulasi Overdue:**  
> Login sebagai Admin (`admin@seapedia.com`) → masuk ke **Admin Dashboard** → buka tab **SLA & Overdue** → masukkan simulasi rentang jumlah hari → klik tombol **Trigger**.

---

## 🔒 Security Summary

| Aspek Keamanan | Implementasi di SEAPEDIA |
| :--- | :--- |
| **Pencegahan SQL Injection** | Memanfaatkan **Prisma ORM** yang otomatis menerapkan *parameterized queries* untuk seluruh interaksi database. |
| **Perlindungan XSS & Headers** | Menggunakan middleware **`xss-clean`** untuk sanitasi input dan **`helmet`** untuk menyetel pengamanan header HTTP di Express. |
| **Input Validation** | Verifikasi data berlapis di tingkat rute & controller menggunakan validator skema sebelum masuk ke Prisma. |
| **Manajemen Sesi (JWT)** | Sesi otentikasi dikelola lewat token JWT dengan masa kedaluwarsa 7 hari, disimpan secara aman di `localStorage`. |
| **Otorisasi RBAC** | Setiap endpoint terproteksi oleh kombinasi middleware `verifyToken` dan otorisasi ketat `authorize('ROLE')`. |

---

## 🔄 Order Status Lifecycle

Alur hidup (lifecycle) status pesanan dari awal hingga selesai mengikuti sekuens berikut:

```
[ SEDANG_DIKEMAS ] ──► [ MENUNGGU_PENGIRIM ] ──► [ SEDANG_DIKIRIM ] ──► [ PESANAN_SELESAI ]
        │
        └─► (Jika melebihi SLA / Batal) ──► [ DIKEMBALIKAN ]
```

---

## 📖 API Documentation

Dokumentasi API interaktif lengkap menggunakan OpenAPI / Swagger UI dapat diakses secara langsung melalui tautan berikut ketika backend aktif:

👉 **`http://localhost:5000/api-docs`**

---

## 🧪 Testing Guide End-to-End (E2E)

Ikuti langkah-langkah terstruktur berikut untuk memverifikasi seluruh alur bisnis SEAPEDIA dari awal hingga akhir:

```text
1. 🚀 INISIALISASI      : Jalankan server backend dan aplikasi frontend di localhost.
2. 🏪 REGISTER SELLER   : Login sebagai Seller (seller@seapedia.com) → buat Toko baru → tambahkan produk hasil laut.
3. 🛒 BUYER CHECKOUT    : Login sebagai Buyer (buyer@seapedia.com) → top up saldo di Wallet → masukkan produk ke cart → pilih pengiriman & selesaikan checkout.
4. 📦 SELLER PROCESSING : Login kembali sebagai Seller → masuk ke daftar pesanan → proses pesanan dari status "Sedang Dikemas" menjadi "Menunggu Pengirim".
5. 🚚 DRIVER DELIVERY   : Login sebagai Driver (driver@seapedia.com) → masuk ke halaman Bursa Kerja (Jobs) → ambil job pengiriman → perbarui status hingga selesai.
6. 🛡️ ADMIN SIMULATION  : Login sebagai Admin (admin@seapedia.com) → pantau Dasbor Monitoring → buat kode Voucher baru → lakukan simulasi Trigger Overdue SLA.
```

---
*Dikembangkan untuk menghadirkan pengalaman marketplace perikanan dan kelautan B2B terbaik di Indonesia.*
