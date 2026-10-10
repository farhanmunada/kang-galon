import { getCustomers } from '@/actions/customerActions';
import { getSubscriptions } from '@/actions/subscriptionActions';
import { getDeliveries } from '@/actions/deliveryActions';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { Users, CalendarCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [customersList, subsList, deliveriesList] = await Promise.all([
    getCustomers(),
    getSubscriptions(),
    getDeliveries(),
  ]);

  const pendingCount = deliveriesList.filter((d) => d.status === 'PENDING').length;
  const deliveringCount = deliveriesList.filter((d) => d.status === 'DELIVERING').length;
  const deliveredCount = deliveriesList.filter((d) => d.status === 'DELIVERED').length;

  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <div className="bg-linear-to-r from-sky-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Depot Air Minum &quot;Kang Galon&quot;
          </h1>
          <p className="text-sky-100 text-sm mt-1">
            Pantau langganan pelanggan dan distribusi pengantaran kurir secara real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/courier"
            className="px-4 py-2.5 bg-white text-sky-700 font-semibold text-sm rounded-xl hover:bg-sky-50 transition shadow-xs flex items-center gap-1.5"
          >
            <span>Buka Mode Kurir</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pelanggan</span>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{customersList.length}</div>
          <div className="text-xs text-slate-400 mt-1">Pelanggan terdaftar</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Langganan Aktif</span>
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {subsList.filter((s) => s.status === 'ACTIVE').length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Paket berulang</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Antrean Kirim</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            {pendingCount + deliveringCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">{deliveringCount} sedang di jalan</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Selesai Antar</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{deliveredCount}</div>
          <div className="text-xs text-slate-400 mt-1">Tugas selesai</div>
        </div>
      </div>

      {/* Recent Deliveries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">Jadwal Pengantaran Mendatang</h2>
          <Link href="/courier" className="text-xs font-semibold text-sky-600 hover:underline">
            Lihat Semua &rarr;
          </Link>
        </div>

        {deliveriesList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Belum ada jadwal pengantaran. Buat pelanggan dan langganan baru terlebih dahulu.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Pelanggan</th>
                  <th className="px-6 py-3">Jumlah</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Alamat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveriesList.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-medium text-slate-900">{item.deliveryDate}</td>
                    <td className="px-6 py-3 font-medium">{item.subscription.customer.name}</td>
                    <td className="px-6 py-3">
                      <span className="font-semibold text-slate-800">{item.bottleCount}</span> Galon
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-3 truncate max-w-xs">{item.subscription.customer.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
