# Arsitektur Teknis: Depot Kang Galon (Next.js + Neon DB)

## 1. Desain Arsitektur Sistem

Aplikasi menggunakan arsitektur monolit modular Next.js App Router:
- **Presentation Layer**: React Server Components (RSC) untuk fetching data cepat tanpa JS bundle berlebih di client, dan Client Components hanya untuk interaktivitas UI (form, tombol status kurir).
- **Domain & Service Layer**: Logika murni scheduler, state machine pengantaran, dan isolasi bisnis (`src/lib/domain/`, `src/lib/services/`).
- **Data Access Layer**: Drizzle ORM terhubung ke Neon PostgreSQL via connection pool HTTP driver.

## 2. Skema Database Relasional (PostgreSQL)

```sql
-- ENUM Tipe Status
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');
CREATE TYPE delivery_status AS ENUM ('PENDING', 'DELIVERING', 'DELIVERED', 'CANCELLED');

-- Tabel Pelanggan
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabel Kontrak Langganan
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  bottles_per_delivery INT NOT NULL CHECK (bottles_per_delivery > 0),
  interval_days INT NOT NULL CHECK (interval_days > 0),
  status subscription_status DEFAULT 'ACTIVE' NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabel Jadwal & Tracking Pengantaran
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  bottle_count INT NOT NULL CHECK (bottle_count > 0),
  status delivery_status DEFAULT 'PENDING' NOT NULL,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_deliveries_date_status ON deliveries(delivery_date, status);
CREATE INDEX idx_subscriptions_customer ON subscriptions(customer_id);
```

## 3. Struktur Direktori Proyek

```
kang-galon/
├── docs/                        # Dokumentasi arsitektur, PRD, riset
├── drizzle/                     # File migrasi SQL hasil generate Drizzle
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Layout utama + Tailwind styling
│   │   ├── page.tsx             # Halaman dasbor ringkasan
│   │   ├── customers/           # Manajemen data pelanggan
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   ├── subscriptions/       # Pembuatan paket langganan
│   │   │   └── page.tsx
│   │   └── courier/             # Dasbor khusus kurir (mobile-friendly)
│   │       └── page.tsx
│   ├── actions/                 # Server Actions (Mutasi aman)
│   │   ├── customerActions.ts
│   │   ├── subscriptionActions.ts
│   │   └── deliveryActions.ts
│   ├── components/              # Komponen UI modular
│   │   ├── ui/                  # Primitif button, card, input, badge
│   │   ├── CustomerTable.tsx
│   │   ├── DeliveryCard.tsx
│   │   └── StatusBadge.tsx
│   ├── db/                      # Konfigurasi database & skema
│   │   ├── index.ts             # Inisialisasi koneksi Neon Drizzle
│   │   └── schema.ts            # Definisi tabel Drizzle
│   └── lib/                     # Domain logic
│       ├── scheduler.ts         # Algoritma hitung tanggal & libur
│       ├── stateMachine.ts      # Aturan FSM status pengantaran
│       └── validations.ts       # Skema Zod
├── drizzle.config.ts            # Konfigurasi Drizzle Kit
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 4. Alur Kerja Server Actions & FSM Tracking Kurir
1. Kurir membuka `/courier` di smartphone.
2. Server merender pengantaran hari ini (`delivery_date = CURRENT_DATE`) berstatus `PENDING` atau `DELIVERING`.
3. Kurir klik tombol "Mulai Antar": memicu Server Action `updateDeliveryStatus(id, 'DELIVERING')`.
4. Logic memvalidasi via `stateMachine.ts`. Jika lolos, baris DB diperbarui dan cache halaman di-revalidate (`revalidatePath('/courier')`).
5. Kurir sampai tujuan, klik "Selesai": update ke `DELIVERED`.

## 5. Rencana Tahapan Eksekusi (Tasks Breakdown)
- **Tahap 1**: Inisialisasi Next.js (TypeScript, Tailwind, Drizzle, `@neondatabase/serverless`).
- **Tahap 2**: Setup skema database Drizzle & migrasi tabel ke Neon.
- **Tahap 3**: Porting dan adaptasi domain logic (`scheduler` & `stateMachine`) ke TypeScript + unit test.
- **Tahap 4**: Pembuatan Server Actions & validasi Zod.
- **Tahap 5**: Pembuatan halaman UI (Dasbor Admin, Manajemen Pelanggan, Dasbor Kurir).
- **Tahap 6**: Verifikasi end-to-end (lint, typecheck, build, test).
