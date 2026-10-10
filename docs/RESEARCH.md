# Dokumen Riset Arsitektur: Depot Kang Galon (Next.js + Neon DB)

## 1. Analisis Kebutuhan
Ekspansi platform web operasional depot air minum:
- **Autentikasi & RBAC (Role-Based Access Control)**:
  - Role `OWNER` (Pemilik): Akses penuh ke dasbor analitik, manajemen pelanggan, manajemen paket langganan, dan semua pengantaran.
  - Role `COURIER` (Pekerja/Kurir): Terkunci hanya ke portal tugas kurir (`/courier`), tanpa izin ubah data pelanggan atau paket.
- **Mekanisme Auth Native & Aman**:
  - Hashing password menggunakan `node:crypto` (`scrypt` native Node.js), nol dependensi bloat (tanpa butuh bcrypt C-bindings).
  - Session berbasis HTTP-only Cookie terenkripsi / signed token (stateless session cookie via `jose` atau HMAC SHA-256 native).
  - Route protection via Next.js Middleware (`src/middleware.ts`).
- **Seeding Dummy Data**:
  - Script seed terisolasi (`src/db/seed.ts`) yang mengisi akun owner, kurir, 10 data pelanggan realistis perumahan, langganan aktif, dan jadwal kirim bervariasi status (`PENDING`, `DELIVERING`, `DELIVERED`).
- **Modernisasi UI/UX**:
  - Desain modern bernuansa profesional (clean slate/indigo/sky palette, card layout, micro-interactions, mobile navigation khusus kurir).
  - Header interaktif: profil akun, role badge, tombol logout.

## 2. Pilihan Stack Database & ORM
- **Database**: Neon Serverless Postgres.
- **Konektor / ORM**: Drizzle ORM + `@neondatabase/serverless`.
- **Tabel Tambahan**: Tabel `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`).

## 3. Route Guard & Proteksi Hak Akses
- `/login`: Terbuka untuk umum (unauthenticated).
- `/courier`: Diizinkan untuk `OWNER` dan `COURIER`.
- `/`, `/customers`, `/subscriptions`: Hanya diizinkan untuk `OWNER`. Jika kurir mengakses, otomatis diarahkan (redirect) ke `/courier`.
