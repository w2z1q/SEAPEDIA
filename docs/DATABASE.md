# DATABASE DESIGN

## Database

PostgreSQL

ORM

Prisma ORM

---

# Entities

## User

Menyimpan seluruh akun.

Satu user dapat memiliki banyak role.

Relasi:

- User → Roles
- User → Wallet
- User → Address
- User → Review
- User → Orders

---

## Role

Role yang tersedia

- BUYER
- SELLER
- DRIVER
- ADMIN

Satu user dapat memiliki lebih dari satu role.

---

## Store

Toko milik seller.

Business Rule

- Nama toko harus unik.
- Satu seller hanya memiliki satu toko.

---

## Product

Produk yang dijual seller.

Memiliki:

- nama
- harga
- stok
- deskripsi
- gambar

---

## Wallet

Dompet digital buyer.

Memiliki:

- saldo

Seluruh perubahan saldo dicatat pada WalletTransaction.

---

## WalletTransaction

Riwayat seluruh transaksi wallet.

Jenis:

- TOPUP
- PAYMENT
- REFUND

---

## Address

Alamat pengiriman buyer.

Buyer dapat memiliki banyak alamat.

---

## Cart

Keranjang belanja.

Business Rule

Cart hanya boleh berasal dari satu toko.

---

## CartItem

Daftar produk di dalam cart.

---

## Order

Pesanan hasil checkout.

Status:

- SEDANG_DIKEMAS
- MENUNGGU_PENGIRIM
- SEDANG_DIKIRIM
- SELESAI
- DIBATALKAN
- REFUND

---

## OrderItem

Produk yang dibeli pada satu order.

---

## Voucher

Voucher diskon.

Memiliki:

- kode
- expiry
- usage limit

---

## Promo

Promo toko.

Memiliki expiry date.

---

## Review

Review publik.

Guest maupun user dapat memberikan review.

---

## DriverJob

Job yang diambil driver.

Satu order hanya boleh dimiliki satu driver.

---

## SellerIncome

Riwayat pendapatan seller.
