# 🚀 Panduan Lengkap Deployment SEAPEDIA (Production Deployment Guide)

Dokumen ini menjelaskan panduan komprehensif langkah demi langkah untuk melakukan deployment aplikasi **SEAPEDIA (B2B Marine & Fishery Marketplace)** ke lingkungan produksi (production).

SEAPEDIA terdiri dari dua subsistem utama:
1. **Backend**: Server API RESTful berbasis Express.js dan Prisma ORM.
2. **Frontend**: Aplikasi web modern berbasis Next.js 16 (App Router).
3. **Database**: PostgreSQL (disediakan oleh Supabase).

---

## 🏛️ Arsitektur Deployment

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / BROWSER                              │
└────────────────────┬───────────────────────────────┬────────────────────┘
                     │ (HTTPS / UI Requests)         │ (HTTPS / REST API)
                     ▼                               ▼
┌──────────────────────────────────────┐   ┌──────────────────────────────┐
│        FRONTEND (Vercel / VPS)       │   │    BACKEND (Render / VPS)    │
│  • Next.js 16 (React 19)             │   │  • Express.js + PM2          │
│  • Server & Client Components        │   │  • Prisma ORM                │
└──────────────────────────────────────┘   └─────────────────┬────────────┘
                                                             │
                                     (PostgreSQL Connection) │
                                                             ▼
                                           ┌──────────────────────────────┐
                                           │     DATABASE (Supabase)      │
                                           │  • PostgreSQL Pooler         │
                                           └──────────────────────────────┘
```

---

## 📋 Prasyarat (Prerequisites)

Sebelum memulai deployment, pastikan Anda memiliki:
- Akun **GitHub**, **GitLab**, atau **Bitbucket** untuk menyimpan repositori kode.
- Akun **Supabase** (untuk database PostgreSQL).
- Akun **Vercel** (direkomendasikan untuk deployment Frontend Next.js).
- Akun **Render**, **Railway**, **Fly.io**, atau sebuah **VPS** (seperti DigitalOcean, AWS EC2, Linode) untuk deployment Backend Express.js.

---

## 🗄️ 1. Persiapan Database (Supabase)

Aplikasi SEAPEDIA menggunakan PostgreSQL dengan Prisma ORM. Supabase menyediakan pengelola koneksi (Connection Pooler) yang sangat cocok untuk aplikasi modern.

### Langkah-langkah Pengaturan Supabase:
1. Masuk ke dasbor [Supabase](https://supabase.com) dan buat proyek baru (New Project).
2. Pilih wilayah (Region) terdekat dengan target pengguna Anda (misal: `Singapore / Southeast Asia`).
3. Simpan **Database Password** Anda secara aman.
4. Setelah proyek selesai dibuat, masuk ke menu **Project Settings** -> **Database**.
5. Gulir ke bagian **Connection String** -> Pilih tab **URI** -> Nonaktifkan atau Aktifkan **Use connection pooling** (Pilih port `6543` untuk pgbouncer/pooling, atau port `5432` untuk koneksi langsung/direct session).
6. Ubah string koneksi dengan memasukkan password Anda. Formatnya akan tampak seperti ini:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR_SUPABASE_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
   *(Catatan: Jika menggunakan koneksi langsung tanpa pooler, gunakan port `5432` dan hilangkan parameter `?pgbouncer=true`).*

---

## ⚙️ 2. Deployment Backend

Backend SEAPEDIA membutuhkan environment Node.js yang terus berjalan (long-running server). Berikut adalah dua opsi deployment yang paling umum: **PaaS (Render/Railway)** dan **VPS Tradisional**.

### Opsi A: Deployment via Render / Railway (PaaS Rekomendasi)

PaaS (Platform as a Service) mengotomatisasi proses build, manajemen SSL, dan penskalaan.

1. Hubungkan repositori GitHub Anda ke [Render](https://render.com) atau [Railway](https://railway.app).
2. Buat layanan baru bertipe **Web Service**.
3. Hubungkan ke repositori `Seapedia`.
4. Konfigurasikan pengaturan layanan sebagai berikut:
   - **Root Directory**: `backend`
   - **Environment / Runtime**: `Node` (Pilih Node.js v18 atau v20+)
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed
     ```
     *(Build command ini akan menginstal dependensi, menghasilkan client Prisma, menerapkan skema tabel ke Supabase, dan mengisi data awal/seed).*
   - **Start Command**:
     ```bash
     npm start
     ```
