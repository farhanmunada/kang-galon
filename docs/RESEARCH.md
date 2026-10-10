# Dokumen Riset Arsitektur: Depot Kang Galon (Next.js + Neon DB)

## 1. Analisis Kebutuhan
Transformasi dari purwarupa CLI native Node.js ke aplikasi web profesional berstandar industri:
- Manajemen pelanggan (CRM sederhana)
- Manajemen langganan berulang (frekuensi & kuota galon)
- Penjadwalan & tracking pengantaran kurir
- Database serverless cloud: Neon Postgres
- Framework: Next.js (App Router, Server Actions / Route Handlers, TypeScript)

## 2. Pilihan Stack Database & ORM
- **Database**: Neon Serverless Postgres.
- **Konektor / ORM**: Drizzle ORM + `@neondatabase/serverless`.
  - Alasan: Ringan, zero-cold-start overhead, tipe data TypeScript aman (type-safe), migrasi SQL deklaratif tanpa bloat engine binary seperti Prisma.
  - Alternatif: Native `@neondatabase/serverless` raw SQL. Drizzle dipilih untuk skalabilitas tim dan integritas skema.

## 3. Komponen Arsitektur Next.js
- **Routing**: Next.js App Router (`src/app/`).
- **Data Mutation**: Server Actions dengan validasi runtime (`zod`).
- **Styling**: Tailwind CSS + Shadcn UI primitives (Radix) untuk tampilan antarmuka kurir dan admin yang responsif di mobile.
- **Testing**: Vitest + Playwright (E2E).

## 4. Keamanan & Konfigurasi Lingkungan
- Variabel koneksi DB `DATABASE_URL` wajib disimpan di `.env.local` (tidak dicommit).
- Menggunakan pooling connection string dari Neon untuk efisiensi serverless function.
