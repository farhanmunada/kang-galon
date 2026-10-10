// main.js
// Antarmuka CLI interaktif menggunakan modul native node:readline

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { createDatabase } from './src/db.js';
import { DepotService } from './src/services/depotService.js';

const db = createDatabase('galon.db');
const service = new DepotService(db);
const rl = readline.createInterface({ input, output });

async function showMenu() {
  console.log('\n=== SISTEM DEPOT AIR KANG GALON ===');
  console.log('1. Tambah Pelanggan');
  console.log('2. Buat Langganan & Generate Jadwal');
  console.log('3. Lihat Antrean Pengantaran');
  console.log('4. Update Status Pengantaran (Kurir)');
  console.log('5. Keluar');
  return await rl.question('Pilih menu [1-5]: ');
}

async function handleAddCustomer() {
  console.log('\n-- Tambah Pelanggan Baru --');
  const name = await rl.question('Nama: ');
  const phone = await rl.question('Nomor HP: ');
  const address = await rl.question('Alamat: ');

  try {
    const id = service.addCustomer({ name, phone, address });
    console.log(`[SUKSES] Pelanggan terdaftar dengan ID: ${id}`);
  } catch (err) {
    console.error(`[GAGAL] ${err.message}`);
  }
}

async function handleCreateSubscription() {
  console.log('\n-- Buat Langganan --');
  const customerId = await rl.question('ID Pelanggan: ');
  const bottles = await rl.question('Jumlah galon per kirim: ');
  const interval = await rl.question('Selang hari (misal 3 = tiap 3 hari): ');
  const batch = await rl.question('Jumlah pengantaran yang di-generate (default 4): ');

  try {
    const res = service.createSubscription({
      customerId: Number(customerId),
      bottlesPerDelivery: Number(bottles),
      intervalDays: Number(interval),
      deliveryBatch: Number(batch) || 4,
    });
    console.log(`[SUKSES] Langganan ID ${res.subscriptionId} dibuat.`);
    console.log('Jadwal kirim terbentuk:', res.generatedDates.join(', '));
  } catch (err) {
    console.error(`[GAGAL] ${err.message}`);
  }
}

async function handleListDeliveries() {
  console.log('\n-- Antrean Pengantaran --');
  const filter = await rl.question('Filter status (Ketik PENDING/DELIVERING/DELIVERED atau Enter untuk semua): ');
  
  const statusFilter = filter.trim().toUpperCase() || null;
  const list = service.listDeliveries(statusFilter);

  if (list.length === 0) {
    console.log('Tidak ada data pengantaran.');
    return;
  }

  console.table(list.map(row => ({
    'ID Antar': row.delivery_id,
    'Tgl Kirim': row.delivery_date,
    'Pelanggan': row.customer_name,
    'Galon': row.bottle_count,
    'Status': row.status,
    'Alamat': row.customer_address
  })));
}

async function handleUpdateStatus() {
  console.log('\n-- Update Status Pengantaran --');
  const deliveryId = await rl.question('ID Antar: ');
  console.log('Pilihan status: DELIVERING, DELIVERED, CANCELLED');
  const nextStatus = await rl.question('Status baru: ');

  try {
    const res = service.updateDeliveryStatus(Number(deliveryId), nextStatus.trim().toUpperCase());
    console.log(`[SUKSES] ID ${res.deliveryId}: ${res.previousStatus} -> ${res.currentStatus}`);
  } catch (err) {
    console.error(`[GAGAL] ${err.message}`);
  }
}

async function main() {
  let running = true;

  while (running) {
    const choice = await showMenu();

    switch (choice.trim()) {
      case '1':
        await handleAddCustomer();
        break;
      case '2':
        await handleCreateSubscription();
        break;
      case '3':
        await handleListDeliveries();
        break;
      case '4':
        await handleUpdateStatus();
        break;
      case '5':
        console.log('Keluar dari sistem.');
        running = false;
        break;
      default:
        console.log('Pilihan tidak valid.');
    }
  }

  rl.close();
  process.exit(0);
}

main();
