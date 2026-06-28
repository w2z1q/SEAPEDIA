# SEAPEDIA - Master Context

## Project Overview

SEAPEDIA adalah aplikasi marketplace berbasis web yang dikembangkan sebagai tugas akhir mata kuliah Pemrograman Web.

Aplikasi memiliki empat role utama:

- Buyer
- Seller
- Driver
- Admin

Satu akun dapat memiliki lebih dari satu role dan dapat berpindah role (switch role) tanpa membuat akun baru.

---

## Project Goal

Membangun aplikasi marketplace yang memenuhi seluruh requirement Level 1 sampai Level 7 dengan arsitektur yang rapi, mudah dikembangkan, aman, dan siap dideploy.

---

## Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- shadcn/ui
- Axios

### Backend
- Express.js
- Prisma ORM
- JWT
- bcrypt
- Zod
- Swagger

### Database
- PostgreSQL (Supabase)

### Deployment
- Vercel
- Railway

---

## Development Principle

- Backend dan frontend dipisahkan.
- Menggunakan REST API.
- Menggunakan Prisma ORM.
- Semua endpoint menggunakan validasi.
- Semua perubahan dicatat melalui Git Commit bertahap.

---

## User Roles

Guest
- Melihat produk
- Detail produk
- Register
- Login
- Review publik

Buyer
- Wallet
- Cart
- Checkout
- Order
- Address

Seller
- Membuat toko
- CRUD Produk
- Melihat pesanan
- Memproses pesanan

Driver
- Mengambil job
- Mengantar pesanan
- Konfirmasi selesai

Admin
- Monitoring
- Voucher
- Promo
- Overdue
- Refund

---

## Business Rules

- Guest dapat melihat produk tanpa login.
- Satu akun dapat memiliki banyak role.
- Cart hanya boleh berasal dari satu toko.
- Nama toko harus unik.
- Checkout menggunakan transaksi database.
- Checkout mengurangi saldo wallet.
- Checkout mengurangi stok produk.
- Voucher memiliki batas penggunaan.
- Promo memiliki tanggal kadaluarsa.
- PPN sebesar 12%.
- Driver hanya dapat mengambil order yang belum diambil driver lain.

---

## Coding Standard

- Gunakan nama variabel yang jelas.
- Pisahkan route, controller, middleware, dan validator.
- Jangan menulis business logic di file route.
- Semua endpoint menggunakan async/await.
- Semua endpoint mengembalikan response JSON dengan format yang konsisten.
