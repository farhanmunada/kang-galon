import { getDeliveries } from '@/actions/deliveryActions';
import CourierDeliveryCard from '@/components/CourierDeliveryCard';
import { Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourierPage() {
  const allDeliveries = await getDeliveries();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-600" />
            Mode Operasional Kurir
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Jadwal pengantaran harian. Klik &quot;Mulai Antar&quot; lalu &quot;Selesai Terkirim&quot; saat galon tiba.
          </p>
        </div>
      </div>

      {allDeliveries.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-2">
          <Truck className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-700">Tidak ada jadwal pengantaran</h3>
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