5. Tambahkan **Environment Variables** berikut di dasbor pengaturan PaaS:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR_SUPABASE_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   JWT_SECRET="masukkan_kunci_rahasia_jwt_anda_yang_kuat_disini"
   FRONTEND_URL="https://seapedia.vercel.app"  # Ganti dengan URL frontend produksi Anda nantinya
   PORT=5000
   ```
6. Klik **Deploy / Save**. Tunggu hingga proses build dan deployment selesai.
7. Simpan URL publik backend Anda (misal: `https://api-seapedia.onrender.com`).

---

### Opsi B: Deployment via VPS (DigitalOcean / AWS EC2 / Linux VM)

Jika Anda menggunakan VPS Ubuntu/Debian, gunakan kombinasi **PM2** (Process Manager) dan **Nginx** (Reverse Proxy).

#### 1. Persiapan Server & Instalasi Dependensi
Buka terminal SSH ke VPS Anda dan jalankan:
```bash
# Update sistem & instal Nginx, Git, Curl
sudo apt update && sudo apt upgrade -y
sudo apt install nginx git curl -y

# Instal Node.js (Versi 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instal PM2 secara global
sudo npm install -g pm2
```

#### 2. Kloning Repositori & Konfigurasi Build
```bash
git clone https://github.com/username/Seapedia.git
cd Seapedia/backend

# Instal dependensi
npm install

# Buat file .env
nano .env
```
Isi file `.env` dengan variabel produksi:
```env
DATABASE_URL="postgresql://postgres.[YOUR_SUPABASE_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="production_secure_jwt_secret_key_2026"
FRONTEND_URL="https://seapedia.yourdomain.com"
PORT=5000
```
Simpan file (Ctrl+O, Enter, Ctrl+X), lalu jalankan migrasi Prisma:
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

#### 3. Menjalankan Backend dengan PM2
```bash
pm2 start src/index.js --name "seapedia-backend"
pm2 save
pm2 startup
```

#### 4. Konfigurasi Nginx sebagai Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/seapedia-backend
```
Isi dengan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com; # Ganti dengan domain/subdomain Anda

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Simpan dan aktifkan konfigurasi Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/seapedia-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
*(Opsional namun Disarankan: Gunakan `certbot` / Let's Encrypt untuk memasang sertifikat SSL/HTTPS gratis pada Nginx).*

---

## 🌐 3. Deployment Frontend

Frontend SEAPEDIA dibangun menggunakan Next.js 16. **Vercel** adalah platform paling dioptimalkan untuk men-deploy aplikasi Next.js secara instan dengan dukungan penuh terhadap fitur Server/Client components.

### Opsi A: Deployment via Vercel (Rekomendasi Utama)

1. Buka [Vercel](https://vercel.com) dan login menggunakan akun GitHub/GitLab Anda.
2. Klik tombol **Add New Project**.
3. Pilih repositori `Seapedia` Anda dari daftar import.
4. Di bagian **Configure Project**, lakukan pengaturan penting berikut:
   - **Project Name**: `seapedia-frontend` (atau sesuai keinginan Anda).
   - **Root Directory**: Klik tombol edit dan pilih direktori `frontend`.
   - **Framework Preset**: Vercel akan otomatis mendeteksi `Next.js`.
5. Buka bagian **Environment Variables** dan tambahkan variabel berikut:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Masukkan URL publik backend produksi Anda (misal: `https://api-seapedia.onrender.com` atau `https://api.yourdomain.com`).  
     *Penting: Pastikan Anda tidak menyertakan tanda garis miring (`/`) di akhir URL.*
6. Klik tombol **Deploy**.
7. Tunggu beberapa menit hingga Vercel menyelesaikan proses build (`next build`).
8. Setelah berhasil, Vercel akan memberikan domain publik gratis (misal: `https://seapedia.vercel.app`). Anda juga dapat menambahkan kustom domain di menu pengaturan Vercel.

---

### Opsi B: Deployment via VPS / Standalone Node Server

