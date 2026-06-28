# SEAPEDIA Backend

Backend service untuk aplikasi marketplace SEAPEDIA, dikembangkan menggunakan Express.js dan Prisma ORM.

## Persyaratan
- Node.js (v18 atau lebih baru)
- PostgreSQL (Supabase)

## Instalasi

1. Masuk ke direktori `backend/`:
   ```bash
   cd backend
   ```

2. Instal seluruh dependensi:
   ```bash
   npm install
   ```

3. Salin file konfigurasi environment:
   ```bash
   cp .env.example .env
   ```
   Lalu sesuaikan nilai `DATABASE_URL` dan `JWT_SECRET`.

## Menjalankan Server

Untuk mode pengembangan (development) dengan `nodemon`:
```bash
npm run dev
```
Server akan berjalan di `http://localhost:5000`.

## Dokumentasi API (Swagger)
Ketika server berjalan, dokumentasi API Swagger dapat diakses melalui:
`http://localhost:5000/api-docs`
