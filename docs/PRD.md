# Product Requirement Document (PRD): Kang Galon Web System

## 1. Tujuan Produk (Objective)
Membangun platform operasional web terpadu untuk depot isi ulang air galon guna mengotomatisasi pencatatan langganan pelanggan, pembuatan jadwal antar berkala, dan pelacakan status tugas kurir secara real-time.

## 2. Asumsi & Batasan (Assumptions)
1. Sistem difokuskan untuk admin depot dan kurir (antarmuka mobile-responsive).
2. Database menggunakan PostgreSQL di cloud provider Neon.
3. Arsitektur dibangun menggunakan Next.js App Router (TypeScript).
4. Akses database menggunakan Drizzle ORM via driver HTTP/WebSocket serverless Neon.
5. Autentikasi tahap awal berbasis peran sederhana (Admin & Kurir).

## 3. Fitur Utama
### 3.1. Manajemen Pelanggan
- Tambah, ubah, dan nonaktifkan data pelanggan.
- Validasi nomor WhatsApp/HP Indonesia dan alamat detail + catatan patokan.

### 3.2. Manajemen Langganan & Jadwal
- Pembuatan kontrak langganan: kuota galon per antar, interval hari (misal tiap 3 hari), hari preferensi.
- Generator jadwal otomatis: membuat daftar tugas antar secara berkala dengan logika penanganan hari libur depot.

### 3.3. Dasbor Operasional Kurir & Tracking
- Tampilan daftar tugas antar hari ini terurut rute/waktu.
- Finite State Machine tracking: `PENDING` -> `DELIVERING` -> `DELIVERED` / `CANCELLED`.
- Tombol aksi cepat: sekali klik untuk hubungi WA pelanggan atau mulai pengantaran.

## 4. Rencana Skema Data (PostgreSQL)
- `customers`: `id`, `name`, `phone`, `address`, `created_at`
- `subscriptions`: `id`, `customer_id`, `bottles_per_delivery`, `interval_days`, `status`, `start_date`
- `deliveries`: `id`, `subscription_id`, `delivery_date`, `bottle_count`, `status`, `notes`, `updated_at`

## 5. Standar Teknis & Perintah
- **Framework**: Next.js 15+ (App Router), React 19, TypeScript.
- **ORM & DB**: Drizzle ORM, Neon Serverless Postgres.
- **Validasi**: Zod.
- **Styling**: Tailwind CSS.
- **Perintah Eksekusi**:
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Lint: `npm run lint`
  - Test: `npm test`
  - DB Migration: `npx drizzle-kit push` atau `npx drizzle-kit migrate`

## 6. Kriteria Keberhasilan (Success Criteria)
1. Admin dapat mendaftarkan pelanggan dan paket langganan dalam waktu < 1 menit.
2. Jadwal antar otomatis ter-generate tanpa tubrukan hari libur depot.
3. Kurir dapat memperbarui status pengantaran dari HP dan status ter-update instan.
4. Nilai Core Web Vitals hijau (LCP < 2.0s, CLS < 0.1).
5. Build dan Typecheck Next.js lulus 100% tanpa error TypeScript.
