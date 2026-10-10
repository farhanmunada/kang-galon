import { getDeliveries } from '@/actions/deliveryActions';
import CourierDeliveryCard from '@/components/CourierDeliveryCard';
import { Truck, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourierPage() {
  const allDeliveries = await getDeliveries();

  const pendingCount = allDeliveries.filter((d) => d.status === 'PENDING').length;
  const deliveringCount = allDeliveries.filter((d) => d.status === 'DELIVERING').length;
  const deliveredCount = allDeliveries.filter((d) => d.status === 'DELIVERED').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Kurir */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <Truck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal Pengantaran Kurir
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar tugas pengiriman galon aktif. Perbarui status saat tiba di lokasi pelanggan.
          </p>
        </div>

        {/* Mini Stats Bar */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount + deliveringCount} Sisa Tugas</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{deliveredCount} Selesai</span>
          </div>
        </div>
      </div>

      {allDeliveries.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-2">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">Tidak ada jadwal pengantaran</h3>
          <p className="text-xs text-slate-400">Semua tugas telah selesai atau belum ada jadwal dibuat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allDeliveries.map((delivery) => (
            <CourierDeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      )}
    </div>
  );
}
