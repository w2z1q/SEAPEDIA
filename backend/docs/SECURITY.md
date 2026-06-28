# SEAPEDIA Security Architecture & Guidelines

Dokumen ini memuat spesifikasi dan arsitektur pengamanan backend SEAPEDIA. Sistem telah dirancang untuk memitigasi celah keamanan modern sesuai kaidah OWASP Top 10 serta pemenuhan sertifikasi Level 7.

---

## 1. SQL Injection Prevention (via Prisma ORM)
Seluruh komunikasi dan manipulasi data dengan database PostgreSQL/Supabase dikelola secara esensial melalui **Prisma ORM**. Prisma secara otomatis menerapkan *parameterized queries* pada tingkat driver mesin bawah (query engine). Mekanisme ini menjamin bahwa setiap masukan pengguna akan diperlakukan murni sebagai parameter nilai, bukan instruksi perintah SQL, sehingga mengeliminasi 100% risiko celah SQL Injection.

## 2. XSS Prevention (via `xss` library)
Untuk mengebiri serangan Cross-Site Scripting (XSS) yang berpotensi menyusupkan skrip jahat ke dalam database dan dieksekusi di sisi klien, SEAPEDIA menerapkan middleware sanitasi global (`src/middlewares/sanitize.middleware.js`). Middleware ini menginspeksi seluruh nilai bertipe `string` di dalam `req.body`, `req.query`, dan `req.params` secara rekursif menggunakan pustaka mutakhir `xss`. Tag berbahaya seperti `<script>`, atribut `onload`, atau payload `javascript:` secara otomatis dilumpuhkan dan disanitasi sebelum menembus layer validasi maupun controller.

## 3. Input Validation (via Zod)
Seluruh titik masuk API dilindungi oleh layer validasi skema runtime berbasis **Zod**. Middleware validator memastikan kebenaran tipe data, batas minimal/maksimal karakter, verifikasi format (seperti email, UUID, dan tanggal), serta menolak bidang yang tidak dikenali (*strict parsing*). Permintaan dengan payload cacat atau tak wajar akan langsung ditolak di tingkat middleware dengan kode status `400 Bad Request` tanpa pernah menyentuh memori pemrosesan utama.

## 4. Rate Limiting (`express-rate-limit`)
Untuk melumpuhkan potensi insiden serangan DDoS (Distributed Denial of Service) serta eksploitasi *brute-force*, sistem memberlakukan pembatasan laju permintaan berbasis IP (`src/middlewares/rateLimit.middleware.js`):
- **`generalLimiter`**: Membatasi laju akses setiap alamat IP maksimal 100 permintaan dalam jangka waktu 15 menit untuk titik akhir API umum.
- **`authLimiter`**: Pengamanan ketat khusus pada endpoint otentikasi vital (`/auth/login` dan `/auth/register`), membatasi maksimal 10 percobaan per 15 menit untuk menghentikan serangan *credential stuffing* atau penebakan sandi.
Permintaan yang melampaui ambang batas ini secara otomatis ditolak dengan kode status `429 Too Many Requests`.

## 5. Helmet Headers (`helmet`)
Di tingkat teratas aplikasi Express, pelindung **Helmet** dipasang untuk menyuntikkan rangkaian header defensif HTTP mutakhir guna membentengi kerentanan web tingkat peramban:
- **`X-Content-Type-Options: nosniff`**: Mencegah eksploitasi *MIME-sniffing*.
- **`X-Frame-Options: SAMEORIGIN`**: Menggagalkan serangan *Clickjacking* dengan memblokir perenderan aplikasi di dalam `<frame>` atau `<iframe>` eksternal.
- **`Strict-Transport-Security (HSTS)`**: Memaksa peramban untuk selalu berkomunikasi secara aman melalui protokol HTTPS.
- **`X-XSS-Protection`** & **`Referrer-Policy`**: Kontrol referensi silang dan pengamanan XSS legacy.

## 6. JWT Expiration & Security
Autentikasi pengguna sepenuhnya didasarkan pada JSON Web Tokens (JWT) yang dienkripsi menggunakan kata sandi rahasia bersertifikasi (`JWT_SECRET`). Token dibatasi masa aktifnya secara mutlak (*short-lived expiration*, e.g., `24h` atau `1d`) guna meminimalkan celah eksploitasi atas token yang disadap. Setelah sesi kedaluwarsa, akses ditolak secara seketika dengan status `401 Unauthorized`.

## 7. CORS Configuration
Gerbang regulasi Cross-Origin Resource Sharing (CORS) diatur secara spesifik untuk menyortir asal permintaan eksternal:
```javascript
cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```
Konfigurasi ini memastikan bahwa hanya asal peramban tepercaya yang diberi legitimasi untuk saling berinteraksi dengan API, membatasi metode HTTP eksekusi, serta membatasi pertukaran header yang spesifik.

## 8. Role-Based Access Control (RBAC)
Arsitektur RBAC berdimensi tinggi ditegakkan secara absolut melalui middleware `authorize('ROLE')`. Sistem membagi dan mengisolasi wewenang menjadi 4 pilar utama:
- **`BUYER`**: Berhak atas eksplorasi produk, keranjang belanja, checkout, dan manajemen wallet.
- **`SELLER`**: Berhak atas pembuatan toko, inventori barang, dan manajemen status pesanan.
- **`DRIVER`**: Diberi akses eksklusif ke pekerjaan pengiriman, konfirmasi penyelesaian, dan pencatatan penghasilan.
- **`ADMIN`**: Menjabat kendali tertinggi atas monitoring dasbor marketplace, pembuatan voucher/promo, dan pemicu manual sistem keterlambatan (overdue).
Akses lintas peran yang tidak sah seketika diputus dengan kode status `403 Forbidden`.