Jika Anda ingin menjalankan frontend Next.js di VPS Anda sendiri bersama backend:

1. Di dalam VPS, masuk ke direktori `frontend`:
   ```bash
   cd ~/Seapedia/frontend
   npm install
   ```
2. Buat file `.env.production`:
   ```bash
   nano .env.production
   ```
   Isi dengan:
   ```env
   NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
   ```
3. Lakukan proses build produksi:
   ```bash
   npm run build
   ```
4. Jalankan aplikasi Next.js menggunakan PM2:
   ```bash
   pm2 start npm --name "seapedia-frontend" -- start
   pm2 save
   ```
5. Tambahkan blok server baru di Nginx untuk port `3000` (port standar Next.js) yang mengarah ke domain utama frontend Anda (misal: `seapedia.yourdomain.com`).

---

## 🔍 4. Verifikasi & Pengujian Pasca-Deployment

Setelah kedua subsistem berhasil di-deploy, lakukan verifikasi akhir untuk memastikan seluruh ekosistem beroperasi normal:

### 1. Uji Konektivitas Backend & Swagger API Docs
Buka browser dan navigasikan ke URL backend Anda:
```text
https://api-seapedia.onrender.com/api-docs
```
Jika halaman dokumentasi Swagger UI muncul dengan baik, artinya backend dan modul express berjalan dengan sempurna.

### 2. Verifikasi CORS & Autentikasi
1. Buka URL frontend Anda (misal: `https://seapedia.vercel.app`).
2. Buka konsol browser (Developer Tools -> F12 -> tab Network/Console).
3. Cobalah login menggunakan akun demo seed:
   - **Admin**: `admin@seapedia.com` / `AdminSecure123!`
   - **Seller**: `seller@seapedia.com` / `SellerSecure123!`
   - **Buyer**: `buyer@seapedia.com` / `BuyerSecure123!`
   - **Driver**: `driver@seapedia.com` / `DriverSecure123!`
4. Jika proses login berhasil dan token JWT diterima serta disimpan, maka konfigurasi CORS (`FRONTEND_URL` di backend) dan koneksi API (`NEXT_PUBLIC_API_URL` di frontend) sudah terhubung dengan valid.

---

## 💡 5. Troubleshooting (Tanya Jawab Kendala Umum)

### ❌ Kendala 1: Kesalahan Koneksi Prisma / Database Timeout
- **Penyebab**: Batas koneksi database terlampaui atau pgbouncer salah dikonfigurasi.
- **Solusi**: Jika Anda men-deploy backend di lingkungan serverless atau aplikasi dengan banyak instans, pastikan URL database di Supabase menggunakan port `6543` dan ditambahi parameter `?pgbouncer=true`. Jika menggunakan VPS 1 instans yang konsisten, gunakan port `5432` tanpa parameter pgbouncer.

### ❌ Kendala 2: Error CORS (Cross-Origin Resource Sharing) di Frontend
- **Penyebab**: Variabel `FRONTEND_URL` di backend tidak sama persis dengan URL asli aplikasi frontend Anda.
- **Solusi**: Periksa kembali penulisan `FRONTEND_URL` di backend `.env`. Pastikan menggunakan protokol yang benar (`https://`) dan **TIDAK ADA** trailing slash (garis miring di akhir).
  - ✅ Benar: `https://seapedia.vercel.app`
  - ❌ Salah: `https://seapedia.vercel.app/`

### ❌ Kendala 3: Gambar/Static Asset Tidak Muncul atau Error Upload
- **Penyebab**: Paket `multer` di backend secara bawaan mungkin menyimpan file secara lokal di dalam folder server (misal: `uploads/`). Pada platform ephemeral/PaaS seperti Render/Railway, direktori lokal akan terhapus saat server di-restart.
- **Solusi**: Untuk skala produksi penuh di cloud PaaS, disarankan menyertakan konfigurasi persisten (misal Render Disk) atau menautkan penyimpanan objek eksternal (seperti Supabase Storage / AWS S3) pada konfigurasi Multer/penyimpanan backend Anda.

---
*✨ SEAPEDIA siap melayani transaksi B2B kelautan & perikanan di tingkat produksi secara handal dan aman!*
