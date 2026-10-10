import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.ts';
import { hashPassword } from '../lib/crypto.ts';
import { generateDeliveryDates } from '../lib/domain/scheduler.ts';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('[SEED ERROR] DATABASE_URL tidak ditemukan di .env.local');
    process.exit(1);
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  console.log('[SEED] Memulai penyiapan data awal...');

  // 1. Bersihkan tabel lama (jika ada)
  try {
    await db.delete(schema.deliveries);
    await db.delete(schema.subscriptions);
    await db.delete(schema.customers);
    await db.delete(schema.users);
    console.log('[SEED] Data lama dibersihkan.');
  } catch (err) {
    console.log('[SEED] Melewati pembersihan jika tabel belum siap:', (err as any).message);
  }

  // 2. Buat Akun Pengguna (Owner & Courier)
  console.log('[SEED] Membuat akun pengguna...');
  const [owner] = await db
    .insert(schema.users)
    .values([
      {
        name: 'Haji Sukirman (Pemilik Depot)',
        email: 'owner@kanggalon.id',
        passwordHash: hashPassword('owner123'),
        role: 'OWNER',
      },
      {
        name: 'Agus Prayitno (Kurir Utama)',
        email: 'kurir@kanggalon.id',
        passwordHash: hashPassword('kurir123'),
        role: 'COURIER',
      },
      {
        name: 'Rian Hidayat (Kurir Lapangan)',
        email: 'kurir2@kanggalon.id',
        passwordHash: hashPassword('kurir123'),
        role: 'COURIER',
      },
    ])
    .returning();

  // 3. Buat Pelanggan Dummy Realistis
  console.log('[SEED] Menambahkan data pelanggan...');
  const insertedCustomers = await db
    .insert(schema.customers)
    .values([
      {
        name: 'Ibu Siti Rohmah',
        phone: '081298765431',
        address: 'Jl. Melati Blok C1 No. 5, Komplek Griya Asri',
      },
      {
        name: 'Pak Joko Susilo',
        phone: '081387654321',
        address: 'Jl. Anggrek Raya No. 18, RT 03/RW 05',
      },
      {
        name: 'Bu Dewi Lestari',
        phone: '081512349876',
        address: 'Cluster Cendana No. 7B, Dekat Pos Satpam',
      },
      {
        name: 'Pak Hendra Wijaya',
        phone: '082199887766',
        address: 'Perumahan Graha Indah Blok F No. 22',
      },
      {
        name: 'Warung Makan Bu Endang',
        phone: '087855667788',
        address: 'Jl. Raya Sukajaya No. 12 (Samping Alfamart)',
      },
      {
        name: 'Kedai Kopi Senja',
        phone: '081233445566',
        address: 'Ruko Boulevard Blok A3 No. 4',
      },
      {
        name: 'Bapak Danang Prasetyo',
        phone: '085699001122',
        address: 'Jl. Kemuning Indah No. 8, Belakang Masjid',
      },
      {
        name: 'Ibu Ratna Sari',
        phone: '085711223344',
        address: 'Jl. Merpati Putih No. 40, RT 01/RW 02',
      },
    ])
    .returning();

  // 4. Buat Paket Langganan untuk Setiap Pelanggan
  console.log('[SEED] Membuat paket langganan dan jadwal...');
  const today = new Date();
  const subConfigs = [
    { bottles: 2, interval: 3, batch: 5 },
    { bottles: 3, interval: 2, batch: 5 },
    { bottles: 1, interval: 7, batch: 4 },
    { bottles: 2, interval: 3, batch: 5 },
    { bottles: 4, interval: 2, batch: 6 },
    { bottles: 4, interval: 3, batch: 5 },
    { bottles: 2, interval: 4, batch: 4 },
    { bottles: 1, interval: 5, batch: 4 },
  ];

  for (let i = 0; i < insertedCustomers.length; i++) {
    const cust = insertedCustomers[i];
    const cfg = subConfigs[i];

    const [sub] = await db
      .insert(schema.subscriptions)
      .values({
        customerId: cust.id,
        bottlesPerDelivery: cfg.bottles,
        intervalDays: cfg.interval,
        startDate: today.toISOString().split('T')[0],
        status: 'ACTIVE',
      })
      .returning();

    // Generate jadwal
    const dates = generateDeliveryDates(today, cfg.interval, cfg.batch);

    for (let j = 0; j < dates.length; j++) {
      let status: 'PENDING' | 'DELIVERING' | 'DELIVERED' = 'PENDING';
      if (j === 0 && i % 2 === 0) {
        status = 'DELIVERED';
      } else if (j === 0 && i % 2 === 1) {
        status = 'DELIVERING';
      }

      await db.insert(schema.deliveries).values({
        subscriptionId: sub.id,
        deliveryDate: dates[j],
        bottleCount: cfg.bottles,
        status,
        notes: j === 0 ? 'Pengantaran prioritas pagi' : undefined,
      });
    }
  }

  console.log('[SEED BERHASIL] Selesai mengisi seluruh data dummy.');
  console.log('Kredensial Demo:');
  console.log('- Pemilik: owner@kanggalon.id / owner123');
  console.log('- Kurir  : kurir@kanggalon.id / kurir123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SEED GAGAL]', err);
  process.exit(1);
});
